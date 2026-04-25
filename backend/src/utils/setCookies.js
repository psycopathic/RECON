import dotenv from "dotenv";
dotenv.config();

export const setCookies = async (res, refreshToken, accessToken) =>{
  res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ✅ dynamic
  // Stripe redirects users back from stripe.com, so strict would drop cookies.
  sameSite: "lax",
  maxAge: 15 * 60 * 1000, // ✅ 15 minutes
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Keep refresh cookie available on top-level cross-site redirects.
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
});

}