import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { UserService } from '../../../core/services/user.service';
import { Irakasle, OrdutegiaItem } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-irakasle-xehetasuna',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LoadingSpinnerComponent],
  templateUrl: './irakasle-xehetasuna.component.html',
  styleUrls: ['./irakasle-xehetasuna.component.css']
})
export class IrakasleXehetasunaComponent implements OnInit {
  // Irakaslea
  irakasle: Irakasle | null = null;

  // Ordutegia
  ordutegia: OrdutegiaItem[] = [];

  // Egunak
  egunak: Array<'astelehena' | 'asteartea' | 'asteazkena' | 'osteguna' | 'ostirala'> = [
    'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala'
  ];

  // Egoera
  isLoading = true;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIrakasle(parseInt(id, 10));
    }
  }

  // Irakaslea kargatu
  private loadIrakasle(id: number): void {
    this.isLoading = true;

    this.userService.getById(id).subscribe({
      next: (user) => {
        this.irakasle = user as Irakasle;
        this.loadOrdutegia(id);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // Ordutegia kargatu
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

  // Ordutegiaren gelaxka lortu
  getOrdutegiaCell(eguna: string, ordua: number): string | null {
    const item = this.ordutegia.find(o => o.eguna === eguna && o.ordua === ordua);
    return item ? item.ikasgaia : null;
  }

  // Argazkia lortu
  getUserAvatar(): string {
    if (this.irakasle?.argazkia_url) {
      return `public/images/${this.irakasle.argazkia_url}`;
    }
    return 'public/images/avatarLehenetsia.jpg';
  }
}
