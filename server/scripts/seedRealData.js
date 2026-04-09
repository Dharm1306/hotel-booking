import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

const DEMO_OWNER_ID = "demo-owner-1";

const hotelsSeed = [
  {
    name: "Harbor Lights Hotel",
    address: "Pier 27, Fisherman's Wharf, San Francisco",
    contact: "+1-415-221-9001",
    ownerContact: "+1-415-221-9001",
    city: "San Francisco",
  },
  {
    name: "Maple Grand Suites",
    address: "88 Queen St W, Downtown Toronto",
    contact: "+1-416-555-2209",
    ownerContact: "+1-416-555-2209",
    city: "Toronto",
  },
  {
    name: "Sakura City Inn",
    address: "2-14-8 Shibuya, Tokyo",
    contact: "+81-3-5544-1188",
    ownerContact: "+81-3-5544-1188",
    city: "Tokyo",
  },
  {
    name: "Riviera Crown Resort",
    address: "11 Promenade des Anglais, Nice",
    contact: "+33-4-93-010-222",
    ownerContact: "+33-4-93-010-222",
    city: "Nice",
  },
];

const roomCatalog = [
  {
    roomType: "Single Bed",
    pricePerNight: 500,
    amenities: ["Free WiFi", "Room Service"],
    images: [
      "https://picsum.photos/id/1048/1200/800",
      "https://picsum.photos/id/1050/1200/800",
    ],
  },
  {
    roomType: "Double Bed",
    pricePerNight: 900,
    amenities: ["Free WiFi", "Free Breakfast", "Room Service"],
    images: [
      "https://picsum.photos/id/1031/1200/800",
      "https://picsum.photos/id/1032/1200/800",
    ],
  },
  {
    roomType: "Luxury Room",
    pricePerNight: 1400,
    amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
    images: [
      "https://picsum.photos/id/1025/1200/800",
      "https://picsum.photos/id/1029/1200/800",
    ],
  },
  {
    roomType: "Family Suite",
    pricePerNight: 2200,
    amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access", "Mountain View"],
    images: [
      "https://picsum.photos/id/1036/1200/800",
      "https://picsum.photos/id/1040/1200/800",
    ],
  },
];

const seedRealData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    await User.findByIdAndUpdate(
      DEMO_OWNER_ID,
      {
        _id: DEMO_OWNER_ID,
        username: "Demo Hotel Owner",
        email: "owner@quickstay.demo",
        image: "https://picsum.photos/id/1005/400/400",
        role: "hotelOwner",
        recentSearchedCities: [],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Room.deleteMany({});
    await Hotel.deleteMany({ owner: DEMO_OWNER_ID });

    const hotels = await Hotel.insertMany(
      hotelsSeed.map((hotel) => ({ ...hotel, owner: DEMO_OWNER_ID }))
    );

    const roomsToInsert = [];
    for (const [index, hotel] of hotels.entries()) {
      const priceDelta = index * 200;
      for (const room of roomCatalog) {
        roomsToInsert.push({
          hotel: hotel._id,
          roomType: room.roomType,
          pricePerNight: room.pricePerNight + priceDelta,
          amenities: room.amenities,
          images: room.images,
          isAvailable: true,
        });
      }
    }

    await Room.insertMany(roomsToInsert);

    console.log(`Seed complete: ${hotels.length} hotels, ${roomsToInsert.length} rooms.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect().catch(() => null);
    process.exit(1);
  }
};

seedRealData();