import { ValidatorFn } from '@angular/forms';

export const positivoValidator: ValidatorFn = control => {
  const value = control.value;
  return Number.isInteger(value) && value > 0 ? null : { positivo: true };
};