import User from "../models/User.js";
import { getAuth } from "@clerk/express";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const userId = auth?.userId;
    const claims = auth?.sessionClaims || {};
    const fallbackEmail =
      claims.email ||
      claims.primary_email_address ||
      claims.email_address ||
      claims?.email_addresses?.[0]?.email_address ||
      `${userId}@quickstay.local`;
    const fallbackFirstName = claims.first_name || claims.given_name || "";
    const fallbackLastName = claims.last_name || claims.family_name || "";
    const fallbackUsername = `${fallbackFirstName} ${fallbackLastName}`.trim() || claims.username || "QuickStay User";
    const fallbackImage = claims.image_url || "https://picsum.photos/seed/quickstay-user/150/150";

    if (!userId) {
      return res.status(401).json({ success: false, message: "not authenticated" });
    }

    let user;
    try {
      user = await User.findOne({ _id: userId });
    } catch (findError) {
      console.error("[protect] find user failed", findError);
    }

    if (!user) {
      try {
        // Upsert avoids races when webhook and request create the same user concurrently.
        user = await User.findByIdAndUpdate(
          userId,
          {
            $setOnInsert: {
              _id: userId,
              username: fallbackUsername,
              email: fallbackEmail,
              image: fallbackImage,
              role: "user",
              recentSearchedCities: [],
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (upsertError) {
        console.error("[protect] upsert user failed", upsertError);
        // Retry read in case another request created the user concurrently.
        try {
          user = await User.findOne({ _id: userId });
        } catch (retryError) {
          console.error("[protect] retry find user failed", retryError);
        }
      }
    }

    if (!user) {
      // Allow request flow with a safe fallback profile to avoid blocking authenticated users.
      user = {
        _id: userId,
        username: fallbackUsername,
        email: fallbackEmail,
        image: fallbackImage,
        role: "user",
        recentSearchedCities: [],
      };
    }

    req.auth = auth;
    req.user = user;
    next();
  } catch (error) {
    console.error("[protect] auth middleware error", error);
    return res.status(500).json({ success: false, message: "Authentication middleware failed" });
  }
};
