/**
 * Erabiltzaile Zerrenda Component - ElorAdmin
 * Administratzaileen zerrenda
 * CRUD eragiketak kudeatzeko
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-erabiltzaile-zerrenda',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule, LoadingSpinnerComponent],
  templateUrl:'./erabiltzaile-zerrenda.component.html',
  styleUrls: ['./erabiltzaile-zerrenda.component.css']
})
export class ErabiltzaileZerrendaComponent implements OnInit {
  // Erabiltzaile zerrenda
  users: User[] = [];
  filteredUsers: User[] = [];

  // Filtroak
  searchQuery = '';
  selectedTipoId: string = ''; 

  // Egoera
  isLoading = true;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    
    // Leer query params para filtrar
    this.route.queryParams.subscribe(params => {
      if (params['tipo_id']) {
        this.selectedTipoId = params['tipo_id'];
        this.filterUsers();
      }
    });
  }

  /**
   * Erabiltzaileak kargatu
   */
  private loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        // Filtrar según el rol del usuario actual
        if (this.authService.isProfesor()) {
          // Los profesores solo ven profesores (3) y alumnos (4)
          this.users = users.filter(u => u.tipo_id === 3 || u.tipo_id === 4);
        } else {
          // God y Admin ven todos
          this.users = users;
        }
        this.filteredUsers = this.users;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Bilaketa egitean
   */
  onSearch(): void {
    this.filterUsers();
  }

  /**
   * Filtroa aldatzean
   */
  onFilterChange(): void {
    this.filterUsers();
  }

  // ------FILTROS-----
  private filterUsers(): void {
    let filtered = [...this.users];

    // Filtro nombre, apellido
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.izena.toLowerCase().includes(query) ||
        u.abizena.toLowerCase().includes(query)
      );
    }

    // Filtro tipo_id 
    if (this.selectedTipoId) {
      filtered = filtered.filter(u => u.tipo_id.toString() === this.selectedTipoId);
    }

    this.filteredUsers = filtered;
  }

  /**
   * Erabiltzailearen avatarra lortu
   */
  getUserAvatar(user: User): string {
    if (user.argazkia_url) {
      return `public/images/${user.argazkia_url}`;
    }
    return 'public/images/avatarLehenetsia.jpg';
  }

  /**
   * Rol badge klasea
   */
  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.GOD: return 'bg-danger';
      case UserRole.ADMIN: return 'bg-primary';
      case UserRole.IRAKASLE: return 'bg-success';
      case UserRole.IKASLE: return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  /**
   * Ezabatzeko berrespena eskatu
   */
  confirmDelete(user: User): void {
    this.userToDelete = user;
    // Bootstrap modal-a ireki (JavaScript bidez)
    const modal = document.getElementById('deleteModal');
    if (modal) {
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
  }


  canDelete(user: User): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    // Nadie puede eliminarse a sí mismo
    if (currentUser?.id === user.id) return false;

    // God puede eliminar a todos (excepto a sí mismo)
    if (this.authService.isGod()) return true;

    // Admin solo puede eliminar profesores (3) y alumnos (4)
    if (this.authService.isAdmin()) {
      return user.tipo_id === 3 || user.tipo_id === 4;
    }

    return false;
  }

  canEdit(user: User): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    // God puede editar a todos excepto a sí mismo
    if (this.authService.isGod()) {
      return currentUser?.id !== user.id;
    }

    // Admin solo puede editar profesores (3) y alumnos (4)
    if (this.authService.isAdmin()) {
      return user.tipo_id === 3 || user.tipo_id === 4;
    }

    return false;
  }

  /**
   * Verificar si puede ver los datos del usuario
   */
  canView(user: User): boolean {
    // God y Admin pueden ver todos
    if (this.authService.isGod() || this.authService.isAdmin()) {
      return true;
    }

    // Profesores solo pueden ver profesores (3) y alumnos (4)
    if (this.authService.isProfesor()) {
      return user.tipo_id === 3 || user.tipo_id === 4;
    }

    return false;
  }

  // Para que el god cree todo tipo de usuarios y el admin solo profesores y alumnos
  getTipoIdOptions(): number[] {
    if (this.authService.isGod()) {
      return [2, 3, 4]; // Todos los tipos
    }
    if (this.authService.isAdmin()) {
      return [3, 4]; // Solo profesores y alumnos
    }
    return [];
  }

  /**
   * Erabiltzailea ezabatu
   */
  deleteUser(): void {
    if (!this.userToDelete) return;

    this.userService.delete(this.userToDelete.id).subscribe({
      next: () => {
        // Zerrendatik kendu
        this.users = this.users.filter(u => u.id !== this.userToDelete!.id);
        this.filterUsers();
        this.userToDelete = null;

        // Modal-a itxi
        const modal = document.getElementById('deleteModal');
        if (modal) {
          const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
          bsModal?.hide();
        }
      }
    });
  }
}
