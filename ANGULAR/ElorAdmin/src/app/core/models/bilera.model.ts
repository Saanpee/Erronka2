export type BileraMota = 'hezkuntza_saila' | 'pribatua' | 'beste_publiko';

export type BileraEgoera = 'planifikatuta' | 'burututa' | 'bertan_behera';

// DATUAK
export interface Bilera {
  id: number;
  egoera: string;
  irakasleId: number;
  ikasleId: number;
  ikastetxeId: number;
  titulua: string;
  azalpena: string;
  gela: string;
  data: Date;
  hasieraOrdua?: string;
  amaieraOrdua?: string;
  ikastetxeaIzena?: string;
  sortzeData: Date;
  eguneratzeData: Date;
}

// SORTZEKO ESKARIAK
export interface CreateBileraRequest {
  id: number;
  egoera: string;
  mota: BileraMota;
  irakasleId: number;
  ikasleId: number;
  ikastetxeId: number;
  titulua: string;
  deskribapena: string;
  gela: string;
  data: Date;
}

// BILERA FILTROAK
export interface BileraFilters {
  mota?: BileraMota;
  lurraldea?: string;
  udalerria?: string;
  dataHasiera?: Date;
  dataAmaiera?: Date;
  ikastetxeaId?: number;
}
