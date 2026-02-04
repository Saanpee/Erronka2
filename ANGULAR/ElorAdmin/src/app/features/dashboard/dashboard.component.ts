import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { BileraService } from '../../core/services/bilera.service';
import { IkastetxeaService } from '../../core/services/ikastetxea.service'; 
import { User, UserRole } from '../../core/models/user.model';
import { Bilera } from '../../core/models/bilera.model';
import { Ikastetxea } from '../../core/models/ikastetxea.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  counts = { ikasleak: 0, irakasleak: 0, adminak: 0 };
  gaurkoKopurua = 0;
  upcomingBilerak: Bilera[] = [];
  ikastetxeak: Ikastetxea[] = []; 
  isLoading = false;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private bileraService: BileraService,
    private ikastetxeaService: IkastetxeaService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadCounts();
    this.loadGaurkoKopurua();
    this.loadIkastetxeak(); 
    this.loadUpcomingBilerak();
  }

  private loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;
    }
  }

  private loadCounts(): void {
    if (this.authService.isGod()) {
      this.userService.getCounts().subscribe({
        next: (counts) => {
          this.counts = counts;
        },
        error: (error) => {
          console.error('Error al cargar conteos:', error);
        }
      });
    }
  }

  private loadGaurkoKopurua(): void {
    this.bileraService.getGaurkoKopurua().subscribe({
      next: (kopurua) => {
        this.gaurkoKopurua = kopurua;
      },
      error: (error) => {
        console.error('Error al cargar reuniones de hoy:', error);
      }
    });
  }

  private loadIkastetxeak(): void {
    this.ikastetxeaService.getAll().subscribe({
      next: (ikastetxeak) => {
        this.ikastetxeak = ikastetxeak;
      },
      error: (error) => {
        console.error('Error al cargar centros:', error);
      }
    });
  }

  private loadUpcomingBilerak(): void {
    this.isLoading = true;
    this.bileraService.getUpcoming(5).subscribe({
      next: (bilerak) => {
        this.upcomingBilerak = bilerak;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar reuniones próximas:', error);
        this.isLoading = false;
      }
    });
  }

  getIkastetxeaIzena(ikastetxeId: number): string {
    const ikastetxea = this.ikastetxeak.find(i => i.id === ikastetxeId);
    return ikastetxea?.izena || 'N/A';
  }

  getStatusBadgeClass(egoera: string): string {
    switch (egoera.toLowerCase()) {
      case 'pendiente':
        return 'bg-warning';
      case 'confirmada':
        return 'bg-success';
      case 'cancelada':
        return 'bg-danger';
      case 'completada':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  navigateToUsers(tipo_id: number): void {
  this.router.navigate(['/erabiltzaileak'], { queryParams: { tipo: tipo_id } });
}

  navigateToBilerak(): void {
    this.router.navigate(['/bilerak']);
  }

  // Erabiltzaile rolaren badge klasea
  getRoleBadgeClass(): string {
    switch (this.currentUser?.rola) {
      case UserRole.GOD: return 'bg-danger';
      case UserRole.ADMIN: return 'bg-primary';
      case UserRole.IRAKASLE: return 'bg-success';
      case UserRole.IKASLE: return 'bg-info';
      default: return 'bg-secondary';
    }
  }
}
