import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'control-messages',
  templateUrl: './controlmessages.component.html',
  styleUrls: ['./controlmessages.component.scss'],
})
export class ControlMessagesComponent {

  private _required: string;
  private _email: string;
  private _password: string;
  private _minLength: string;
  errMessage: string;
  @Input() control: FormControl;
  constructor(private utilsService: UtilsService) {
    this._translateVariable('CONTROLMESSAGE_TS.MIN_LENGTH', this._required);
    this._translateVariable('CONTROLMESSAGE_TS.INVALID_EMAIL_ADDRESS', this._email);
    this._translateVariable('CONTROLMESSAGE_TS.PASSWORD_REQUIRED_ERROR', this._password);
    this._translateVariable('CONTROLMESSAGE_TS.MIN_LENGTH', this._minLength);
  }

  private _translateVariable(varLanguage: string, localVariable: any) {
    this.utilsService.translateLanguage(varLanguage).subscribe(resp => {
      localVariable = resp;
    });
  }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': this._required,
      'invalidEmailAddress': this._email,
      'pattern': this._password,
      'minlength': `${this._minLength} ${validatorValue.requiredLength}`
    }
    return config[validatorName];
  }

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && (this.control.touched || this.control.value)) {
        this.errMessage = this.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        return this.errMessage;
      }
    }

    return null;
  }


}
