import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// API to create a new hotel
// POST /api/hotels
export const registerHotel = async (req, res) => {
  try {

    const { name, address, contact, ownerContact, city } = req.body;
    const owner = req.user._id;
    const cleanedOwnerContact = (ownerContact || contact || "").trim();

    if (!name || !address || !contact || !city) {
      return res.json({ success: false, message: "Missing required hotel details" });
    }

    // Check if User Already Registered
    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res.json({ success: false, message: "Hotel Already Registered" });
    }

    await Hotel.create({ name, address, contact, ownerContact: cleanedOwnerContact, city, owner });

    // Update User Role
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};