import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Formularioa - Inicializar inmediatamente
  loginForm: FormGroup;

  // Egoera aldagaiak
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  sessionExpired = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Crear el formulario en el constructor para que esté disponible inmediatamente
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pasahitza: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    // Erabiltzailea dagoeneko logeatuta badago, dashboard-era birbideratu
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Sesioa iraungi den konprobatu
    this.route.queryParams.subscribe(params => {
      this.sessionExpired = params['sessionExpired'] === 'true';
    });
  }

  /**
   * Eremu bat baliogabea den konprobatu
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Pasahitza erakutsi/ezkutatu
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Formularioa bidali
   */
  onSubmit(): void {
    // Formularioa baliogabea bada, markatu eremuak
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.isLoading = false;
        this.errorMessage = error.message || 'Errorea saioa hastean';
      }
    });
  }
}