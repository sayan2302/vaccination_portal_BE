import mongoose from "mongoose";

const Schema = mongoose.Schema({
    studentId: { type: Number, required: true, unique: true },
    studentName: { type: String, required: true },
    grade: { type: Number, required: true },
    vaccinations: { type: [String], required: true },
});

const Student = mongoose.model("student", Schema);

export default Student;