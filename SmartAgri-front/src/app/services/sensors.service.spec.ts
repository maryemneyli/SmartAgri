import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SensorService } from './sensors.service';
import { Sensor } from '../models/sensor.model';
import { SensorData } from '../models/sensor-data.model';

describe('SensorService', () => {
  let service: SensorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SensorService]
    });
    service = TestBed.inject(SensorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch user sensors', () => {
    const userId = 'user123';
    const mockSensors: Sensor[] = [{
      _id: 'sensor1', name: 'Sensor 1', type: 'Temperature', userId,
      bd: 'bd',
      location: 'xy',
      status: false
    }];

    service.getUserSensors(userId).subscribe(sensors => {
      expect(sensors.length).toBe(1);
      expect(sensors[0].name).toBe('Sensor 1');
    });

    const req = httpMock.expectOne(`http://localhost:3000/sensors/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSensors);
  });

  it('should toggle pump status', () => {
    const sensorId = 'sensor1';
    const status = true;

    service.togglePump(sensorId, status).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:3000/sensors/toggle-pump/${sensorId}/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ sensorId, status });
    req.flush({});
  });

  it('should fetch sensor data', () => {
    const sensorId = 'sensor1';
    const mockData: SensorData[] = [{
      temperature: 20, humidity: 50, light: 100, timestamp: new Date(),
      sensorId: 'sensor1',
      isAnomalous: false
    }];

    service.getSensorData(sensorId).subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].temperature).toBe(20);
    });

    const req = httpMock.expectOne(`http://localhost:3000/sensors/data/${sensorId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should detect anomalies for a user', () => {
    const userId = 'user123';
    const mockAnomalies = [{ sensor: { _id: 'sensor1' }, anomalies: [true] }];

    service.detectAnomalies(userId).subscribe(anomalies => {
      expect(anomalies.length).toBe(1);
      expect(anomalies[0].sensor._id).toBe('sensor1');
    });

    const req = httpMock.expectOne(`http://localhost:3000/sensors/${userId}/detect-anomaly`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnomalies);
  });
});
