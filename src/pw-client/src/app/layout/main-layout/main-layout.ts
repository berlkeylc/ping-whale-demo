import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule, MatSidenavModule, MatButtonModule, MatIconModule, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatSidenav;
  
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();
  
  isMobile = false;
  drawerMode: 'side' | 'over' = 'side';
  drawerOpened = true;

  ngOnInit() {
    this.checkScreenSize();
    
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.updateDrawerState(result.matches);
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkScreenSize();
    });
  }

  private checkScreenSize() {
    const isMobileView = window.innerWidth < 768;
    this.updateDrawerState(isMobileView);
  }

  private updateDrawerState(isMobile: boolean) {
    this.isMobile = isMobile;
    this.drawerMode = isMobile ? 'over' : 'side';
    this.drawerOpened = !isMobile;
    
    // Mobilde drawer açıksa kapat
    if (isMobile && this.drawer) {
      setTimeout(() => {
        if (this.drawer && this.drawer.opened) {
          this.drawer.close();
        }
      }, 100);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDrawer() {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }
}
