import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { SensorService } from '../services/sensors.service';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SensorData } from '../models/sensor-data.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockSensorService: jasmine.SpyObj<SensorService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockSensorService = jasmine.createSpyObj('SensorService', ['getUserSensors', 'getSensorData', 'detectAnomalies', 'togglePump']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUserId']);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: SensorService, useValue: mockSensorService },
        { provide: AuthService, useValue: mockAuthService },
        DatePipe
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load sensors on initialization', () => {
    const sensorsMock = [{ _id: 'sensor1', name: 'Sensor 1' }];
    mockAuthService.getCurrentUserId.and.returnValue('userId');
    // @ts-ignore
    mockSensorService.getUserSensors.and.returnValue(of(sensorsMock));

    component.loadUserSensors();
    expect(component.sensors.length).toBe(1);
    expect(component.sensors[0].name).toBe('Sensor 1');
  });

  it('should handle error if no user ID found in loadUserSensors', () => {
    spyOn(console, 'error');
    mockAuthService.getCurrentUserId.and.returnValue(null);

    component.loadUserSensors();
    expect(console.error).toHaveBeenCalledWith('No user ID found');
  });

  it('should load sensor data', () => {
    const sensorDataMock: SensorData[] = [{
      temperature: 20, humidity: 50, light: 100, timestamp: new Date(),
      sensorId: 'sensor1',
      isAnomalous: false
    }];
    mockSensorService.getSensorData.and.returnValue(of(sensorDataMock));

    component.loadSensorData('sensor1');
    expect(component.sensorData['sensor1']).toEqual(sensorDataMock);
  });

  it('should handle error if sensor data fetch fails', () => {
    spyOn(console, 'error');
    mockSensorService.getSensorData.and.returnValue(throwError(() => new Error('Error fetching sensor data')));

    component.loadSensorData('sensor1');
    expect(console.error).toHaveBeenCalledWith('Error fetching sensor data', jasmine.any(Error));
  });

  it('should toggle pump status', () => {
    mockSensorService.togglePump.and.returnValue(of({}));

    component.togglePump('sensor1', true);
    expect(mockSensorService.togglePump).toHaveBeenCalledWith('sensor1', true);
  });

  it('should detect anomalies on load', () => {
    const anomalyResultMock = [{ sensor: { _id: 'sensor1' }, data: [{}], anomalies: [true] }];
    mockAuthService.getCurrentUserId.and.returnValue('userId');
    mockSensorService.detectAnomalies.and.returnValue(of(anomalyResultMock));

    component.loadAnomalies();
    expect(component.anomalies['sensor1'][0].isAnomalous).toBe(true);
  });

  it('should handle error if anomaly detection fails', () => {
    spyOn(console, 'error');
    mockSensorService.detectAnomalies.and.returnValue(throwError(() => new Error('Error detecting anomalies')));

    component.loadAnomalies();
    expect(console.error).toHaveBeenCalledWith('Error detecting anomalies', jasmine.any(Error));
  });
});
