import { useDispatch } from "react-redux";
import api from "./axios";
import { getError } from "./getError";
// import axiosInstance from "./axiosUtil";
// import { getError } from "./error";





export const uploadImage = async (file, token, percentHandler) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        percentHandler(percent);
        console.log(`${loaded}kb of ${total}kb | ${percent}`);
      },
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    };
    const { data } = await api.post(
      "/api/farmer/image",
      bodyFormData,
      options
    );
    console.log("Image data:",data);
    if (data) {      
      console.log("location", data.s3Response.Location);
      return data.s3Response.Location;
    }
  } catch (err) {
    getError(err);
  }
};
