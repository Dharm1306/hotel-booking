import "dotenv/config";
import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";

const normalizePhone = (value) => {
  if (!value) return "";
  return String(value).trim();
};

const backfillOwnerContact = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const hotels = await Hotel.find({}, "_id contact ownerContact");
    let updatedCount = 0;

    for (const hotel of hotels) {
      const existingOwnerContact = normalizePhone(hotel.ownerContact);
      const fallbackContact = normalizePhone(hotel.contact);

      if (!existingOwnerContact && fallbackContact) {
        hotel.ownerContact = fallbackContact;
        await hotel.save();
        updatedCount += 1;
      }
    }

    console.log(`Backfill complete: ${updatedCount} hotel(s) updated.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error.message);
    await mongoose.disconnect().catch(() => null);
    process.exit(1);
  }
};

backfillOwnerContact();
