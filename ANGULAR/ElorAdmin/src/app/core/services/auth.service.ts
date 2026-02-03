import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

interface LoginCredentials {
  email: string;
  pasahitza: string;
}

interface LoginResponse {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
}

// Erabiltzaile motak 
enum UserType {
  GOD = 1,
  ADMIN = 2,
  IRAKASLE = 3,
  IKASLE = 4
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? this.mapToUserModel(JSON.parse(storedUser)) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Datuak mapeatzeko metodoa
  private mapToUserModel(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      izena: dbUser.nombre,
      abizena: dbUser.apellidos,
      dni: dbUser.dni, 
      helbidea: dbUser.direccion,
      telefonoa1: dbUser.telefono1,
      telefonoa2: dbUser.telefono2,
      rola: this.mapTipoIdToRole(dbUser.tipo_id),
      tipo_id: dbUser.tipo_id, 
      argazkia_url: dbUser.argazkia_url,
      sortzeData: dbUser.created_at,
      aktibo: true
    };
  }

  // Tipo_id datua mapeatzeko
  private mapTipoIdToRole(tipoId: number): UserRole {
    switch (tipoId) {
      case UserType.GOD:
        return UserRole.GOD;
      case UserType.ADMIN:
        return UserRole.ADMIN;
      case UserType.IRAKASLE:
        return UserRole.IRAKASLE;
      case UserType.IKASLE:
        return UserRole.IKASLE;
      default:
        return UserRole.IKASLE;
    }
  }

  // UserRole datua mapeatzeko tipo_id-ra
  private mapRoleToTipoId(role: UserRole): number {
    switch (role) {
      case UserRole.GOD:
        return UserType.GOD;
      case UserRole.ADMIN:
        return UserType.ADMIN;
      case UserRole.IRAKASLE:
        return UserType.IRAKASLE;
      case UserRole.IKASLE:
        return UserType.IKASLE;
      default:
        return UserType.IKASLE;
    }
  }

 // Bertako erabiltzailea lortzea
  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, credentials)
      .pipe(
        map(response => {
          if (response.success && response.user && response.token) {
            const user = this.mapToUserModel(response.user);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(user);
          }
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Email edo pasahitza okerra';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Ezin da zerbitzariarekin konektatu';
          } else if (error.status === 500) {
            errorMessage = 'Zerbitzari errorea';
          }
          
          return throwError(() => ({ message: errorMessage }));
        })
      );
  }

  logout(): void {

    // localStorage garbitu
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('language');
    
    // subject-a eguneratu
    this.currentUserSubject.next(null);
    
    // login-era nabigatu
    this.router.navigate(['/login']).then(() => {

      // orria berriro kargatu egoera residualak garbitzeko
      window.location.reload();
    });
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserType(): number | null {
    const user = this.currentUserValue;
    return user ? this.mapRoleToTipoId(user.rola) : null;
  }

  // GOD rola egiaztatu
  isGod(): boolean {
    const user = this.currentUserValue;
    return user ? user.rola === UserRole.GOD : false;
  }

  // ADMIN rola egiaztatu

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user ? user.rola === UserRole.ADMIN : false;
  }

  // IRAKASLE rola egiaztatu
  isProfesor(): boolean {
    const user = this.currentUserValue;
    return user ? user.rola === UserRole.IRAKASLE : false;
  }

  // IKASLE rola egiaztatu
  isAlumno(): boolean {
    const user = this.currentUserValue;
    return user ? user.rola === UserRole.IKASLE : false;
  }

  // Erabiltzaileak zein rola duen egiaztatu
  hasRole(roles: UserRole[] | number[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    // String-ak badira (UserRole), zuzenean konparatu
    if (typeof roles[0] === 'string') {
      return (roles as UserRole[]).includes(user.rola);
    }
    
    // Bestela, zenbakiak badira, mapatu tipo_id-ra eta konparatu
    const userTipoId = this.mapRoleToTipoId(user.rola);
    return (roles as number[]).includes(userTipoId);
  }

  // GOD edo ADMIN den egiaztatu
  isAdministrator(): boolean {
    return this.isGod() || this.isAdmin();
  }
}
