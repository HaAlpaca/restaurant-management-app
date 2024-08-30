import cloudinary from "../utils/cloudinary.js";

const testUser = async (req, res) => {
  try {
    res.status(200).json({name: "alpaca", mail: "alpaca@gmail.com"})
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(`Error in getUserProfile: ${err.message}`);
  }
};

const testUpload = async (req,res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path,{
      folder: 'RestaurantManagementSystemApp/images'
    })
    console.log(result)
    if (!result) {
      res.status(500).json({ message: "Error in Upload" });
    }
    
    res.status(200).json({imgUrl: result.url})
  
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(`Error in Upload: ${err.message}`);
  }
}

export { testUser, testUpload};