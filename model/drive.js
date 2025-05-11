import mongoose from "mongoose";

const Schema = mongoose.Schema({
    driveId: { type: Number, required: true, unique: true },
    vaccineName: { type: String, required: true },
    startDate: { type: Date, required: true },
    availableDoses: { type: Number, required: true },
    applicableClasses: { type: [Number], required: true },
});

const Drive = mongoose.model("drive", Schema);

export default Drive;