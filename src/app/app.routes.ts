import { Routes } from '@angular/router';
import {LoginComponent} from './login-component/login-component';
import {DashboardComponent} from './dashboard-component/dashboard-component';
import {MainComponent} from './main-component/main-component';

export const routes: Routes = [
  { path: '',  pathMatch: 'full', component:LoginComponent},
  { path: 'login', pathMatch: 'full', component:LoginComponent },
  { path: 'main', component:MainComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
    ]
  },



];
