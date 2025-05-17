import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
    },
    blogs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: ''
        },
    ],
    notes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: ''
        },
    ]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})

export const User = mongoose.model('User', userSchema)

// username
// email
// password
// notes -- different model
// blogs -- different model
