import Booking from '../models/Booking.js';
import System from '../models/System.js';

export const bookSystem = async (req, res) => {
  try {
    const { systemId, startTime, endTime } = req.body;
    
    // Check if system exists and is available
    const system = await System.findOne({ _id: systemId, status: 'available' });
    if (!system) {
      return res.status(400).json({ message: 'System not available' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      system: systemId,
      startTime: startTime || new Date(),
      endTime: endTime,
      status: 'active'
    });

    await booking.save();

    // Update system status
    system.status = 'occupied';
    await system.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};
