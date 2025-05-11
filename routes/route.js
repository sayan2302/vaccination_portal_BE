import express from 'express';
const router = express.Router();
import { loginUser } from '../controllers/userController.js';
import { addStudent, editStudent, filteredStudents, getStudents, updateVaccination } from '../controllers/studentController.js';
import { getDashboardDetails } from '../controllers/dashboardController.js';
import { addDrive, editDrive, getDrives } from '../controllers/driveController.js';


// Login Route       
router.get('/', (req, res) => { res.send('Welcome to the Vaccination Portal API') });

router.post('/login', loginUser);
router.get('/dashboard', getDashboardDetails);

router.get('/get-students', getStudents);
router.post('/add-student', addStudent);
router.post('/edit-student', editStudent);
router.post('/update-vaccination', updateVaccination);
router.post('/get-students', filteredStudents);


router.get('/get-drives', getDrives);
router.post('/add-drive', addDrive);
router.post('/edit-drive', editDrive);



export default router;