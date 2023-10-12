import cloudinary from "cloudinary";

const cloud = cloudinary.v2;

cloud.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.Api_key,
  api_secret: process.env.Api_secret,
});

export { cloud };