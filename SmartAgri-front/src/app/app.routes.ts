import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './services/auth.guard';
import {AdministratorComponent} from "./administrator/administrator.component";
import {AdminGuard} from "./services/admin.guard";
import {SAdminGuard} from "./services/sadmin.guard";
import {RequestComponent} from "./request/request.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'requests', component: RequestComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard,AdminGuard] },
  { path: 'administrator', component: AdministratorComponent, canActivate: [AuthGuard,SAdminGuard] },
  { path: '**', redirectTo: 'login' },
];
