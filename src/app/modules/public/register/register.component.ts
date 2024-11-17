import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormField } from '../../../core/models/form-fields.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailRegex } from '../../../shared/constant';
import { GoogleOAuthDto } from '../../../core/models/google-auth.dto';
import { User } from '../../../models/user.model';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  images: string[] = [
    "assets/images/stadium.png",
    "assets/images/stadium.png",
    "assets/images/stadium.png"
  ]

  form!: FormGroup;
  formFields: FormField[] = [
    { fieldName: 'firstname', validators: [Validators.required], value: '' },
    { fieldName: 'lastname', validators: [Validators.required], value: '' },
    { fieldName: 'email', validators: [Validators.required, Validators.pattern(emailRegex)], value: '' },
    { fieldName: 'password', validators: [Validators.required, Validators.minLength(8)], value: '' },
    { fieldName: 'acceptLegalPolicy', validators: [Validators.required], value: '' },
  ]
  functionsValidators: any[] = []
  constructor(private config: NgbCarouselConfig, private authenticationService : AuthenticationService) {
    this.config.showNavigationArrows = false
  }

  ngOnInit(): void {
    this.buildForm()
  }


  buildForm() {
    return new Promise((resolve) => {
      const controls: any = {};
      this.formFields.forEach((field: FormField) => {
        controls[field.fieldName] = new FormControl({ value: field.value, disabled: field.disabled }, field.validators);
      })

      if (this.functionsValidators.length === 0) {
        this.form = new FormGroup(controls);
      } else {
        this.form = new FormGroup(controls, this.functionsValidators);
      }
      resolve(this.form);
    });
  }

  createObject(): GoogleOAuthDto {
    const entity: User = <User>{}
    this.formFields.forEach((field) => {
      // @ts-ignore
      entity[field.fieldName] = this.form.get(field.fieldName)?.value || null;
    });
    return entity as GoogleOAuthDto;
  }


  submit() {
    let data = this.createObject()
    this.authenticationService.login(data)
  }

}
