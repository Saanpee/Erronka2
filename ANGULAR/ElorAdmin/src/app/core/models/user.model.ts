// ROLAK
export enum UserRole {
  GOD = 'GOD',
  ADMIN = 'ADMIN',
  IRAKASLE = 'IRAKASLE',
  IKASLE = 'IKASLE'
}

// DATUAK
export interface User {
  id: number;
  email: string;
  izena: string;
  abizena: string;
  dni?: string;
  helbidea?: string;
  telefonoa1?: string;
  telefonoa2?: string;
  rola: UserRole;
  tipo_id: number;
  argazkiaUrl?: string;
  argazkia_url?: string;
  sortzeData: string;
  aktibo: boolean;
}

// IRAKASLE INTERFAZEA
export interface Irakasle extends User {
  UserRole: 'irakasle';
  ordutegia?: OrdutegiaItem[]; 
}

// IKASLE INTERFAZEA
export interface Ikasle extends User {
  UserRole: 'ikasle';
  zikloa?: string;     
  taldea?: string;       
  ordutegia?: OrdutegiaItem[]; 
}
// ORDUTEGIA
export interface OrdutegiaItem {
  eguna: 'astelehena' | 'asteartea' | 'asteazkena' | 'osteguna' | 'ostirala';
  ordua: number;          
  ikasgaia: string;       
  gela?: string;          
  irakaslea?: string;      
}

// LOGIN ESKARIA
export interface LoginRequest {
  email: string;
  pasahitza: string;
}

// LOGIN ERANTZUNA
export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

// ERABILTZAILEA SORTZEKO ESKARIA
export interface CreateUserRequest {
  izena: string;
  abizena: string;
  email: string;
  pasahitza: string;
  rola: UserRole;
  argazkia?: string;
  telefonoa?: string;
  helbidea?: string;
}

// ERABILTZAILEA EGUNERATZEKO ESKARIA
export interface UpdateUserRequest {
  izena?: string;
  abizena?: string;
  email?: string;
  pasahitza?: string;
  argazkia?: string;
  telefonoa?: string;
  helbidea?: string;
  aktibo?: boolean;
}
