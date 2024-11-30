import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensor } from './interfaces/sensor.interface';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorData } from './interfaces/sensor-data.interface';

@Injectable()
export class SensorsService {
  constructor(
    @InjectModel('Sensor') private readonly sensorModel: Model<Sensor>,
    @InjectModel('SensorData')
    private readonly sensorDataModel: Model<SensorData>,
  ) {}
  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...sensorData } = createSensorDto;
    const createdSensor = new this.sensorModel(sensorData);
    return createdSensor.save();
  }
  async createSensor(createSensorDto: CreateSensorDto): Promise<Sensor> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...sensorData } = createSensorDto; // Exclure l'ID du DTO

    // Assurez-vous que userId est bien une chaîne de caractères
    if (sensorData.userId && typeof sensorData.userId !== 'string') {
      throw new Error('Invalid user ID');
    }

    const createdSensor = new this.sensorModel(sensorData);
    return createdSensor.save();
  }
  async findAll(): Promise<Sensor[]> {
    return this.sensorModel.find().exec();
  }

  async findOne(id: string): Promise<Sensor> {
    return this.sensorModel.findById(id).exec();
  }
  async findByUser(userId: string): Promise<Sensor[]> {
    return this.sensorModel.find({ userId }).exec();
  }
  async getSensorData(sensorId: string): Promise<SensorData[]> {
    return this.sensorDataModel.find({ sensorId }).exec();
  }
  async update(id: string, sensorData: Partial<Sensor>): Promise<Sensor> {
    try {
      const updatedSensor = await this.sensorModel.findByIdAndUpdate(
        id,
        sensorData,
        { new: true },
      );
      if (!updatedSensor) {
        throw new Error('Sensor not found');
      }
      return updatedSensor;
    } catch (error) {
      // Handle errors, including E11000 duplicate key error
      console.error('Error updating sensor:', error);
      throw error;
    }
  }
  async togglePump(sensorId: string, status: boolean): Promise<Sensor> {
    const updatedSensor = await this.sensorModel.findByIdAndUpdate(
      sensorId,
      { status }, // Met à jour le champ 'status' selon le statut envoyé (true pour ouvert, false pour fermé)
      { new: true }, // Retourne le document mis à jour
    );

    if (!updatedSensor) {
      throw new Error('Sensor not found');
    }
    return updatedSensor;
  }
  async remove(id: string): Promise<Sensor> {
    return this.sensorModel.findByIdAndDelete(id).exec();
  }
}
