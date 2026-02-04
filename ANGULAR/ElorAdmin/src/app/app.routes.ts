import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  // Login orria publikoa
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent),
    title: 'Saioa Hasi - ElorAdmin'
  },

  // Dashboard babestuta 
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Hasiera - ElorAdmin'
  },

  // Erabiltzaileak kudeatu administratzaileak eta irakasleak soilik
  {
    path: 'erabiltzaileak',
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.GOD, UserRole.ADMIN, UserRole.IRAKASLE] },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/erabiltzaileak/erabiltzaile-zerrenda/erabiltzaile-zerrenda.component')
          .then(m => m.ErabiltzaileZerrendaComponent),
        title: 'Erabiltzaileak - ElorAdmin'
      },
      {
        path: 'berria',
        loadComponent: () => import('./features/erabiltzaileak/erabiltzaile-form/erabiltzaile-form.component')
          .then(m => m.ErabiltzaileFormComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.GOD, UserRole.ADMIN] },
        title: 'Erabiltzaile Berria - ElorAdmin'
      },
      {
        path: 'editatu/:id',
        loadComponent: () => import('./features/erabiltzaileak/erabiltzaile-form/erabiltzaile-form.component')
          .then(m => m.ErabiltzaileFormComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.GOD, UserRole.ADMIN, UserRole.IRAKASLE] },
        title: 'Erabiltzailea Editatu - ElorAdmin'
      }
    ]
  },

  // Bilerak
  {
    path: 'bilerak',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/bilerak/bilera-zerrenda/bilera-zerrenda.component')
          .then(m => m.BileraZerrendaComponent),
        title: 'Bilerak - ElorAdmin'
      },
      {
        path: 'berria',
        loadComponent: () => import('./features/bilerak/bilera-form/bilera-form.component')
          .then(m => m.BileraFormComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.IRAKASLE] },
        title: 'Bilera Berria - ElorAdmin'
      },
      {
        path: 'ikusi/:id',
        loadComponent: () => import('./features/bilerak/bilera-form/bilera-form.component')
          .then(m => m.BileraFormComponent),
        title: 'Bilera Ikusi - ElorAdmin'
      },

      // Bilera editatu irakaslea soilik
      {
        path: 'editatu/:id',
        loadComponent: () => import('./features/bilerak/bilera-form/bilera-form.component')
          .then(m => m.BileraFormComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.IRAKASLE] },
        title: 'Bilera Editatu - ElorAdmin'
      }
    ]
  },

  // Ikastetxeak mapa eta zerrenda
  {
    path: 'ikastetxeak',
    canActivate: [authGuard],
    loadComponent: () => import('./features/ikastetxeak/ikastetxe-zerrenda/ikastetxe-zerrenda.component')
      .then(m => m.IkastetxeZerrendaComponent),
    title: 'Ikastetxeak - ElorAdmin'
  },

  // Profila
  {
    path: 'profila',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profila/profila.component')
      .then(m => m.ProfilaComponent),
    title: 'Nire Profila - ElorAdmin'
  },

  // Ordutegia irakasle eta ikasleentzat soilik
  {
    path: 'ordutegia',
    canActivate: [authGuard],
    loadComponent: () => import('./features/ordutegia/ordutegia.component')
      .then(m => m.OrdutegiaComponent),
    title: 'Ordutegia - ElorAdmin'
  },

  // Bide lehenetsia dashboard-era birbideratu
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // 404 ez aurkitua
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component')
      .then(m => m.NotFoundComponent),
    title: '404 - Ez aurkitua'
  }
];
