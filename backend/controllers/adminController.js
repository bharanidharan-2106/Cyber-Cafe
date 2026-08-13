import System from '../models/System.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

export const addSystem = async (req, res) => {
  try {
    const { name, type, specifications } = req.body;
    const system = new System({
      name,
      type,
      specifications
    });
    await system.save();
    res.status(201).json({ message: 'System added successfully', system });
  } catch (error) {
    res.status(500).json({ message: 'Error adding system', error: error.message });
  }
};

export const viewAvailableSystems = async (req, res) => {
  try {
    const systems = await System.find({ status: 'available' });
    res.json(systems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching systems', error: error.message });
  }
};

const removeSystem = async (req, res) => {
  const system = await System.findById(req.params.id);
  if (system) {
    await system.deleteOne();
    res.json({ message: 'System Removed' });
  } else {
    res.status(404).json({ message: 'System Not Found' });
  }
};

export const viewLoggedInUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const getBookings = async (req, res) => {
  const bookings = await Booking.find({}).populate('user', 'name email');
  res.json(bookings);
};

export const adminController = { addSystem, viewAvailableSystems, removeSystem, viewLoggedInUsers, getBookings };