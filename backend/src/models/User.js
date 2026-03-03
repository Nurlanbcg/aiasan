import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['citizen', 'admin'],
        default: 'citizen',
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    fin: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        uppercase: true,
        minlength: 7,
        maxlength: 7
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
