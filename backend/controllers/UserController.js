import User from "../models/User.js";
import bcrypt from "bcrypt";
import validator from "validator";
import 'dotenv/config';
import jwt from 'jsonwebtoken';

class UserController {
  async register(req, res) {
    try {
      const errors = {};
      const { firstName, lastName, email, password, passwordConfirmation } = req.body;
      
      if (!validator.isEmail(email)) {
        errors.email = 'Email is invalid.';
      }

      if (password.length < 8) {
        errors.password = 'Password must at least 8 characters long.';
      }

      if (password !== passwordConfirmation) {
        errors.passwordConfirmation = 'Password does not match.';
      }

      if (validator.isEmpty(firstName)) {
        errors.firstName = 'First name is required.';
      }

      if (validator.isEmpty(lastName)) {
        errors.lastName = 'Last name is required.';
      }

      if (validator.isEmpty(email)) {
        errors.email = 'Email is required.';
      }

      if (validator.isEmpty(password)) {
        errors.password = 'Password is required.';
      }

      if (validator.isEmpty(password)) {
        errors.passwordConfirmation = 'Password confirmation is required.';
      }

      if (Object.keys(errors).length !== 0) {
        return res.status(400).json(errors);
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt)

      const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
      });
  
      return res.status(200).json({ statusMsg: 'ok', user: user});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errorMsg: 'Something went wrong please try again.' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Please fill out all fields.' });
      }

      const user = await User.findOne({email: email});
      
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_ACCESS_TOKEN, { expiresIn: '1h'});

        return res.status(200).json({ isAuth: true, accessToken: token });
      }

      return res.status(400).json({ error: 'Invalid credentials.' });
    } catch (err) {
      return res.status(400).json({ error: 'Something went wrong please try again.' });
    }
  }

  async home(req, res) {
    try {
      const user = await User.findById(req.user);

      if (user) {
        return res.status(200).json({ user });
      }

      return res.status(400).json({ statusMsg: 'Invalid user.' });
    } catch (err) {
      return res.status(400).json({ statusMsg: 'Not authenticated.' });
    }
  }
}

export default new UserController();