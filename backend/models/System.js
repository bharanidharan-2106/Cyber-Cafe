import mongoose from 'mongoose';

const systemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['computer', 'printer'] },
  status: { type: String, required: true, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  specifications: {
    processor: String,
    ram: String,
    storage: String
  }
}, {
  timestamps: true
});

export default mongoose.model('System', systemSchema);