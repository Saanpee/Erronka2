/**
 * Sidebar Component - ElorAdmin
 * Alboko nabigazio menua
 * Erabiltzailearen rolaren arabera menu ezberdinak erakusten ditu
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';

/**
 * Menu elementu bat
 */
interface MenuItem {
  label: string;          // Itzulpen gakoa
  icon: string;           // Bootstrap icon klasea
  route: string;          // Router bidea
  roles?: string[];       // Baimentutako rolak (undefined = guztiak)
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl:'./sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Sidebar tolestuta dagoen
  @Input() isCollapsed = false;

  // Toggle gertaera
  @Output() toggleSidebar = new EventEmitter<void>();

  // Menu elementu guztiak
  private menuItems: MenuItem[] = [
    {
      label: 'MENU.DASHBOARD',
      icon: 'bi-speedometer2',
      route: '/dashboard'
    },
    {
      label: 'MENU.ERABILTZAILEAK',
      icon: 'bi-people',
      route: '/erabiltzaileak',
      roles: ['GOD', 'ADMIN', 'IRAKASLE']
    },
    {
      label: 'MENU.BILERAK',
      icon: 'bi-calendar-event',
      route: '/bilerak'
    },
    {
      label: 'MENU.IKASTETXEAK',
      icon: 'bi-building',
      route: '/ikastetxeak'
    },
    {
      label: 'MENU.ORDUTEGIA',
      icon: 'bi-clock',
      route: '/ordutegia',
      roles: ['IRAKASLE', 'IKASLE']
    },
    {
      label: 'MENU.PROFILA',
      icon: 'bi-person-circle',
      route: '/profila'
    }
  ];

  constructor(private authService: AuthService) {}

  /**
   * Erabiltzaileak ikus ditzakeen menu elementuak
   */
  get visibleMenuItems(): MenuItem[] {
    return this.menuItems.filter(item => {
      // Rolak definitu ez badira, guztiek ikus dezakete
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      // Erabiltzaileak rol egokia duen konprobatu
      return this.authService.hasRole(item.roles as any);
    });
  }
}
