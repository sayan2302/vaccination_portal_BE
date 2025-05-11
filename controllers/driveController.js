import Drive from "../model/drive.js";


export const getDrives = async (req, res) => {
    try {


        const drives = await Drive.find({}).sort({ startDate: -1 });
        if (!drives || drives.length === 0) {
            return res.status(404).json({ message: 'No drives found' });
        }

        return res.status(200).json({ drives });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



export const addDrive = async (req, res) => {
    const { driveId, vaccineName, startDate, availableDoses, applicableClasses } = req.body;
    try {
        // Validate drive data
        if (!driveId || !vaccineName || !startDate || !availableDoses || !applicableClasses) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Ensure the drive is scheduled at least 15 days in advance
        const currentDate = new Date();
        const driveStartDate = new Date(startDate);
        const daysDifference = (driveStartDate - currentDate) / (1000 * 60 * 60 * 24);

        if (driveStartDate < currentDate) {
            return res.status(400).json({ message: 'Drives must be scheduled in future dates.' });
        }

        if (daysDifference < 15) {
            return res.status(400).json({ message: 'Drives must be scheduled at least 15 days in advance.' });
        }

        // Check for overlapping drives
        const overlappingDrive = await Drive.findOne({ startDate: driveStartDate });
        if (overlappingDrive) {
            return res.status(409).json({ message: 'A drive is already scheduled on this date. Please choose a different date.' });
        }

        // Create a new drive
        const newDrive = new Drive({
            driveId,
            vaccineName: vaccineName.toLowerCase(),
            startDate,
            availableDoses,
            applicableClasses,
        });

        try {
            await newDrive.save();
        } catch (dbError) {
            if (dbError.code === 11000) {
                // Handle duplicate key error
                console.error('Duplicate key error:', driveId);
                return res.status(409).json({ message: `Drive with ID ${driveId} already exists.` });
            }
            console.error('Database error while saving drive:', dbError);
            return res.status(500).json({ message: 'Failed to save drive to the database. Please try again later!' });
        }

        return res.status(201).json({ message: 'Drive added successfully' });
    } catch (error) {
        console.error('Error in adding drive:', error);
        return res.status(500).json({ message: 'Error adding drive, please try again later!' });
    }
};


export const editDrive = async (req, res) => {
    const { driveId, vaccineName, startDate, availableDoses, applicableClasses } = req.body;

    try {
        // Validate input data
        if (!driveId || !vaccineName || !startDate || !availableDoses || !applicableClasses) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Fetch the existing drive to check its start date
        const existingDrive = await Drive.findOne({ driveId });
        if (!existingDrive) {
            return res.status(404).json({ message: `Drive with ID ${driveId} not found.` });
        }

        const currentDate = new Date();
        const existingStartDate = new Date(existingDrive.startDate);

        // Prevent editing past drives
        if (existingStartDate < currentDate) {
            return res.status(400).json({ message: 'Past drives cannot be edited.' });
        }

        // Ensure the new start date is valid if provided
        if (startDate) {
            const driveStartDate = new Date(startDate);
            const daysDifference = (driveStartDate - currentDate) / (1000 * 60 * 60 * 24);

            // Check for overlapping drives
            const overlappingDrive = await Drive.findOne({ startDate: driveStartDate, driveId: { $ne: driveId } });
            if (overlappingDrive) {
                return res.status(409).json({ message: 'A drive is already scheduled on this date. Please choose a different date.' });
            }
        }

        // Find and update the drive
        const updatedDrive = await Drive.findOneAndUpdate(
            { driveId },
            {
                ...(vaccineName && { vaccineName: vaccineName.toLowerCase() }),
                ...(startDate && { startDate }),
                ...(availableDoses && { availableDoses }),
                ...(applicableClasses && { applicableClasses }),
            },
            { new: true }
        );

        if (!updatedDrive) {
            return res.status(404).json({ message: `Drive with ID ${driveId} not found.` });
        }

        return res.status(200).json({ message: 'Drive updated successfully', drive: updatedDrive });
    } catch (error) {
        console.error('Error in editing drive:', error);
        return res.status(500).json({ message: 'Error updating drive, please try again later!' });
    }
};