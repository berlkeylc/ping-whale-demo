import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface RouteItem {
  name?: string;
  display: string;
  path?: string;
  icon?: string;
  component?: any;
  divider?: boolean;
  hidden?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  collapsed = true;

  constructor(private auth: AuthService) {}

  routes: RouteItem[] = [
    { name: 'dashboard', display: 'Dashboard', icon: 'dashboard', component: true },
    { name: 'monitoring-save', display: 'Add New Monitoring', icon: 'add', component: true },
  ];

    logout() {
    this.auth.logout();
  }
}
