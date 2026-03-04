import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import authRoutes from './src/routes/authRoutes.js';
import appealRoutes from './src/routes/appealRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));

// Standard API Response Wrapper Middleware
app.use((req, res, next) => {
    res.sendSuccess = (data) => {
        res.json({
            success: true,
            data,
            error: null,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: req.headers['x-request-id'] || crypto.randomUUID()
            }
        });
    };

    res.sendError = (statusCode, code, message) => {
        res.status(statusCode).json({
            success: false,
            data: null,
            error: { code, message },
            meta: {
                timestamp: new Date().toISOString(),
                requestId: req.headers['x-request-id'] || crypto.randomUUID()
            }
        });
    };
    next();
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/appeals', appealRoutes);

app.get('/api/health', (req, res) => {
    res.sendSuccess({ status: 'API is running', version: '1.0.0' });
});

// 404 Handler
app.use((req, res) => {
    res.sendError(404, 'ERR_NOT_FOUND', 'Route not found');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendError(err.statusCode || 500, err.code || 'ERR_INTERNAL_SERVER', err.message || 'Internal Server Error');
});

import User from './src/models/User.js';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aiasan')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Ensure default admin account exists
        try {
            const adminEmail = 'admin@asan.az';
            const adminExists = await User.findOne({ email: adminEmail });
            if (!adminExists) {
                await User.create({
                    email: adminEmail,
                    password: 'Admin123!',
                    role: 'admin',
                    firstName: 'System',
                    lastName: 'Administrator'
                });
                console.log(`Default admin account created: ${adminEmail}`);
            }
        } catch (seedErr) {
            console.error('Failed to seed default admin user:', seedErr.message);
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });
