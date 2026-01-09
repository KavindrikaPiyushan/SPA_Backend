import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import serviceRoutes from './routes/service.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import logsRoutes from './routes/logs.routes.js';
import adminRoutes from './routes/admin.routes.js';
import cloudinaryRoutes from './routes/cloudinary.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/admins',adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
export default app;