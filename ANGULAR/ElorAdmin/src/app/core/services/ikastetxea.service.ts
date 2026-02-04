import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import {
  Ikastetxea,
  IkastetxeaFilters,
  IkastetxeMota,
  Lurraldea,
  MapMarker
} from '../models/ikastetxea.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IkastetxeaService {
  private openDataUrl = environment.openDataUrl;
  private ikastetxeak: Ikastetxea[] = [];
  private dataLoaded = false;

  constructor(private http: HttpClient) {}

  //Mota lortu DTITUC-tik
  private getMota(dtituc: string): IkastetxeMota {
    if (!dtituc) return 'beste_publiko';
    const upper = dtituc.toUpperCase();
    if (upper.includes('EDUCACIÓN') || upper.includes('HEZKUNTZA')) return 'hezkuntza_saila';
    if (upper.includes('PRIVAD') || upper.includes('KONTZERTATU')) return 'pribatua';
    return 'beste_publiko';
  }

  //Lurraldea lortu DTERRC-tik
  private getLurraldea(dterrc: string): Lurraldea {
    if (!dterrc) return 'bizkaia';
    const upper = dterrc.toUpperCase();
    if (upper.includes('ARABA') || upper.includes('ÁLAVA')) return 'araba';
    if (upper.includes('GIPUZKOA') || upper.includes('GUIPÚZCOA')) return 'gipuzkoa';
    return 'bizkaia';
  }

  //Ikastetxe guztiak lortu
  getAll(): Observable<Ikastetxea[]> {
  return this.http.get<any>('http://localhost:3000/api/ikastetxeak').pipe(
    map(response => {
      
      if (!response || !response.success || !response.data) {
        console.error('Formato de JSON inválido');
        return [];
      }

      const data = response.data;
      
      if (!data.CENTROS || !Array.isArray(data.CENTROS)) {
        console.error('No se encontró el array CENTROS');
        return [];
      }

      // Filtrar centros que tengan CCEN 
      const centrosConId = data.CENTROS.filter((centro: any) => centro.CCEN);

      return centrosConId.map((centro: any) => {
        const ikastetxea: Ikastetxea = {
          id: centro.CCEN, 
          kodea: centro.CCEN?.toString() || '',
          izena: centro.NOME || centro.NOM || 'Sin nombre',
          mota: this.getMota(centro.DTITUC),
          lurraldea: this.getLurraldea(centro.DTERRC),
          udalerria: centro.DMUNIE || centro.DMUNIC || '',
          helbidea: centro.DOMI || '',
          postaKodea: centro.CPOS?.toString() || '',
          telefonoa: centro.TEL1?.toString() || '',
          emaila: centro.EMAIL || '',
          webgunea: centro.PAGINA || '',
          latitudea: centro.LATITUD,
          longitudea: centro.LONGITUD
        };
        return ikastetxea;
      });
    }),
  );
}

  //Ikastetxea lortu ID bidez
  getById(id: number): Observable<Ikastetxea | undefined> { 
    
    return this.getAll().pipe(
      map(ikastetxeak => {
        const found = ikastetxeak.find(i => i.id === id);
        console.log('Ikastetxea encontrado:', found);
        return found;
      })
    );
  }

  //Ikastetxeak filtratu
  getFiltered(filters: IkastetxeaFilters): Observable<Ikastetxea[]> {
    return this.getAll().pipe(
      delay(300),
      map(ikastetxeak => {
        let filtered = [...ikastetxeak];

        // Mota bidezko filtroa
        if (filters.mota && filters.mota !== 'guztiak') {
          filtered = filtered.filter(i => i.mota === filters.mota);
        }

        // Lurralde bidezko filtroa
        if (filters.lurraldea) {
          filtered = filtered.filter(i => i.lurraldea === filters.lurraldea);
        }

        // Udalerri bidezko filtroa
        if (filters.udalerria) {
          filtered = filtered.filter(i =>
            i.udalerria.toLowerCase().includes(filters.udalerria!.toLowerCase())
          );
        }

        // Testu bidezko bilaketa
        if (filters.bilaketa) {
          const query = filters.bilaketa.toLowerCase();
          filtered = filtered.filter(i =>
            i.izena.toLowerCase().includes(query) ||
            i.udalerria.toLowerCase().includes(query) ||
            i.kodea.includes(query)
          );
        }

        return filtered;
      })
    );
  }

  //Lurralde bateko ikastetxeak
  getByLurraldea(lurraldea: Lurraldea): Observable<Ikastetxea[]> {
    return this.getFiltered({ lurraldea });
  }

  //Udalerri bateko ikastetxeak
  getByUdalerria(udalerria: string): Observable<Ikastetxea[]> {
    return this.getFiltered({ udalerria });
  }

  //Mapa markatzaileak lortu
  getMapMarkers(filters?: IkastetxeaFilters): Observable<MapMarker[]> {
    const source = filters ? this.getFiltered(filters) : this.getAll();

    return source.pipe(
      map(ikastetxeak => ikastetxeak.map(i => ({
        id: i.id,
        izena: i.izena,
        latitudea: i.latitudea,
        longitudea: i.longitudea,
        helbidea: `${i.helbidea}, ${i.udalerria}`,
        mota: i.mota
      })))
    );
  }

  //Udalerri zerrenda lortu (filtroentzat)
  getUdalerriak(lurraldea?: Lurraldea): Observable<string[]> {
    return this.getAll().pipe(
      map(ikastetxeak => {
        let filtered = ikastetxeak;
        if (lurraldea) {
          filtered = ikastetxeak.filter(i => i.lurraldea === lurraldea);
        }
        const udalerriak = [...new Set(filtered.map(i => i.udalerria))];
        return udalerriak.sort();
      })
    );
  }
}