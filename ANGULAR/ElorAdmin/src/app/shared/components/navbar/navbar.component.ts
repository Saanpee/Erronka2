/**
 * Navbar Component - ElorAdmin
 * Goiko nabigazio barra
 * Erabiltzaile informazioa, hizkuntza aldaketa eta logout
 */

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Events
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();

  // Uneko hizkuntza
  currentLang: string;

  constructor(
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang || 'eu';
  }

  /**
   * Uneko erabiltzailea lortu
   */
  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  /**
   * Erabiltzailearen avatarra lortu
   */
  get userAvatar(): string {
    if (this.currentUser?.argazkia_url) {
      return `public/images/${this.currentUser.argazkia_url}`;
    }
    // Lehenetsitako avatarra
    return 'public/images/avatarLehenetsia.jpg';
  }

  /**
   * Erabiltzailearen rol etiketa lortu
   */
  getUserRoleLabel(): string {
  const role = this.currentUser?.rola as string;
  
  // Normalizar: quitar espacios y pasar a minúsculas
  const normalizedRole = role?.toLowerCase().trim();
  switch (normalizedRole) {
    case 'god': return 'ROLES.GOD';
    case 'admin': return 'ROLES.ADMIN';
    case 'irakasle': return 'ROLES.IRAKASLE';
    case 'ikasle': return 'ROLES.IKASLE';
    default: return 'ROLES.UNKNOWN';
  }
}

  /**
   * Hizkuntza aldatu
   */
  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  /**
   * Sidebar toggle
   */
  onToggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  /**
   * Saioa itxi
   */
  onLogout(): void {
    this.authService.logout();
  }
}
