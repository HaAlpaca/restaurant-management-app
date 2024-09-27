import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const checkCloudinary = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary status:", result.status);
    return true;
  } catch (error) {
    console.error("Failed to connect to Cloudinary:", error.message);
    return false;
  }
};

export default cloudinary;
