import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AuthService } from './core/services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    SidebarComponent,
    NavbarComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {
    // Hizkuntza lehenetsiak konfiguratu
    this.translate.addLangs(['eu', 'es', 'en']);
    this.translate.setDefaultLang('eu');

    // Gordetako hizkuntza edo euskara lehenetsi
    const savedLang = localStorage.getItem('language') || 'eu';
    this.translate.use(savedLang);
  }

  ngOnInit(): void {
    // Erabiltzailea autentikatu gabe badago, login-era birbideratu
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  // Saioa itxi
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
