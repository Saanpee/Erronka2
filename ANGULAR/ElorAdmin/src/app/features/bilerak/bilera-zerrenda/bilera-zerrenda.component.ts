/**
 * Bilera Zerrenda Component - ElorAdmin
 * Bileren zerrenda filtroekin
 * DTITUC, DTERRER eta DMUNIC filtroak
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { BileraService } from '../../../core/services/bilera.service';
import { IkastetxeaService } from '../../../core/services/ikastetxea.service';
import { AuthService } from '../../../core/services/auth.service';
import { Bilera, BileraMota, BileraFilters } from '../../../core/models/bilera.model';
import { Lurraldea, Ikastetxea } from '../../../core/models/ikastetxea.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { UserRole } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-bilera-zerrenda',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule, LoadingSpinnerComponent],
  templateUrl: './bilera-zerrenda.component.html',
  styleUrls: ['./bilera-zerrenda.component.css']
})
export class BileraZerrendaComponent implements OnInit {
  // Bilerak
  bilerak: Bilera[] = [];
  filteredBilerak: Bilera[] = [];

  // Ikastetxeak
  ikastetxeak: Ikastetxea[] = [];
  filteredIkastetxeak: Ikastetxea[] = [];

  // Udalerriak
  udalerriak: string[] = [];

  // Filtroak
  filters: BileraFilters = {};
  selectedLurraldea: Lurraldea | '' = '';
  selectedUdalerria = '';

  // Egoera
  isLoading = true;
  bileraToDelete: Bilera | null = null;

  constructor(
    private bileraService: BileraService,
    private ikastetxeaService: IkastetxeaService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Datuak kargatu
   */
  private loadData(): void {
    this.isLoading = true;

    // Ikastetxeak kargatu
    this.ikastetxeaService.getAll().subscribe(ikastetxeak => {
      this.ikastetxeak = ikastetxeak;
      this.filteredIkastetxeak = ikastetxeak;
    });

    // Bilerak kargatu
    this.bileraService.getAll().subscribe({
      next: (bilerak) => {
        this.bilerak = bilerak;
        this.filteredBilerak = bilerak;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  canCreateBilera(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.rola === UserRole.IRAKASLE;
  }

  /**
   * Lurraldea aldatzean
   */
  onLurraldeaChange(): void {
    this.selectedUdalerria = '';

    if (this.selectedLurraldea) {
      // Ikastetxeak filtratu
      this.filteredIkastetxeak = this.ikastetxeak.filter(
        i => i.lurraldea === this.selectedLurraldea
      );

      // Udalerriak lortu
      this.ikastetxeaService.getUdalerriak(this.selectedLurraldea as Lurraldea).subscribe(
        udalerriak => this.udalerriak = udalerriak
      );
    } else {
      this.filteredIkastetxeak = this.ikastetxeak;
      this.udalerriak = [];
    }

    this.filters.ikastetxeaId = undefined;
    this.onFilterChange();
  }

  /**
   * Udalerria aldatzean
   */
  onUdalerriChange(): void {
    if (this.selectedUdalerria) {
      this.filteredIkastetxeak = this.ikastetxeak.filter(
        i => i.udalerria.toLowerCase() === this.selectedUdalerria.toLowerCase()
      );
    } else if (this.selectedLurraldea) {
      this.filteredIkastetxeak = this.ikastetxeak.filter(
        i => i.lurraldea === this.selectedLurraldea
      );
    } else {
      this.filteredIkastetxeak = this.ikastetxeak;
    }

    this.filters.ikastetxeaId = undefined;
    this.onFilterChange();
  }

  /**
   * Filtroak aplikatu
   */
  onFilterChange(): void {
    this.filteredBilerak = this.bilerak.filter(bilera => {
      // Ikastetxea filtro
      if (this.filters.ikastetxeaId && bilera.ikastetxeId !== this.filters.ikastetxeaId) {
        return false;
      }

      // Data filtro
      if (this.filters.dataHasiera && new Date(bilera.data) < this.filters.dataHasiera) {
        return false;
      }

      if (this.filters.dataAmaiera && new Date(bilera.data) > this.filters.dataAmaiera) {
        return false;
      }

      return true;
    });
  }

  /**
   * Mota badge klasea
   */
  getMotaBadgeClass(mota: BileraMota): string {
    switch (mota) {
      case 'hezkuntza_saila': return 'bg-primary';
      case 'pribatua': return 'bg-warning text-dark';
      case 'beste_publiko': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  /**
   * Egoera badge klasea
   */
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'planifikatuta': return 'bg-success';
      case 'burututa': return 'bg-secondary';
      case 'bertan_behera': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  /**
   * Ezabatzeko berrespena
   */
  confirmDelete(bilera: Bilera): void {
    if (confirm('Ziur zaude bilera hau ezabatu nahi duzula?')) {
      this.bileraService.delete(bilera.id).subscribe(() => {
        this.bilerak = this.bilerak.filter(b => b.id !== bilera.id);
        this.onFilterChange();
      });
    }
  }
}
