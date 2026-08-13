import System from '../models/System.js';

export const getAvailableSystems = async (req, res) => {
  try {
    const systems = await System.find({ status: "available" });
    res.json(systems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching systems", error: error.message });
  }
};
