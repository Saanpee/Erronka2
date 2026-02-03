/**
 * Loading Spinner Component - ElorAdmin
 * Karga spinner osagaia
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() message?: string;
  @Input() fullscreen = false;
  @Input() size = 3;
}
