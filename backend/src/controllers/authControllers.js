import User from "../models/userModel.js";
import { generateToken } from "../utils/token.js";
import { storeRefreshToken } from "../utils/storeRefreshToken.js";
import { setCookies } from "../utils/setCookies.js";
import bcrypt from "bcryptjs";
import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    // 1. Input validation
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).send("Please fill all the fields");
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    // console.log(userExists);
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    // 3. Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    // 4. Generate auth tokens
    const { accessToken, refreshToken } = generateToken(user._id);

    // 5. Store refresh token
    await storeRefreshToken(user._id, refreshToken);

    // 6. Set cookies
    setCookies(res, refreshToken, accessToken);

    // 7. Send response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    // console.log("user")
    if (!user) {
      console.log(1);
      return res.status(400).send("User not found");
    }
    console.log(2)
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch)
    if (!isMatch) {
      console.log(3)
      return res.status(400).send("Invalid credentials");
    }
    console.log(4)
    const { accessToken, refreshToken } = generateToken(user._id);
    console.log(5);
    await storeRefreshToken(user._id, refreshToken);
    console.log(6)
    setCookies(res, refreshToken, accessToken);
    console.log(7)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Login successful",
    });
  } catch (error) {
    console.log(8);
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh token :${decoded.userId}`);
    }
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//this will recreate an access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token not found" }); // ✅ return here
    }

    const decoded = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const storedToken = await redis.get(`refresh token :${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(400).json({ message: "Invalid refresh token" }); // ✅ return here
    }

    const accessToken = await jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }); // ✅ good to return here too
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    res.json(req.user);
    console.log(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
