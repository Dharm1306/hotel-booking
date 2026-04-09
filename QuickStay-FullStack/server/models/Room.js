import mongoose from "mongoose";
const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    // ✅ FIXED: ObjectId instead of String
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true, min: 500 },
    amenities: { type: Array, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;