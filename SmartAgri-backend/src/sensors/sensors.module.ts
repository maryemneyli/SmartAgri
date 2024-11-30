import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { SensorSchema, SensorDataSchema } from './schemas/sensor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sensor', schema: SensorSchema },
      { name: 'SensorData', schema: SensorDataSchema },
    ]),
  ],
  providers: [SensorsService],
  controllers: [SensorsController],
})
export class SensorsModule {}
