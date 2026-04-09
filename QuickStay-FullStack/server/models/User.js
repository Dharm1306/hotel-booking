import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, default: "https://picsum.photos/seed/quickstay-user/150/150" },
    role: { type: String, enum: ["user", "hotelOwner"], default: "user", },
    recentSearchedCities: [{ type: String, required: true }],
  }, { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;