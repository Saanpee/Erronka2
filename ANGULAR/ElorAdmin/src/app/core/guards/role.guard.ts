import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';


// Erabiltzaileak beharrezko rola duen konprobatzen du
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  const hasRole = authService.hasRole(requiredRoles);
  
  if (!hasRole) {
    console.warn('Sarbidea ukatua: erabiltzaileak ez du beharrezko rola');
    router.navigate(['/dashboard']);
    return false;
  }
  
  return true;
};
