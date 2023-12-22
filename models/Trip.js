import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    pickupTime: { type: String, required: true },
    returnTime: { type: String },
    departmentOfApproval: { type: String, required: true },
    departmentApproval: { type: Boolean, default: true },
    isOneWay: { type: Boolean, default: false },
    numberOfPeople: { type: Number, required: true },
    contactDetails: { type: String, required: true },
    comments: { type: String },
    approvalStatus: { type: String, enum: ['Approved', 'Submitted', 'Denied'], default: 'Submitted' },
    nitishStatus: { type: String, enum: ['Submitted', 'Pending'], default: 'Pending' },
    organizer: { type: Schema.Types.ObjectId, ref: 'User' },
    organizerEmail:{type: String},
    organizerName:{type: String}
});

export const Trip = mongoose.model('Trip', tripSchema);


