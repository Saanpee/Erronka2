/**
 * Profila Component - ElorAdmin
 * Erabiltzailearen profila ikusi eta aldatu
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-profila',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './profila.component.html',
  styleUrls: ['./profila.component.css']
})
export class ProfilaComponent implements OnInit {
  // Formularioa
  profileForm!: FormGroup;

  // Uneko erabiltzailea
  currentUser: User | null = null;

  // Egoera
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
  }

  /**
   * Formularioa hasieratu
   */
  private initForm(): void {
    this.profileForm = this.fb.group({
      izena: [this.currentUser?.izena || '', Validators.required],
      abizena: [this.currentUser?.abizena || '', Validators.required],
      email: [this.currentUser?.email || ''],
      telefonoa: [this.currentUser?.telefonoa1 || ''],
      helbidea: [this.currentUser?.helbidea || ''],
      pasahitzaBerria: [''],
      pasahitzaKonfirmatu: ['']
    });
  }

  /**
   * Erabiltzailearen avatarra
   */
  get userAvatar(): string {
    if (this.currentUser?.argazkia_url) {
      return `public/images/${this.currentUser.argazkia_url}`;
    }
    return 'public/images/avatarLehenetsia.jpg';
  }

  /**
   * Rol badge klasea
   */
  getRoleBadgeClass(): string {
    switch (this.currentUser?.rola) {
      case UserRole.GOD: return 'bg-danger';
      case UserRole.ADMIN: return 'bg-primary';
      case UserRole.IRAKASLE: return 'bg-success';
      case UserRole.IKASLE: return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  /**
   * Eremu bat baliogabea den konprobatu
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Formularioa berrezarri
   */
  resetForm(): void {
    this.initForm();
  }

  /**
   * Fitxategia aukeratutakoan
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Egiaztatu jpg formatua
      if (!file.type.match('image/jpeg')) {
        alert('Solo se permiten archivos .jpg');
        return;
      }

      // Simulatu fitxategia gordetzea
      // Benetako implementazioan, hemen backend-era bidaliko genuke
      const fileName = `user-${this.currentUser?.id}-${Date.now()}.jpg`;
      console.log('Argazki berria gordeta:', fileName);

      // Eguneratu argazkia
      if (this.currentUser) {
        this.currentUser.argazkia_url = fileName;
      }

    }
  }

  /**
   * Formularioa bidali
   */
  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSaving = true;

    const formData = this.profileForm.value;

    // Pasahitza aldatu nahi bada, konprobatu bat datozela
    if (formData.pasahitzaBerria) {
      if (formData.pasahitzaBerria !== formData.pasahitzaKonfirmatu) {
        alert('Pasahitzak ez datoz bat');
        this.isSaving = false;
        return;
      }
    }

    // Simulatua
    setTimeout(() => {
      this.isSaving = false;
      alert('Profila eguneratuta');
    }, 1000);
  }
}
