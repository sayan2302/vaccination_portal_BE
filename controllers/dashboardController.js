import Drive from "../model/drive.js";
import Student from "../model/student.js";

export const getDashboardDetails = async (req, res) => {
    try {
        // Fetch dashboard details from the database
        const totalStudents = await Student.countDocuments({});
        const nonVaxStudents = await Student.countDocuments({ vaccinations: { $size: 0 } });
        // if (totalStudents === 0) { return res.status(404).json({ message: 'No students registered!' }); }


        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);

        const drives = await Drive.find({
            startDate: {
                $gte: today,
                $lte: next30Days
            }
        });

        return res.status(200).json({ totalStudents, vaxStudents: totalStudents - nonVaxStudents, drives });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
