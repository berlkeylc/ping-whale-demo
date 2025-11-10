import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, MatSidenavModule, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}
