/**
 * Ordutegia Component - ElorAdmin
 * Erabiltzailearen ordutegia erakusten du
 * Irakasle eta ikasleentzat
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { OrdutegiaItem } from '../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ordutegia',
  standalone: true,
  imports: [CommonModule, TranslateModule, LoadingSpinnerComponent],
  templateUrl:'./ordutegia.component.html',
  styleUrls: ['./ordutegia.component.css']
})
export class OrdutegiaComponent implements OnInit {
  // Ordutegia
  ordutegia: OrdutegiaItem[] = [];

  // Egunak
  egunak: Array<'astelehena' | 'asteartea' | 'asteazkena' | 'osteguna' | 'ostirala'> = [
    'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala'
  ];

  // Orduak
  orduak = [
    { ordua: 1, hasiera: '08:00', amaiera: '09:00' },
    { ordua: 2, hasiera: '09:00', amaiera: '10:00' },
    { ordua: 3, hasiera: '10:30', amaiera: '11:30' },
    { ordua: 4, hasiera: '11:30', amaiera: '12:30' },
    { ordua: 5, hasiera: '12:30', amaiera: '13:30' },
    { ordua: 6, hasiera: '13:30', amaiera: '14:30' }
  ];

  // Egoera
  isLoading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadOrdutegia();
  }

  /**
   * Ordutegia kargatu
   */
  private loadOrdutegia(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    this.userService.getOrdutegiaByUserId(user.id).subscribe({
      next: (ordutegia) => {
        this.ordutegia = ordutegia;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Ordutegiaren gelaxka lortu
   */
  getOrdutegiaCell(eguna: string, ordua: number): OrdutegiaItem | null {
    return this.ordutegia.find(o => o.eguna === eguna && o.ordua === ordua) || null;
  }
}
