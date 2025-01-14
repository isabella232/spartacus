import { ClearCartDialogComponentService } from './clear-cart-dialog-component.service';
import {
  IconTestingModule,
  KeyboardFocusTestingModule,
} from '@spartacus/storefront';
import { I18nTestingModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClearCartDialogComponent } from './clear-cart-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

const mockCloseReason = 'Cancel Clear Cart';
const clearProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
  false
);
class MockClearCartService implements Partial<ClearCartDialogComponentService> {
  clearActiveCart(): void {}
  getClearingCartProgess(): BehaviorSubject<boolean> {
    return clearProgress$;
  }
  closeDialog(): void {}
}

describe('ClearCartDialogComponent', () => {
  let component: ClearCartDialogComponent;
  let fixture: ComponentFixture<ClearCartDialogComponent>;
  let clearCartService: ClearCartDialogComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        I18nTestingModule,
        KeyboardFocusTestingModule,
        IconTestingModule,
      ],
      declarations: [ClearCartDialogComponent],
      providers: [
        {
          provide: ClearCartDialogComponentService,
          useClass: MockClearCartService,
        },
      ],
    }).compileComponents();

    clearCartService = TestBed.inject(ClearCartDialogComponentService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearCartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isClearing$).toBeDefined();
  });

  it('should trigger clear cart', () => {
    spyOn(clearCartService, 'clearActiveCart');

    const clearBtn = fixture.debugElement.query(
      By.css('.btn-primary')
    ).nativeElement;

    clearBtn.click();

    expect(clearCartService.clearActiveCart).toHaveBeenCalled();
  });

  it('should close dialog on cancel', () => {
    spyOn(clearCartService, 'closeDialog');
    const clearBtn = fixture.debugElement.query(
      By.css('.btn-action')
    ).nativeElement;

    clearBtn.click();

    expect(clearCartService.closeDialog).toHaveBeenCalledWith(mockCloseReason);
  });

  it('should close dialog on cross click', () => {
    spyOn(clearCartService, 'closeDialog');
    const clearBtn = fixture.debugElement.query(By.css('.close')).nativeElement;

    clearBtn.click();

    expect(clearCartService.closeDialog).toHaveBeenCalled();
  });
});
