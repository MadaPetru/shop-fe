import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginModalComponent} from './login-modal.component';
import {ApisCallerService} from "../../apis-caller.service";
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {UserLoginRequest} from "../../common/dto/request/user-login-request";
import {UserLoginResponse} from "../../common/dto/request/user-login-response";
import {of, throwError} from "rxjs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ErrorModalComponent} from "../../error-modal/error-modal.component";
import {GrantedRoles} from "../../common/dto/request/granted-roles";

describe('LoginPageComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;
  let mockApiCallerService: ApisCallerService;
  let mockMatDialogRef: MatDialogRef<LoginModalComponent>;
  let mockMatDialogErrorModalRef: MatDialogRef<ErrorModalComponent>;
  let mockMatDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, MatDialogModule, BrowserAnimationsModule],
      declarations: [LoginModalComponent],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: jasmine.createSpy('close')
        }
      }, ApisCallerService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    mockApiCallerService = TestBed.inject(ApisCallerService);
    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogErrorModalRef = TestBed.inject(MatDialogRef);
    mockMatDialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on login when user is successfully authenticated should close the modal', () => {
    let request = new UserLoginRequest();
    let response: any = new UserLoginResponse();
    let grantedRoles = new Set<GrantedRoles>();
    grantedRoles.add(GrantedRoles.NORMAL_USER);
    grantedRoles.add(GrantedRoles.ADMINISTRATOR);
    response.roles = grantedRoles;
    spyOn(mockApiCallerService, 'loginUser').and.returnValue(of(response));

    component.onLogin(request);

    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  it('on login when user is unsuccessfully authenticated should open error modal', () => {
    let request = new UserLoginRequest();
    spyOn(mockMatDialog, "open").and.returnValue(mockMatDialogErrorModalRef);
    spyOn(mockApiCallerService, 'loginUser').and.returnValue(throwError(new Error('login error')));

    component.onLogin(request);

    expect(mockMatDialogRef.close).not.toHaveBeenCalled();
    expect(mockMatDialog.open).toHaveBeenCalled();
  });
});
