import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Bilera, BileraMota } from '../models/bilera.model';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BileraService {
  private readonly apiUrl = 'http://localhost:3000/api/bilerak';

  constructor(private http: HttpClient) {}

  // data eta ordua lortu
  private getFechaYHora(fechaDB: any): { fecha: Date; hora: string } {
    if (!fechaDB) return { fecha: new Date(), hora: '00:00' };
    
    const fecha = new Date(fechaDB);
    if (isNaN(fecha.getTime())) return { fecha: new Date(), hora: '00:00' };
    
    return {
      fecha,
      hora: fecha.toTimeString().slice(0, 5)
    };
  }

  // balio lehenetsia aukeratu
  private get<T>(primary: T, secondary: T, fallback: T): T {
    return primary ?? secondary ?? fallback;
  }

  // BD-ko datuak mapeatu bilera formatura
  private mapDbBileraToBilera(dbBilera: any): Bilera {
    const { fecha, hora } = this.getFechaYHora(dbBilera.data || dbBilera.fecha);

    return {
      id: this.get(dbBilera.id, dbBilera.id_reunion, 0),
      titulua: this.get(dbBilera.titulua, dbBilera.titulo, ''),
      azalpena: this.get(dbBilera.azalpena, dbBilera.asunto, ''),
      data: fecha,
      hasieraOrdua: this.get(dbBilera.hasieraOrdua, hora, '00:00'),
      amaieraOrdua: dbBilera.amaieraOrdua,
      gela: this.get(dbBilera.gela, dbBilera.aula, ''),
      egoera: this.get(dbBilera.egoera, dbBilera.estado, 'pendiente'),
      irakasleId: this.get(dbBilera.irakasleId, dbBilera.profesor_id, 0),
      ikasleId: this.get(dbBilera.ikasleId, dbBilera.alumno_id, 0),
      ikastetxeId: this.get(dbBilera.ikastetxeId, dbBilera.id_centro, 0),
      ikastetxeaIzena: this.get(dbBilera.centro_nombre, dbBilera.ikastetxeaIzena, ''),
      sortzeData: new Date(this.get(dbBilera.sortzeData, dbBilera.created_at, Date.now())),
      eguneratzeData: new Date(this.get(dbBilera.eguneratzeData, dbBilera.updated_at, Date.now()))
    };
  }

  /**
   * Obtener todas las reuniones
   */
  getAll(userId?: number, mota?: BileraMota): Observable<Bilera[]> {
    let params = new HttpParams();
    if (userId) params = params.set('user_id', userId.toString());
    if (mota) params = params.set('mota', mota);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl, { params }).pipe(
      map(response => response.data?.map(b => this.mapDbBileraToBilera(b)) ?? []),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener reunión por ID
   */
  getById(id: number): Observable<Bilera | null> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.success && response.data 
        ? this.mapDbBileraToBilera(response.data) 
        : null),
      catchError(this.handleError)
    );
  }

  /**
   * Crear nueva reunión
   */
  create(bileraData: Partial<Bilera>): Observable<Bilera> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, bileraData).pipe(
      map(response => {
        if (response.success && response.data) {
          return this.mapDbBileraToBilera(response.data);
        }
        throw new Error(response.message || 'Error al crear bilera');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar reunión
   */
  update(id: number, bileraData: Partial<Bilera>): Observable<Bilera> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, bileraData).pipe(
      map(response => {
        if (response.success && response.data) {
          return this.mapDbBileraToBilera(response.data);
        }
        throw new Error(response.message || 'Error al actualizar bilera');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar reunión
   */
  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  /**
   * Contar reuniones de hoy
   */
  getGaurkoKopurua(): Observable<number> {
    const gaur = this.getStartOfDay(new Date());
    
    return this.getAll().pipe(
      map(bilerak => bilerak.filter(bilera => 
        this.getStartOfDay(new Date(bilera.data)).getTime() === gaur.getTime()
      ).length)
    );
  }

  /**
   * Obtener próximas reuniones
   */
  getUpcoming(limit: number = 5): Observable<Bilera[]> {
    const gaur = this.getStartOfDay(new Date());

    return this.getAll().pipe(
      map(bilerak => bilerak
        .filter(bilera => new Date(bilera.data) >= gaur)
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
        .slice(0, limit)
      )
    );
  }

  /**
   * Helper: Obtener inicio del día (00:00:00)
   */
  private getStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en BileraService:', error);
    return throwError(() => error);
  }
}