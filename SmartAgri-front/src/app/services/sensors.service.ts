import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sensor } from '../models/sensor.model';
import {User} from "../models/user.model";
import {SensorData} from "../models/sensor-data.model";
import {SensorRequest} from "../models/request.model";

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private sensorsUrl = '/api/sensors';
  private requestsUrl = '/api/sensor-requests';

  constructor(private http: HttpClient) {}

  getSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.sensorsUrl);
  }

  addSensor(sensor: any): Observable<any> {
    return this.http.post<Sensor>(this.sensorsUrl, sensor);
  }

  getSensorRequests(): Observable<SensorRequest[]> {
    return this.http.get<SensorRequest[]>(this.requestsUrl);
  }

  addSensorRequest(request: SensorRequest): Observable<SensorRequest> {
    return this.http.post<SensorRequest>(this.requestsUrl, request);
  }

  updateSensorRequest(requestId: string, updates: Partial<SensorRequest>): Observable<SensorRequest> {
    console.log('service')
    return this.http.patch<SensorRequest>(`${this.requestsUrl}/update/${requestId}`, updates);
  }

  updateRequestStatus(requestId: string, status: 'approved' | 'rejected'): Observable<void> {
    console.log("2",status)
    return this.http.patch<void>(`${this.requestsUrl}/${requestId}`, { status });
  }


  getUserRequests(userId: string | null): Observable<SensorRequest[]>  {
    return this.http.get<SensorRequest[]>(`${this.requestsUrl}/${userId}`);
  }

  updateSensorRequestt(requestId: string, updatedStatus: "approved" | "rejected"): Observable<SensorRequest> {
    const payload = { status: updatedStatus }; // Objet attendu côté backend
    return this.http.patch<SensorRequest>(`${this.requestsUrl}/${requestId}`, payload);
  }

  deleteSensorRequest(requestId: string) {
    return this.http.delete(`${this.requestsUrl}/${requestId}`);
  }

  getUserSensors(userId: string): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.sensorsUrl}/user/${userId}`);
  }


  togglePump(sensorId: string, status: boolean): Observable<any> {
    return this.http.post(`${this.sensorsUrl}/toggle-pump/${sensorId}/`, { sensorId, status });
  }
  updateSensor(id: string, sensor: Sensor): Observable<Sensor> {
    return this.http.put<Sensor>(`${this.sensorsUrl}/${id}`, sensor);
  }
  getSensorData(sensorId: string): Observable<SensorData[]> {
    return this.http.get<SensorData[]>(`${this.sensorsUrl}/data/${sensorId}`);
  }
  deleteSensor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.sensorsUrl}/${id}`);
  }
  detectAnomaly(values: number[][]): Observable<{ predictions: number[] }> {
    return this.http.post<{ predictions: number[] }>(`${this.sensorsUrl}/detect-anomaly`, { values });
  }
  // Détecter les anomalies des capteurs pour un utilisateur
  detectAnomalies(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.sensorsUrl}/${userId}/detect-anomaly`);
  }


}
