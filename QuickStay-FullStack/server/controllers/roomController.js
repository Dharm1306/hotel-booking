import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

const buildHeuristicCriteria = (query, cities) => {
  const text = (query || "").toLowerCase().trim();
  const roomTypeRules = [
    { key: "single", value: "Single Bed" },
    { key: "double", value: "Double Bed" },
    { key: "luxury", value: "Luxury Room" },
    { key: "suite", value: "Family Suite" },
    { key: "family", value: "Family Suite" },
  ];

  const amenityRules = [
    { key: "wifi", value: "Free WiFi" },
    { key: "breakfast", value: "Free Breakfast" },
    { key: "room service", value: "Room Service" },
    { key: "mountain", value: "Mountain View" },
    { key: "pool", value: "Pool Access" },
  ];

  const matchedCities = cities.filter((city) => text.includes(city.toLowerCase()));
  const roomTypes = [...new Set(roomTypeRules.filter((rule) => text.includes(rule.key)).map((rule) => rule.value))];
  const amenities = [...new Set(amenityRules.filter((rule) => text.includes(rule.key)).map((rule) => rule.value))];

  const numbers = [...text.matchAll(/\d{2,5}/g)].map((match) => Number(match[0]));
  let maxPrice = null;
  let minPrice = null;

  if (text.includes("under") || text.includes("below") || text.includes("max")) {
    maxPrice = numbers[0] || null;
  } else if (text.includes("above") || text.includes("over") || text.includes("minimum")) {
    minPrice = numbers[0] || null;
  } else if (text.includes("between") && numbers.length >= 2) {
    minPrice = Math.min(numbers[0], numbers[1]);
    maxPrice = Math.max(numbers[0], numbers[1]);
  }

  let sort = "";
  if (text.includes("cheap") || text.includes("budget") || text.includes("lowest")) {
    sort = "Price Low to High";
  } else if (text.includes("premium") || text.includes("expensive") || text.includes("highest")) {
    sort = "Price High to Low";
  } else if (text.includes("new")) {
    sort = "Newest First";
  }

  return {
    cities: matchedCities,
    roomTypes,
    amenities,
    minPrice,
    maxPrice,
    sort,
  };
};

const scoreRoom = (room, criteria) => {
  let score = 0;

  if (criteria.cities.length) {
    if (criteria.cities.includes(room?.hotel?.city)) {
      score += 4;
    } else {
      return -1;
    }
  }

  if (criteria.roomTypes.length) {
    if (criteria.roomTypes.includes(room.roomType)) {
      score += 3;
    } else {
      return -1;
    }
  }

  if (criteria.amenities.length) {
    const amenityMatches = criteria.amenities.filter((item) => room.amenities.includes(item)).length;
    if (amenityMatches === 0) {
      return -1;
    }
    score += amenityMatches;
  }

  if (criteria.minPrice !== null && room.pricePerNight < criteria.minPrice) {
    return -1;
  }
  if (criteria.maxPrice !== null && room.pricePerNight > criteria.maxPrice) {
    return -1;
  }

  if (criteria.sort === "Price Low to High") {
    score += Math.max(0, 10000 - room.pricePerNight) / 10000;
  } else if (criteria.sort === "Price High to Low") {
    score += room.pricePerNight / 10000;
  }

  return score;
};

const getOpenAICriteria = async (query, cities) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Convert hotel search text to JSON with keys: cities(string[]), roomTypes(string[]), amenities(string[]), minPrice(number|null), maxPrice(number|null), sort(string). Allowed roomTypes: Single Bed, Double Bed, Luxury Room, Family Suite. Allowed amenities: Free WiFi, Free Breakfast, Room Service, Mountain View, Pool Access. Allowed sort: Price Low to High, Price High to Low, Newest First, or empty string.",
        },
        {
          role: "user",
          content: `Cities in dataset: ${cities.join(", ")}. Query: ${query}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status})`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  const parsed = JSON.parse(content);
  return {
    cities: Array.isArray(parsed.cities) ? parsed.cities : [],
    roomTypes: Array.isArray(parsed.roomTypes) ? parsed.roomTypes : [],
    amenities: Array.isArray(parsed.amenities) ? parsed.amenities : [],
    minPrice: typeof parsed.minPrice === "number" ? parsed.minPrice : null,
    maxPrice: typeof parsed.maxPrice === "number" ? parsed.maxPrice : null,
    sort: typeof parsed.sort === "string" ? parsed.sort : "",
  };
};

// ✅ CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const numericPrice = Number(pricePerNight);

    if (!Number.isFinite(numericPrice) || numericPrice < 500) {
      return res.json({ success: false, message: "Price per night must be at least 500" });
    }

    const hotel = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    // Upload images
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    // ✅ IMPORTANT: hotel._id must be ObjectId
    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: numericPrice,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ GET ALL ROOMS
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ GET OWNER ROOMS (🔥 FIXED)
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotelData) {
      return res.json({ success: false, message: "No hotel found" });
    }

    // ❌ OLD (WRONG)
    // Room.find({ hotel: hotelData._id.toString() })

    // ✅ NEW (CORRECT)
    const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");

    res.json({ success: true, rooms });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ TOGGLE ROOM AVAILABILITY
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    const roomData = await Room.findById(roomId);

    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    roomData.isAvailable = !roomData.isAvailable;

    await roomData.save();

    res.json({ success: true, message: "Room availability updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ AI SEARCH ROOMS
export const aiSearchRooms = async (req, res) => {
  try {
    const query = req.body?.query?.trim();

    if (!query) {
      return res.json({ success: true, roomIds: [], source: "none", criteria: null });
    }

    const rooms = await Room.find({ isAvailable: true })
      .populate({ path: "hotel", populate: { path: "owner", select: "image" } })
      .sort({ createdAt: -1 });

    const cities = [...new Set(rooms.map((room) => room?.hotel?.city).filter(Boolean))];

    let criteria = null;
    let source = "heuristic";

    if (process.env.OPENAI_API_KEY) {
      try {
        criteria = await getOpenAICriteria(query, cities);
        source = "openai";
      } catch (error) {
        console.warn("[aiSearchRooms] OpenAI failed, falling back to heuristic:", error.message);
      }
    }

    if (!criteria) {
      criteria = buildHeuristicCriteria(query, cities);
    }

    const ranked = rooms
      .map((room) => ({ room, score: scoreRoom(room, criteria) }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        if (criteria.sort === "Price Low to High") {
          return a.room.pricePerNight - b.room.pricePerNight;
        }
        if (criteria.sort === "Price High to Low") {
          return b.room.pricePerNight - a.room.pricePerNight;
        }
        if (criteria.sort === "Newest First") {
          return new Date(b.room.createdAt) - new Date(a.room.createdAt);
        }
        return new Date(b.room.createdAt) - new Date(a.room.createdAt);
      });

    return res.json({
      success: true,
      roomIds: ranked.map((item) => String(item.room._id)),
      source,
      criteria,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};