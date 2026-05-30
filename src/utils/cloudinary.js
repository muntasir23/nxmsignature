import axios from "axios";

export const uploadMultipleImages = async (files) => {

  const uploadedUrls = [];

  for (const file of files) {

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",
      "nxm_signature"
    );

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dmuj1bslb/image/upload",
      formData
    );

    uploadedUrls.push(res.data.secure_url);
  }

  return uploadedUrls;
};