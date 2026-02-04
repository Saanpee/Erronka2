import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-erabiltzaile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule,LoadingSpinnerComponent],
  templateUrl:'./erabiltzaile-form.component.html',
  styleUrls: ['./erabiltzaile-form.component.css']
})
export class ErabiltzaileFormComponent implements OnInit {
  // Formularioa
  userForm!: FormGroup;

  // Egoera
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  showPassword = false;

  // Editatzen ari den erabiltzailea
  userId: number | null = null;
  currentEditingUser: User | null = null;

  // Erabiltzaile editatu dezakeen ala ez
  get canEdit(): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    // Si no está en modo edición, permitir (crear nuevo)
    if (!this.isEditMode || !this.currentEditingUser) {
      return this.authService.isGod() || this.authService.isAdmin();
    }

    // GOD no puede editarse a sí mismo
    if (this.authService.isGod() && currentUser?.id === this.currentEditingUser.id) {
      return false;
    }

    // GOD puede editar a todos los demás
    if (this.authService.isGod()) {
      return true;
    }

    // ADMIN solo puede editar profesores (3) y alumnos (4)
    if (this.authService.isAdmin()) {
      return this.currentEditingUser.tipo_id === 3 || this.currentEditingUser.tipo_id === 4;
    }

    return false;
  }

  // Erabiltzaileak irakurtzeko soilik ala ez
  get isReadOnly(): boolean {
    return this.authService.isProfesor();
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Editatzen ari garen konprobatu
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = parseInt(idParam, 10);
      this.loadUser();
    }
  }

  // Formularioa hasieratu
  private initForm(): void {
    this.userForm = this.fb.group({
      izena: ['', [Validators.required, Validators.minLength(2)]],
      abizena: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      pasahitza: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(4)]],
      rola: ['', Validators.required],
      telefonoa: [''],
      helbidea: [''],
      aktibo: [true]
    });
  }

  // Erabiltzailea kargatu 
  private loadUser(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.userService.getById(this.userId).subscribe({
      next: (user) => {
        if (user) {
          this.currentEditingUser = user;
          
          this.userForm.patchValue({
            izena: user.izena,
            abizena: user.abizena,
            email: user.email,
            rola: user.rola,
            telefonoa: user.telefonoa1 || '',
            helbidea: user.helbidea || '',
            aktibo: user.aktibo
          });

          // Si es profesor o no puede editar, deshabilitar el formulario
          if (this.isReadOnly || !this.canEdit) {
            this.userForm.disable();
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/erabiltzaileak']);
      }
    });
  }

  // Eremu bat baliozkoa den ala ez
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Pasahitza erakutsi edo ezkutatu
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Formularioa bidali
  onSubmit(): void {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSaving = true;
    const formData = this.userForm.value;

    // Pasahitza hutsik badago editatzean, ez bidali
    if (this.isEditMode && !formData.pasahitza) {
      delete formData.pasahitza;
    }

    const request$ = this.isEditMode
      ? this.userService.update(this.userId!, formData)
      : this.userService.create(formData);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/erabiltzaileak']);
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }
}
