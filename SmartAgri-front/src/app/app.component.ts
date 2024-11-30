import {Component, OnInit} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { AuthService } from './services/auth.service';
import {AdministratorComponent} from "./administrator/administrator.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink, AdministratorComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  isAdminOrSuperAdmin = false;
  title = 'smartagri-frontend';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Vérifiez si l'utilisateur est connecté
    this.isAuthenticated = this.authService.isLoggedIn();

    // Vérifiez le rôle de l'utilisateur
    if (this.isAuthenticated) {
      const userRole = this.authService.getUserRole(); // Méthode pour récupérer le rôle
      this.isAdminOrSuperAdmin = userRole === 'admin' || userRole === 'superadmin';
    }
  }

  logout(): void {
    this.authService.logout();
    window.location.reload(); // Recharge la page pour mettre à jour l'affichage
  }
}
