import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { SensorService } from '../services/sensors.service';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let sensorServiceSpy: jasmine.SpyObj<SensorService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    sensorServiceSpy = jasmine.createSpyObj('SensorService', ['getSensors', 'addSensor', 'updateSensor', 'deleteSensor']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      providers: [
        { provide: SensorService, useValue: sensorServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sensors', () => {
    const mockSensors = [{ _id: '1', name: 'Sensor 1', type: 'type1', location: 'loc1', status: false }];
    // @ts-ignore
    sensorServiceSpy.getSensors.and.returnValue(of(mockSensors));

    component.loadSensors();

    // @ts-ignore
    expect(component.sensors).toEqual(mockSensors);
  });

  it('should handle sensor load error', () => {
    sensorServiceSpy.getSensors.and.returnValue(throwError(() => new Error('Failed to load sensors')));
    component.loadSensors();
    expect(component.sensors).toEqual([]);
  });
});
