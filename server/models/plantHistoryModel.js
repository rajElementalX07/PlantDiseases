import mongoose from "mongoose";

const plantHistorySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "farmer",
    required: true
  }
}, {
  timestamps: true
});

const PlantHistoryModel = mongoose.model("PlantHistory", plantHistorySchema);

export default PlantHistoryModel;
