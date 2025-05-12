import express from 'express';
import Router from '../routes/route.js';
import cors from 'cors';
import mongoose from 'mongoose';
import serverless from 'serverless-http';


// Initialize Express App
const app = express();
const PORT = 8000;


// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use("/", Router)



// MongoDB Connection - 
const MONGO_URI = 'mongodb+srv://sayanpramanickx:mD3NbmbtmBdRiHl8@vacportalcluster.bipjacx.mongodb.net/?retryWrites=true&w=majority&appName=VacPortalCluster'
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running ...`);
});



// Export the app as a serverless function
// export const handler = serverless(app);