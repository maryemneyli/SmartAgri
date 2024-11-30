import { Component, OnInit } from '@angular/core';
import { SensorService } from '../services/sensors.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import { AuthService } from '../services/auth.service';
import { SensorData } from '../models/sensor-data.model';
import {SensorRequest} from "../models/request.model";
import {FormsModule} from "@angular/forms";
import {User} from "../models/user.model";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    NgClass,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  sensors: any[] = [];
  sensorData: { [key: string]: SensorData[] } = {};
  anomalies: { [sensorId: string]: { isAnomalous: boolean }[] } = {};
  selectedSensorId: string | null = null;

  constructor(private sensorService: SensorService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserSensors();  // Charger les capteurs à l'initialisation
    this.loadAnomalies();  // Charger les anomalies à l'initialisation
  }

  loadUserSensors(): void {
    const userId = this.authService.getCurrentUserId();  // Récupérer l'ID de l'utilisateur connecté
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    this.sensorService.getUserSensors(userId).subscribe(
      (sensors) => {
        this.sensors = sensors;
        sensors.forEach((sensor) => {
          this.loadSensorData(sensor._id);  // Charger les données des capteurs
        });
      },
      (error) => {
        console.error('Error fetching sensors', error);
      }
    );
  }

  loadSensorData(sensorId: string): void {
    this.sensorService.getSensorData(sensorId).subscribe(
      (data) => {
        this.sensorData[sensorId] = data;  // Stocker les données du capteur par ID
      },
      (error) => {
        console.error('Error fetching sensor data', error);
      }
    );
  }

  loadAnomalies(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.error('No user ID found for anomaly detection');
      return;
    }

    this.sensorService.detectAnomalies(userId).subscribe(
      (anomalyResult) => {
        console.log("Anomalies received from backend:", anomalyResult);

        // Réinitialiser les anomalies et associer chaque capteur et ses anomalies
        this.anomalies = anomalyResult.reduce((acc: any, sensorData: any) => {
          const sensorId = sensorData.sensor._id;

          // Associer chaque donnée à une anomalie en fonction de l'index
          const anomaliesWithData = sensorData.data.map((dataEntry: any, index: number) => ({
            data: dataEntry,
            isAnomalous: sensorData.anomalies[index] || false,  // Associe true/false avec chaque data
          }));

          acc[sensorId] = anomaliesWithData;
          console.log(`Anomalies for sensor ${sensorId}:`, anomaliesWithData);
          console.log('acc', acc);
          return acc;
        }, {});
      },
      (error) => {
        console.error('Error detecting anomalies', error);
      }
    );
  }

  selectSensor(sensorId: string): void {
    this.selectedSensorId = sensorId;  // Définir le capteur sélectionné
  }

  getSensorName(sensorId: string): string {
    const sensor = this.sensors.find((s) => s._id === sensorId);
    return sensor ? sensor.name : '';
  }

  togglePump(sensorId: string, status: boolean): void {
    this.sensorService.togglePump(sensorId, status).subscribe(
      () => {
        // Mettre à jour l'état du capteur
        this.loadUserSensors();
      },
      (error) => {
        console.error('Error toggling pump', error);
      }
    );
  }
  hasAnomaly(sensorId: string): boolean {
    // Vérifie que chaque élément dans anomalies[sensorId] est un objet contenant 'isAnomalous'
    return Array.isArray(this.anomalies[sensorId]) &&
      this.anomalies[sensorId].some((anomaly: { isAnomalous: boolean }) => anomaly.isAnomalous);
  }

  showRequestForm: boolean = false; // Afficher ou masquer le formulaire
  newRequest: SensorRequest = {
    _id: '',
    userId: '',
    username: '',
    name: '',
    type: '',
    location: '',
    status: 'pending',
  };

  toggleRequestForm(): void {
    this.showRequestForm = !this.showRequestForm;
  }

  submitRequest(): void {
    const userId = this.authService.getCurrentUserId(); // Récupérer l'utilisateur actuel
    const userName = this.authService.getCurrentUserName();
    console.log("username", typeof userName,userName);
    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    this.newRequest.userId = userId;
    if (typeof userName === "string") {
      console.log("hereeeeeeee")
      this.newRequest.username = userName;
      console.log(this.newRequest.username)
      console.log(this.newRequest)

    }

    // Appeler le service pour soumettre la demande
    this.sensorService.addSensorRequest(this.newRequest).subscribe(
      (response) => {
        console.log('Sensor request submitted:', response);
        this.showRequestForm = false; // Masquer le formulaire après la soumission
        this.loadUserSensors(); // Recharger les capteurs
      },
      (error) => {
        console.error('Error submitting sensor request', error);
      }
    );
  }



}
