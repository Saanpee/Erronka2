import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Aplikazioa abiarazi
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Errorea aplikazioa abiarazten:', err));
