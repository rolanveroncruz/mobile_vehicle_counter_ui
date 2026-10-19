import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {MatDialog} from '@angular/material/dialog';

type MainNavItem = {
  label: string;
  icon: string;
  route: string; // relative to /main
  alignRight?: boolean;
};

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './main-component.html',
  styleUrls: ['./main-component.scss'],
})
export class MainComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);


  readonly navItems: MainNavItem[] = [
    { label: 'Dashboard',   icon: 'dashboard',     route: '/main/dashboard' },
    { label: 'Settings',      icon: 'settings',     route: '/main/settings',  alignRight: true },
  ];

  // Optional: derive a title from the current URL
  readonly pageTitle = computed(() => {
    const url = this.router.url ?? '';
    if (url.includes('/discoveries')) return 'Discoveries';
    if (url.includes('/agents')) return 'Agents';
    return 'Dashboard';
  });

  onLogout(): void {
    // TODO: replace with your auth service + token clearing
    // then redirect to login
    this.router.navigateByUrl('/login').then();
  }
  onGenerateToken(){

  }
}
