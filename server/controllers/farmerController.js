import Farmer from "../models/farmerModel.js";
import PlantHistory from "../models/plantHistoryModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import { s3Uploadv2 } from "../utils/s3.js";
import geolib from "geolib";

export const getProfile = catchAsyncError(async (req, res, next) => {
  const farmerId = req.user.id;

  const farmer = await Farmer.findById(farmerId);

  if (!farmer) {
    return res
      .status(404)
      .json({ success: false, message: "Farmer not found" });
  }

  res.status(200).json({ success: true, data: farmer });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const farmerId = req.user.id;
  const updatedData = req.body;

  const updatedFarmer = await Farmer.findByIdAndUpdate(farmerId, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!updatedFarmer) {
    return res
      .status(404)
      .json({ success: false, message: "Farmer not found" });
  }

  res.status(200).json({ success: true, data: updatedFarmer });
});

export const uploadImage = catchAsyncError(async (req, res, next) => {
  const { originalname, buffer } = req.file;

  const s3Response = await s3Uploadv2({
    originalname,
    buffer,
    onProgress: (loaded, total) => {
      try {
        const percent = Math.round((loaded * 100) / total);
        console.log(`Progress: ${percent}%`);
        res.write(`data: ${JSON.stringify({ progress: percent })}\n\n`);
      } catch (error) {
        console.error("Error sending SSE update:", error);
      }
    },
  });

  return res
    .status(200)
    .json({
      success: true,
      message: "Image file uploaded successfully.",
      s3Response,
    });
});

export const storePlantHistory = catchAsyncError(async (req, res, next) => {
  const farmerId = req.user.id;
  const data = req.body;
  data.farmer = farmerId;

  const farmer = await Farmer.findById(farmerId);

  const createdData = await PlantHistory.create(data);

  const prediction = {
    disease: "Powdery Mildew",
    confidence: 0.92,
    description:
      "Powdery mildew is a fungal disease that appears as white powdery spots on both sides of leaves.",
    remedy:
      "Apply a sulfur‑based fungicide at first sign; improve air circulation around your plants.",
  };

  const nearbyFarmers = await Farmer.find({
    userType: "farmer",
    farmLocation: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: farmer.farmLocation.coordinates,
        },
        $maxDistance: 5000,
      },
    },
  });

  const notificationMessage = `New disease in your area identified: ${data.description}`;

  await Promise.all(
    nearbyFarmers.map(async (farmer) => {
      farmer.notifications.unshift({ message: notificationMessage });
      await farmer.save();
    })
  );

  res.status(200).json({ success: true, data: createdData,prediction });
});

export const getPlantHistory = catchAsyncError(async (req, res, next) => {
  const farmerId = req.user.id;

  const data = await PlantHistory.find({ farmer: farmerId });

  res.status(200).json({ success: true, data });
});

export const deletePlantHistory = catchAsyncError(async (req, res, next) => {
  const farmerId = req.user.id;
  const id = req.params.id;

  const data = await PlantHistory.findByIdAndDelete(id);

  if (!data) {
    return res
      .status(404)
      .json({ success: false, message: "Plant history not found" });
  }

  res.status(200).json({ success: true, data });
});

export const deleteNotification = catchAsyncError(async (req, res, next) => {
  const farmerId = req.user.id;
  const index = req.body.index;

  const farmer = await Farmer.findById(farmerId);

  farmer.notifications.splice(index, 1);
  await farmer.save();

  res.status(200).json({ success: true, farmer });
});
