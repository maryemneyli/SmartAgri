import { Schema, Document } from 'mongoose';

export interface Sensor extends Document {
  bd: string;
  name: string;
  type: string;
  location: string;
  status: boolean;
  userId: string;
}

export const SensorSchema = new Schema({
  bd: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: Boolean, required: true },
  userId: { type: String, ref: 'User', required: true },
});

export const SensorDataSchema = new Schema({
  sensorId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  light: { type: Number, required: true },
});
