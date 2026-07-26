import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  field1 = 'password',
  field2 = 'confirmPassword',
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const first = control.get(field1);
    const second = control.get(field2);

    if (!first || !second) return null;

    return first.value !== second.value ? { passwordMismatch: true } : null;
  };
}
