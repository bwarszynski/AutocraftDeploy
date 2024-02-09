import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from './Routes/auth.js';
import userRoute from './Routes/user.js';
import mechanicRoute from './Routes/mechanic.js';
import reviewRoute from './Routes/review.js';
import bookingRoute from './Routes/booking.js';


dotenv.config()

const app = express();
const port = process.env.PORT || 8000;


const corsOptions = {
    origin: ["http://localhost:5173","https://autocraft-app.onrender.com"],
}

app.get("/", (req, res) => {
    res.send('API uruchomione...');
});

// Połączenie z bazą danych
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Połączono z bazą danych')
    } catch (err) {
        console.log('Połączenie z MongoDB nieudane')
    }
};

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRoute); //domena/api/v1/auth/register
app.use('/api/v1/users', userRoute); //domena/api/v1/users/:id
app.use('/api/v1/mechanics', mechanicRoute); //domena/api/v1/mechanics/:id
app.use('/api/v1/reviews', reviewRoute); //domena/api/v1/reviews/
app.use('/api/v1/bookings', bookingRoute); //domena/api/v1/bookings/

app.listen(port, () => {
    connectDB();
    console.log(`Serwer uruchomiony na porcie ${port}`)
})
