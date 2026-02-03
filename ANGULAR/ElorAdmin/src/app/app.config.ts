/**
 * App Config - ElorAdmin
 * Aplikazioaren konfigurazio nagusia
 * Zerbitzuak, routerra eta i18n konfiguratzen ditu
 */

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

/**
 * Itzulpen fitxategiak kargatzeko factory
 * assets/i18n/ karpetatik kargatzen ditu
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Aplikazioaren konfigurazioa
 * - Router: Nabigazio sistema
 * - HttpClient: API deiak egiteko
 * - Animations: Angular animazioak
 * - TranslateModule: i18n (euskara, gaztelania, ingelesa)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Routerra konfiguratu
    provideRouter(routes),

    // HTTP bezeroa interceptor-ekin
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // Itzulpenak konfiguratu (i18n)
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
