export class CreateSensorDataDto {
  readonly sensorId: string;
  readonly temperature: number;
  readonly humidity: number;
  readonly light: number;
}
