export interface SensorRequest {
  _id: string; // Identifiant unique de la demande
  userId: string; // ID de l'utilisateur ayant fait la demande
  username: string; // nom de l'utilisateur ayant fait la demande
  name : string;
  type: string; // Type de capteur demandé (actionneur ou capteur)
  location: string; // Emplacement où le capteur sera installé
  status: 'pending' | 'approved' | 'rejected'; // Statut de la demande
}
