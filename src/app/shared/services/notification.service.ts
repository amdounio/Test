import {Injectable} from '@angular/core';
import {IndividualConfig, ToastrService} from "ngx-toastr";
import {NotificationComponent} from "../components/notification/notification.component";
import {Notification} from "../../core/models/notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public optionsToaster: Partial<IndividualConfig<any>>

  constructor(private toastr: ToastrService) {
    this.optionsToaster = this.toastr.toastrConfig;
    this.optionsToaster.positionClass = 'toast-bottom-right';
    this.optionsToaster.toastComponent = NotificationComponent
  }

  NotificationModel(message: string, type: number, options = {}) {
    const dataSnack: Notification = {
      'message': message,
      'type': type,
    }
    const toast = this.toastr.show(
      '',
      '',
      {...this.optionsToaster}
    );

    toast.toastRef.componentInstance.data = dataSnack;

    setTimeout(() => {
      this.toastr.remove(toast.toastId)
    }, 3000);
  }

  Success(message: string) {
    this.NotificationModel(message, 1, {panelClass: ['succes-NotificationModel']});
  }

  Info(message: string) {
    this.NotificationModel(message, 2, {panelClass: ['info-NotificationModel']});
  }

  Error(message: string) {
    this.NotificationModel(message, 3, {panelClass: ['error-NotificationModel']});
  }

  Warning(message: string) {
    this.NotificationModel(message, 4, {panelClass: ['warning-NotificationModel']});
  }

}
