
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
  
export class UsernameValidator {
    public noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }
}