import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

import { BileraService } from '../../../core/services/bilera.service';
import { IkastetxeaService } from '../../../core/services/ikastetxea.service';
import { Ikastetxea } from '../../../core/models/ikastetxea.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Bilera } from 'src/app/core/models/bilera.model';

@Component({
  selector: 'app-bilera-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, LoadingSpinnerComponent],
  templateUrl: './bilera-form.component.html',
  styles: []
})

export class BileraFormComponent implements OnInit {
  // Formularioa
  bileraForm!: FormGroup;

  canCreateBilera = false;

  // Ikastetxeak
  ikastetxeak: Ikastetxea[] = [];

  // Egoera
  isEditMode = false;
  isViewMode = false;
  isLoading = false;
  isSaving = false;

  // Editatzen ari den bilera
  bileraId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private bileraService: BileraService,
    private ikastetxeaService: IkastetxeaService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  // Formulario hasieratu
  private initForm(): void {
    this.bileraForm = this.fb.group({
      izena: ['', [Validators.required]],
      deskribapena: [''],
      data: ['', [Validators.required]],
      hasieraOrdua: ['', [Validators.required]],
      ikastetxeaId: [null, [Validators.required]],
      aula: ['', [Validators.required]],
      egoera: ['pendiente'],
      oharrak: ['']
    });
  }

  ngOnInit(): void {
    this.checkPermissions();
    this.initForm();

    // Obtener el ID y detectar el modo basado en la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    const urlPath = this.route.snapshot.url.map(segment => segment.path).join('/');
    
    if (idParam) {
      this.bileraId = parseInt(idParam, 10);
      
      // Verificar si la URL contiene 'ikusi' o 'editatu'
      if (urlPath.includes('ikusi')) {
        this.isViewMode = true;
        this.isEditMode = false;
      } else if (urlPath.includes('editatu')) {
        this.isEditMode = true;
        this.isViewMode = false;
      }
      
      // cargar ikastetxeak Y bilera al mismo tiempo
      this.loadDataForEdit();
    } else {
      // solo cargar ikastetxeak si es modo creación
      this.loadIkastetxeak();
    }
  }

  private checkPermissions(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser?.rola !== UserRole.IRAKASLE && currentUser?.rola !== UserRole.ADMIN && currentUser?.rola !== UserRole.GOD) {
      this.router.navigate(['/bilerak']);
      return;
    }
    
    this.canCreateBilera = true;
  }

  // Ikastetxeak kargatu
  private loadIkastetxeak(): void {
    this.ikastetxeaService.getAll().subscribe(ikastetxeak => {
      this.ikastetxeak = ikastetxeak;
    });
  }

  // Ikastetxeak eta bilera kargatu 
  private loadDataForEdit(): void {
    if (!this.bileraId) return;

    this.isLoading = true;

    // usar forkJoin para esperar a que ambas peticiones terminen
    forkJoin({
      ikastetxeak: this.ikastetxeaService.getAll(),
      bilera: this.bileraService.getById(this.bileraId)
    }).subscribe({
      next: ({ ikastetxeak, bilera }) => {
        
        // primero guardamos los ikastetxeak
        this.ikastetxeak = ikastetxeak;
        
        // luego rellenamos el formulario
        if (bilera) {
          this.fillForm(bilera);
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.isLoading = false;
        this.router.navigate(['/bilerak']);
      }
    });
  }

  // RELLENAR FORMULARIO CON DATOS DE BILERA
  private fillForm(bilera: any): void {
    
    // validar que la fecha sea válida
    let dataStr = '';
    let hasieraOrdua = '';

    if (bilera.data && !isNaN(new Date(bilera.data).getTime())) {
      const fecha = new Date(bilera.data);
      dataStr = fecha.toISOString().split('T')[0];
    }

    if (bilera.hasieraOrdua) {
      hasieraOrdua = bilera.hasieraOrdua.substring(0, 5);
    }

    // convertir a número para asegurar comparación correcta
    const ikastetxeIdNum = Number(bilera.ikastetxeId);
    
    // buscar con comparación estricta de números
    const ikastetxeaExists = this.ikastetxeak.find(i => Number(i.id) === ikastetxeIdNum);

    // si no se encuentra, buscar por string también
    if (!ikastetxeaExists) {
      const ikastetxeaByString = this.ikastetxeak.find(i => String(i.id) === String(bilera.ikastetxeId));
    }

    this.bileraForm.patchValue({
      izena: bilera.titulua || '',
      deskribapena: bilera.azalpena || '',
      data: dataStr,
      hasieraOrdua: hasieraOrdua,
      ikastetxeaId: ikastetxeIdNum,
      aula: bilera.gela || '',
      egoera: bilera.egoera || 'pendiente',
      oharrak: ''
    });
    
    // forzar detección de cambios después de un pequeño delay
    setTimeout(() => {
      this.bileraForm.patchValue({ ikastetxeaId: ikastetxeIdNum });
    }, 100);
    
    if (this.isViewMode) {
      this.bileraForm.disable();
    }
  }

  // Eremu balidoa den egiaztatu
  isFieldInvalid(fieldName: string): boolean {
    const field = this.bileraForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Formularioa bidali
  onSubmit(): void {
    if (this.bileraForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    this.isLoading = true;
    const formValue = this.bileraForm.value;
    
    // mapear los campos del formulario
    const bileraData: Partial<Bilera> = {
      titulua: formValue.izena,             
      azalpena: formValue.deskribapena,   
      data: formValue.data,
      hasieraOrdua: formValue.hasieraOrdua,
      ikastetxeId: formValue.ikastetxeaId,   
      gela: formValue.aula,                  
      egoera: formValue.egoera || 'pendiente'
    };

    const request$ = this.bileraId 
      ? this.bileraService.update(this.bileraId, bileraData)
      : this.bileraService.create(bileraData);

    request$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        console.log('Bilera guardada:', response);
        this.router.navigate(['/bilerak']);
      },
      error: (error) => {
        console.error('Error al crear bilera:', error);
      }
    });
  }
}