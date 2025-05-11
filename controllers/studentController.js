import Student from "../model/student.js";

export const addStudent = async (req, res) => {
    const { studentId, studentName, grade } = req.body;
    try {
        // Validate student data
        if (!studentId || !studentName || !grade) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new student
        const newStudent = new Student({
            studentId,
            studentName,
            grade,
            vaccinations: []
        });

        try {
            await newStudent.save();
        } catch (dbError) {
            if (dbError.code === 11000) {
                // Handle duplicate key error
                console.error('Duplicate key error:', studentId);
                return res.status(409).json({ message: `Student with ID ${studentId} already exists.` });
            }
            console.error('Database error while saving student:', dbError);
            return res.status(500).json({ message: 'Failed to save student to the database. Please try again later!' });
        }

        return res.status(201).json({ message: 'Student added successfully' });

    } catch (error) {
        console.error('Error in adding student:', error);
        return res.status(500).json({ message: 'Error adding student, please try again later!' });
    }
}


export const editStudent = async (req, res) => {
    const { studentId, studentName, grade } = req.body;
    try {
        // Validate student data
        if (!studentId || !studentName || !grade) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find the student by studentId and update their details
        const updatedStudent = await Student.findOneAndUpdate(
            { studentId }, // Find condition
            { studentName, grade }, // Update fields
            { new: true, runValidators: true } // Options: return the updated document and validate
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: `Student with ID ${studentId} not found.` });
        }

        return res.status(200).json({ message: 'Student updated successfully', updatedStudent });

    } catch (error) {
        console.error('Error in updating student:', error);
        return res.status(500).json({ message: 'Error updating student, please try again later!' });
    }
};




export const getStudents = async (req, res) => {

    try {
        // Fetch dashboard details from the database
        const studentsList = await Student.find({});

        return res.status(200).json({ message: 'Dashboard details fetched successfully', studentsList });

    } catch (error) {
        console.error('Error fetching students list:', error);
        return res.status(500).json({ message: 'Error fetching students list, please try again later!' });
    }
}


export const updateVaccination = async (req, res) => {
    const { studentId, vaccinations } = req.body;
    try {
        // Validate student data
        if (!studentId || !vaccinations) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        // Check for duplicate values in the vaccinations array
        const uniqueVaccinations = new Set(vaccinations);
        if (uniqueVaccinations.size !== vaccinations.length) {
            return res.status(400).json({ message: "A student can't get same vaccination dose twice!" });
        }

        // Find the student by studentId and update their details
        const updatedStudent = await Student.findOneAndUpdate(
            { studentId }, // Find condition
            { vaccinations }, // Update fields
            { new: true, runValidators: true } // Options: return the updated document and validate
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: `Student with ID ${studentId} not found.` });
        }

        return res.status(200).json({ message: 'Vaccinations updated successfully' });

    } catch (error) {
        console.error('Error in updating student:', error);
        return res.status(500).json({ message: 'Error updating student, please try again later!' });
    }
};

export const filteredStudents = async (req, res) => {
    const { vaccinationName, studentName, grade } = req.body;

    try {
        // Build the filter object dynamically based on the query parameters
        const filter = {};

        if (vaccinationName && vaccinationName.length > 0 && Array.isArray(vaccinationName)) {
            filter.vaccinations = { $in: vaccinationName }; // Matches students with any of the specified vaccinations
        }

        if (studentName) {
            filter.studentName = { $regex: studentName, $options: 'i' }; // Case-insensitive match for student name
        }

        if (grade) {
            filter.grade = grade; // Matches students with the specified grade
        }

        // Fetch students based on the filter
        const students = await Student.find(filter);



        const allStudents = await Student.find({});

        const uniqueVax = [...new Set(allStudents.flatMap(student => student.vaccinations))]

        return res.status(200).json({ message: 'Filtered students fetched successfully', uniqueVax, students });

    } catch (error) {
        console.error('Error fetching filtered students:', error);
        return res.status(500).json({ message: 'Error fetching filtered students, please try again later!' });
    }
};