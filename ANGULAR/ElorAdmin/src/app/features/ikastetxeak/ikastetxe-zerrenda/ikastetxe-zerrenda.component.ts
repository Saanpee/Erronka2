import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import * as mapboxgl from 'mapbox-gl';

import { IkastetxeaService } from '../../../core/services/ikastetxea.service';
import { Ikastetxea, IkastetxeaFilters, IkastetxeMota, Lurraldea, MapMarker } from '../../../core/models/ikastetxea.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ikastetxe-zerrenda',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LoadingSpinnerComponent],
  templateUrl: './ikastetxe-zerrenda.component.html',
  styleUrls: ['./ikastetxe-zerrenda.component.css']
})
export class IkastetxeZerrendaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  // Mapa
  private map!: mapboxgl.Map;
  private markers: mapboxgl.Marker[] = [];
  

  // Ikastetxeak
  ikastetxeak: Ikastetxea[] = [];
  filteredIkastetxeak: Ikastetxea[] = [];
  selectedIkastetxea: Ikastetxea | null = null;

  // Udalerriak
  udalerriak: string[] = [];

  // Filtroak
  filters: IkastetxeaFilters = {};

  // Egoera
  isLoading = true;

  constructor(private ikastetxeaService: IkastetxeaService) {}

  ngOnInit(): void {
    this.loadIkastetxeak();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  // Mapa hasieratu
  private initMap(): void {
    // Mapa sortu con token en opciones
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [environment.defaultCenter.lng, environment.defaultCenter.lat],
      zoom: 20 ,
      accessToken: environment.mapboxToken,
      projection: 'mercator' // evita el globo
    });

    // Kontrolak gehitu
    this.map.addControl(new mapboxgl.NavigationControl());

    // Manejar imágenes faltantes silenciosamente
    this.map.on('styleimagemissing', (e) => {
      const id = e.id;
      
      // Crear imagen placeholder transparente
      const width = 64;
      const height = 64;
      const data = new Uint8Array(width * height * 4);
      
      // Rellenar con transparente
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
      }
      
      if (!this.map.hasImage(id)) {
        this.map.addImage(id, { width, height, data });
      }
    });

    // Mapa kargatutakoan, markatzaileak gehitu
    this.map.on('load', () => {
      this.updateMapMarkers();
    });
  }

  // Ikastetxeak kargatu
  private loadIkastetxeak(): void {
    this.isLoading = true;
    this.ikastetxeaService.getAll().subscribe({
      next: (ikastetxeak) => {
        this.ikastetxeak = ikastetxeak;
        this.filteredIkastetxeak = ikastetxeak;
        this.isLoading = false;
        this.updateMapMarkers();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // Lurraldea aldatu
  onLurraldeaChange(): void {
    this.filters.udalerria = '';

    if (this.filters.lurraldea) {
      this.ikastetxeaService.getUdalerriak(this.filters.lurraldea as Lurraldea).subscribe(
        udalerriak => this.udalerriak = udalerriak
      );
    } else {
      this.udalerriak = [];
    }

    this.onFilterChange();
  }

  // Filtroak aldatu
  onFilterChange(): void {
    this.ikastetxeaService.getFiltered(this.filters).subscribe(ikastetxeak => {
      this.filteredIkastetxeak = ikastetxeak;
      this.updateMapMarkers();
    });
  }

  // Mapa markatzaileak eguneratu
  private updateMapMarkers(): void {
    if (!this.map) return;

    // Markatzaile zaharrak ezabatu
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Markatzaile berriak gehitu
    this.filteredIkastetxeak.forEach(ikastetxea => {
      // Popup sortu
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>${ikastetxea.izena}</strong><br>
        <small>${ikastetxea.helbidea}, ${ikastetxea.udalerria}</small>
      `);

      // Markatzailea sortu
      const marker = new mapboxgl.Marker({
        color: this.getMarkerColor(ikastetxea.mota)
      })
        .setLngLat([ikastetxea.latitudea, ikastetxea.longitudea])
        .setPopup(popup)
        .addTo(this.map);

      // Markatzailearen klik gertaera
      marker.getElement().addEventListener('click', () => {
        this.selectedIkastetxea = ikastetxea;
      });

      this.markers.push(marker);
    });
  }

  // Ikastetxea hautatu
  onSelectIkastetxea(ikastetxea: Ikastetxea): void {
    this.selectedIkastetxea = ikastetxea;

    // Mapan zentratu
    this.map.flyTo({
      center: [ikastetxea.latitudea, ikastetxea.longitudea],
      zoom: 14
    });

    // Markatzailearen popup-a ireki
    const marker = this.markers.find(m => {
      const lngLat = m.getLngLat();
      return lngLat.lng === ikastetxea.latitudea && lngLat.lat === ikastetxea.longitudea;
    });
    marker?.togglePopup();
  }

  // Markatzaile kolorea
  private getMarkerColor(mota: IkastetxeMota): string {
    switch (mota) {
      case 'hezkuntza_saila': return '#0077b6';
      case 'pribatua': return '#ffc107';
      case 'beste_publiko': return '#28a745';
      default: return '#6c757d';
    }
  }

  // Mota badge klasea
  getMotaBadgeClass(mota: IkastetxeMota): string {
    switch (mota) {
      case 'hezkuntza_saila': return 'bg-primary';
      case 'pribatua': return 'bg-warning text-dark';
      case 'beste_publiko': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}
