import app from "./app.js";
import cloudinary from "cloudinary";       
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY  
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})