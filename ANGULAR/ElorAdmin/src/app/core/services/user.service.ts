import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {
  User,
  Irakasle,
  Ikasle,
  UserRole,
  CreateUserRequest,
  UpdateUserRequest,
  OrdutegiaItem
} from '../models/user.model';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  private mapDbUserToUser(dbUser: any): User {
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

  private mapTipoIdToRole(tipoId: number): UserRole {
    switch (tipoId) {
      case 1: return UserRole.GOD;
      case 2: return UserRole.ADMIN;
      case 3: return UserRole.IRAKASLE;
      case 4: return UserRole.IKASLE;
      default: return UserRole.IKASLE;
    }
  }

  private mapRoleToTipoId(role: UserRole): number {
    switch (role) {
      case UserRole.GOD: return 1;
      case UserRole.ADMIN: return 2;
      case UserRole.IRAKASLE: return 3;
      case UserRole.IKASLE: return 4;
      default: return 4;
    }
  }

  getAll(role?: UserRole): Observable<User[]> {
    let params = new HttpParams();
    if (role) {
      params = params.set('tipo_id', this.mapRoleToTipoId(role).toString());
    }
    
    return this.http.get<ApiResponse<any[]>>(this.apiUrl, { params })
      .pipe(
        map(response => response.data ? response.data.map(u => this.mapDbUserToUser(u)) : [])
      );
  }

  getById(id: number): Observable<User | undefined> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data ? this.mapDbUserToUser(response.data) : undefined)
      );
  }

  getAdministratzaileak(): Observable<User[]> {
    return this.getAll().pipe(
      map(users => users.filter(u => u.rola === UserRole.GOD || u.rola === UserRole.ADMIN))
    );
  }

  getIrakasleak(): Observable<Irakasle[]> {
    const params = new HttpParams().set('tipo_id', '3');
    
    return this.http.get<ApiResponse<any[]>>(this.apiUrl, { params })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            console.error('Respuesta sin datos:', response);
            return [];
          }
          return response.data.map(u => this.mapDbUserToUser(u) as Irakasle);
        }),
        catchError(error => {
          console.error('Error en getIrakasleak:', error);
          return throwError(() => error);
        })
      );
  }

  getIkasleak(): Observable<Ikasle[]> {
    return this.getAll(UserRole.IKASLE) as Observable<Ikasle[]>;
  }

  create(userData: CreateUserRequest): Observable<User> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, userData)
      .pipe(
        map(response => this.mapDbUserToUser(response.data!))
      );
  }

  update(id: number, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, userData)
      .pipe(
        map(response => this.mapDbUserToUser(response.data!))
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => void 0)
      );
  }

  search(query: string): Observable<User[]> {
    return this.getAll().pipe(
      map(users => {
        const lowQuery = query.toLowerCase();
        return users.filter(u =>
          u.izena.toLowerCase().includes(lowQuery) ||
          u.abizena.toLowerCase().includes(lowQuery) ||
          u.email.toLowerCase().includes(lowQuery)
        );
      })
    );
  }

  getCounts(): Observable<{ ikasleak: number; irakasleak: number; adminak: number }> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats/counts`)
      .pipe(
        map(response => response.data!)
      );
  }

  getOrdutegiaByUserId(userId: number): Observable<OrdutegiaItem[]> {
    const ordutegia: OrdutegiaItem[] = [
      { eguna: 'astelehena', ordua: 1, ikasgaia: 'Ikasgaia 1' },
      { eguna: 'astelehena', ordua: 2, ikasgaia: 'Ikasgaia 1' },
      { eguna: 'asteartea', ordua: 3, ikasgaia: 'Tutoretza' },
      { eguna: 'asteazkena', ordua: 2, ikasgaia: 'Ikasgaia 2' },
      { eguna: 'asteazkena', ordua: 3, ikasgaia: 'Ikasgaia 2' },
      { eguna: 'osteguna', ordua: 1, ikasgaia: 'Ikasgaia 1' },
      { eguna: 'osteguna', ordua: 3, ikasgaia: 'Ikasgaia 1' },
      { eguna: 'osteguna', ordua: 4, ikasgaia: 'Zaintza' },
      { eguna: 'ostirala', ordua: 3, ikasgaia: 'Zaintza' },
      { eguna: 'ostirala', ordua: 4, ikasgaia: 'Ikasgaia 3' }
    ];
    return new Observable(observer => {
      observer.next(ordutegia);
      observer.complete();
    });
  }
}
