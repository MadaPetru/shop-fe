import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorModalComponent} from './error-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;
  let mockMatDialogRef: MatDialogRef<ErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorModalComponent],
      providers: [{
        provide: MatDialogRef,
        useValue: {
          close: jasmine.createSpy('close'),
          updatePosition: jasmine.createSpy('updatePosition')
        }
      }, {provide: MAT_DIALOG_DATA, useValue: {}}
      ],

    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockMatDialogRef = TestBed.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close modal should call the dialog ref to close', () => {
    component.closeModal();

    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});
