import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    userType: {
        type: String,
        default: 'farmer'
    },
    notifications: [{
        message: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    farmLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, {
    timestamps: true,
});

farmerSchema.index({ farmLocation: '2dsphere' });

const farmerModel = mongoose.model("farmer", farmerSchema);

export default farmerModel;
