
import cloudinary from "../config/cloudinary.js";

export const CreateSignature =  async (req,res)=>{
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const folder = req.body.folder || "uploads";

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            folder,
        },
        process.env.CLOUDINARY_API_SECRET
    );

    return res.json(
        {
            timestamp,
            signature,
            apiKey:process.env.CLOUDINARY_API_KEY,
            cloudName:process.env.CLOUDINARY_CLOUD_NAME,
        }
    )
    
}

