import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res,next) => {
  const { username, email, password } = req.body
  const hashedPassword = bcrypt.hashSync(password, 10)
  const newUser = new User({ username, email, password: hashedPassword });
  try {
     await newUser.save();
    res.status(201).json("user created successfully")
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res,next) => {
  const { email, password } = req.body;
try {
  const validUser = await User.findOne({ email });
  if (!validUser) {
    return next(errorHandler(404, "User not found"));
  }
  const validPassword = bcrypt.compareSync(password,validUser.password);
  if (!validPassword) {
    return next(errorHandler(400, "Invalid credential!"));
  }

  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
  const { password: pass, ...rest } = validUser._doc;

  res.cookie("access_token", token, {httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }).status(200).json(rest);
} catch (error) {
  next(error);
}
}

export const google = async (req, res, next) => {
 try {
  const { email, name, photo, avatar_url, picture, providerToken, user_metadata } = req.body;

  if (!email) {
    return next(errorHandler(400, "Email is required"));
  }

  let googleAvatar = photo || avatar_url || picture || user_metadata?.avatar_url || user_metadata?.picture || user_metadata?.picture_url;
  const displayName = name || user_metadata?.full_name || user_metadata?.name || user_metadata?.display_name || email.split("@")[0];

  if (!googleAvatar && providerToken) {
    try {
      const googleResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${providerToken}`,
        },
      });

      if (googleResponse.ok) {
        const googleUserInfo = await googleResponse.json();
        googleAvatar = googleUserInfo.picture || googleUserInfo.avatar_url || "";
      }
    } catch (fetchError) {
      console.log("could not load google avatar", fetchError);
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (googleAvatar && existingUser.avatar !== googleAvatar) {
      existingUser.avatar = googleAvatar;
      await existingUser.save();
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
    const { password, ...rest } = existingUser._doc;
    return res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
  }

  const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
  const usernameBase = displayName.split(" ").join("").toLowerCase() || email.split("@")[0];
  const newUser = new User({
    username: `${usernameBase}${Math.random().toString(36).slice(-4)}`,
    email,
    password: hashedPassword,
    ...(googleAvatar ? { avatar: googleAvatar } : {}),
  });
  await newUser.save();
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
  const { password, ...rest } = newUser._doc;
  res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
 } catch (error) {
  next(error);
 }
}