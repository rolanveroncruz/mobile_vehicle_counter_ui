import { Routes } from '@angular/router';
import {LoginComponent} from './login-component/login-component';

export const routes: Routes = [
  { path: '',  pathMatch: 'full', component:LoginComponent},
  { path: 'login', pathMatch: 'full', component:LoginComponent },



];
