import System from '../models/System.js';

export const getAllSystems = async (req, res) => {
  // Your existing code for getting all systems
};

export const addSystem = async (req, res) => {
  // Your logic for adding a system
};

export const getAvailableSystems = async (req, res) => {
  try {
    const systems = await System.find({ status: "available" });
    res.json(systems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching systems", error: error.message });
  }
};

export const bookSystem = async (req, res) => {
  try {
    const { systemId } = req.body;
    const system = await System.findOneAndUpdate(
      { _id: systemId, status: "available" },
      { status: "occupied" },
      { new: true }
    );
    if (!system) {
      return res.status(400).json({ message: "System not available" });
    }
    res.json({ message: "System booked successfully", system });
  } catch (error) {
    res.status(500).json({ message: "Error booking system", error: error.message });
  }
};

