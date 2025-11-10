import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login';
import { AuthGuard } from './core/guards/auth.guard';
import { LandingComponent } from './pages/landing/landing';
import { RegisterComponent } from './pages/auth/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MainLayout } from './layout/main-layout/main-layout';
import { MonitoringDetail } from './pages/monitoring-detail/monitoring-detail';
import { MonitoringSave } from './pages/monitoring-save/monitoring-save';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
     {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'monitoring-detail', component: MonitoringDetail },
      { path: 'monitoring-save', component: MonitoringSave },
    ]
  },
  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404' }  
];
