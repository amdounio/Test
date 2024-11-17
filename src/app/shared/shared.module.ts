import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbAccordionModule, NgbCarouselModule, NgbDatepickerModule, NgbDropdown, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { FormatDatePipe } from './pipes/format-date.pipe';
import { Helper } from "./helpers";
import { LastLoginPipe } from './pipes/last-login.pipe';

const sharedModule = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  NgSelectModule,
  NgbDatepickerModule,
  FormatDatePipe,
  LastLoginPipe,
  NgbCarouselModule,
  NgbAccordionModule,
  NgbDropdownModule,
];

@NgModule({
  imports: sharedModule,
  exports: sharedModule,
  providers: [CurrencyPipe, Helper, LastLoginPipe,DatePipe]
})
export class SharedModule { }
