import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.js';

dotenv.config();
const TEST = process.env.TEST;

export const signin = async(req, res) =>{
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist." });

        const isPassword = await bcrypt.compare(password, existingUser.password);
        if(!isPassword) return res.status(400).json({ message: "Invalid credentials." });

        const token  = jwt.sign({ email: existingUser.email, id: existingUser._id }, TEST, { expiresIn: "1h" }); //in the place of test there will be secret string which only you know
        
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
 }

export const signup = async(req, res) =>{
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const  existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({ message: "User already exist." });

        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

        const token  = jwt.sign({ email: result.email, id: result._id }, TEST, { expiresIn: "1h" });

        res.cookie('token', token, { sameSite: false, secure: true})

        res.status(200).json({ result: result, token });        

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
}