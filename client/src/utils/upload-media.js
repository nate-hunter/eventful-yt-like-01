import axios from "axios";


export const uploadMedia = async ({ type, file, preset }) => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/pandaboogie/${type}/upload`;

    const formData = new FormData();
    formData.append('upload_preset', preset);
    formData.append('file', file);

    const data = await axios.post(cloudinaryUrl, formData)
        .then(resp => resp.data);

    return data.secure_url;
}
