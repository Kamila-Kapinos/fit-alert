import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-errors',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './errors.component.html',
  styleUrl: './errors.component.scss',
})
export class ErrorsComponent {
  @Input() control?: any;
  errors: string[] = [];

  ngOnChanges(): void {
    this.errors =
      this.control && this.control instanceof FormControl && this.control.errors
        ? Object.keys(this.control?.errors).map((key) =>
            this.getErrorTranslation(key),
          )
        : [];
  }

  private getErrorTranslation(key: string): string {
    switch (key) {
      case 'required':
        return 'This field is required.';
      case 'minlength':
        return `Minimum length is ${this.control?.errors?.['minlength'].requiredLength} characters.`;
      case 'maxlength':
        return `Maximum length is ${this.control?.errors?.['maxlength'].requiredLength} characters.`;
      case 'email':
        return 'Invalid email format.';
      case 'pattern':
        return 'The entered value does not match the required format.';
      default:
        return `An error occurred: ${key}.`;
    }
  }
}
