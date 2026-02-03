export type IkastetxeMota = 'guztiak' | 'hezkuntza_saila' | 'pribatua' | 'beste_publiko';

export type Lurraldea = 'araba' | 'bizkaia' | 'gipuzkoa';

// DATUAK 
export interface Ikastetxea {
  id: number;
  kodea: string;              
  izena: string;              
  mota: IkastetxeMota;          
  lurraldea: Lurraldea;         
  udalerria: string;            
  helbidea: string;             
  postaKodea: string;           
  telefonoa?: string;           
  emaila?: string;          
  webgunea?: string;          

  // Koordenatuak mapan erakusteko
  latitudea: number;            
  longitudea: number;    

  // Datu gehigarriak
  ikasleKopurua?: number;      
  irakasleKopurua?: number;    
  zikloak?: string[];         
}

// JSON FORMATUA
export interface IkastetxeaRaw {
  DCODCEN: string;             
  DTITCEN: string;             
  DTITUC: string;               
  DTERRER: string;             
  DMUNIC: string;               
  DDOMIC: string;               
  DCP: string;                
  DTELEF?: string;              
  DEMAIL?: string;              
  DWEB?: string;                
  DUTMX?: number;               
  DUTMY?: number;              
}

// FILTROAK
export interface IkastetxeaFilters {
  mota?: IkastetxeMota;
  lurraldea?: Lurraldea;
  udalerria?: string;
  bilaketa?: string;          
}

// MAP MARKER
export interface MapMarker {
  id: number;
  izena: string;
  latitudea: number;
  longitudea: number;
  helbidea: string;
  mota: IkastetxeMota;
}
