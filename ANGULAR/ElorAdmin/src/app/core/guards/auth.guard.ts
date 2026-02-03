import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';


// Erabiltzailea logeatuta ez badago, login-era birbideratzen du
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Erabiltzailea autentikatuta dagoen konprobatu
  if (authService.isLoggedIn()) {
    return true;
  }

  // Ez badago logeatuta, login-era birbideratu
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
