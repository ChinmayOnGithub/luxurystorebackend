import { DataModel } from "../models/data.model.js";
import { Admin } from '../models/admin.model.js';

const logout = async (_, res) => {
  try {
    // Clear the access token cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).send('Logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ message: 'Error during logout', error: error.message });
  }
}

const addAdmin = async (req, res) => {
  const { name, email } = req.body;

  // Validate request body
  if (!name || !email) {
    return res.status(400).json({ message: 'New admin name and email are required' });
  }

  // Ensure the email is in a valid format
  const formattedEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Simple email validation regex

  if (!emailRegex.test(formattedEmail)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check if the new admin already exists
    const existingAdmin = await Admin.findOne({ email: formattedEmail });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Create a new admin
    const newAdmin = new Admin({
      name: name,
      email: formattedEmail
    });
    // Save the new admin to the database
    await newAdmin.save();

    // Respond with success
    return res.status(201).json({
      message: 'New admin added successfully',
      newAdmin
    });
  } catch (error) {
    console.error('Error adding new admin:', error.message);
    return res.status(500).json({ message: 'Error adding new admin', error: error.message });
  }
};


const deletePost = async (req, res) => {
  const { vlabel } = req.body;
  try {
    const data = await DataModel.findOneAndDelete({ vlabel: vlabel });
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    return res.status(200).json({ message: 'Data deleted successfully', data });
  } catch (error) {
    return res.status(500).json({ message: 'Error while deleting data', error });
  }
}



export {
  deletePost,
  addAdmin,
  logout
}