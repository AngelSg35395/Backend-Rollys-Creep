import axios from "axios";
import supabase from "./supabase.js";

export async function uploadImageFromUrl(imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

        const imageBuffer = Buffer.from(response.data);

        const fileName = `img_${Date.now()}.jpg`;

        const { data, error } = await supabase
            .storage
            .from("product-images")
            .upload(fileName, imageBuffer, {
                contentType: "image/jpeg",
            });

        if (error) throw error;

        // Return the URL of the uploaded image
        const publicUrl = supabase
            .storage
            .from("product-images")
            .getPublicUrl(fileName).data.publicUrl;

        return publicUrl;
    } catch (error) {
        console.log(error);
        return null;
    }
}