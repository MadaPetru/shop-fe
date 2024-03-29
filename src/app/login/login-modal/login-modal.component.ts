import {Component} from '@angular/core';
import {ApisCallerService} from "../../apis-caller.service";
import {UserLoginResponse} from "../../common/dto/request/user-login-response";
import {GrantedRoles} from "../../common/dto/request/granted-roles";
import {ErrorModalComponent} from "../../error-modal/error-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {

  constructor(private dialogRef: MatDialogRef<LoginModalComponent>, private apisCallerService: ApisCallerService, private dialog: MatDialog) {
  }


  onLogin(loginForm: any) {
    this.apisCallerService.loginUser(loginForm.value).subscribe((response: UserLoginResponse) => {
        let roles = response.roles;
        let isAdmin = false;
        roles.forEach((role) => {
          if (role == GrantedRoles.ADMINISTRATOR) {
            isAdmin = true;
          }
        })
        const jwt = response.jwt;
        localStorage.setItem('jwt', jwt);
        this.dialogRef.close(isAdmin);
      },
      (response: Error) => {
        let errorMessage = "Wrong password or username!";
        this.dialog.open(ErrorModalComponent, {
          data: {
            errorMessage: errorMessage
          }
        });
      });
  }

}
