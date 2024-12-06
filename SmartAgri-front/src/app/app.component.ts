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
    // S'abonner aux changements d'état de connexion
    this.authService.isAuthenticated$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });

    // S'abonner aux changements de rôle utilisateur
    this.authService.userRole$.subscribe((role) => {
      this.isAdminOrSuperAdmin = role === 'admin' || role === 'superadmin';
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.reload(); // Recharge la page pour mettre à jour l'affichage
  }
}
