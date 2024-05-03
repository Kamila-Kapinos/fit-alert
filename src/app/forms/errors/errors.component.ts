import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-errors',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './errors.component.html',
  styleUrl: './errors.component.scss',
})
export class ErrorsComponent implements OnInit {
  @Input() control?: any;
  errors: string[] = [];

  fControl?: FormControl;

  ngOnInit() {
    if (this.control && this.control instanceof FormControl) {
      const control = this.control;
      this.fControl = control;
      control.statusChanges.subscribe(() => {
        this.errors = control.errors
          ? Object.keys(control.errors).map((key) =>
              this.getErrorDescription(key),
            )
          : [];
      });
    }
  }

  private getErrorDescription(key: string): string {
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
