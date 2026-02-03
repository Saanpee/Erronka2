/**
 * Ikasle Xehetasuna Component - ElorAdmin
 * Ikasle baten xehetasuna, ordutegia eta bilerak
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { UserService } from '../../../core/services/user.service';
import { BileraService } from '../../../core/services/bilera.service';
import { Ikasle, OrdutegiaItem } from '../../../core/models/user.model';
import { Bilera } from '../../../core/models/bilera.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ikasle-xehetasuna',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LoadingSpinnerComponent],
  templateUrl: './ikasle-xehetasuna.component.html',
  styleUrls: ['./ikasle-xehetasuna.component.css']
})
export class IkasleXehetasunaComponent implements OnInit {
  // Ikaslea
  ikasle: Ikasle | null = null;

  // Ordutegia
  ordutegia: OrdutegiaItem[] = [];

  // Bilerak
  bilerak: Bilera[] = [];

  // Egunak
  egunak: Array<'astelehena' | 'asteartea' | 'asteazkena' | 'osteguna' | 'ostirala'> = [
    'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala'
  ];

  // Egoera
  isLoading = true;

  constructor(
    private userService: UserService,
    private bileraService: BileraService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIkasle(parseInt(id, 10));
    }
  }

  /**
   * Ikaslea kargatu
   */
  private loadIkasle(id: number): void {
    this.isLoading = true;

    this.userService.getById(id).subscribe({
      next: (user) => {
        this.ikasle = user as Ikasle;
        this.loadOrdutegia(id);
        this.loadBilerak();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Ordutegia kargatu
   */
  private loadOrdutegia(userId: number): void {
    this.userService.getOrdutegiaByUserId(userId).subscribe({
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
   * Bilerak kargatu
   */
  private loadBilerak(): void {
    this.bileraService.getUpcoming(3).subscribe({
      next: (bilerak) => {
        this.bilerak = bilerak;
      }
    });
  }

  /**
   * Ordutegiaren gelaxka lortu
   */
  getOrdutegiaCell(eguna: string, ordua: number): string | null {
    const item = this.ordutegia.find(o => o.eguna === eguna && o.ordua === ordua);
    return item ? item.ikasgaia : null;
  }

  /**
   * Avatarra lortu
   */
  getUserAvatar(): string {
    if (this.ikasle?.argazkia_url) {
      return `public/images/${this.ikasle.argazkia_url}`;
    }
    return 'public/images/avatarLehenetsia.jpg';
  }
}
