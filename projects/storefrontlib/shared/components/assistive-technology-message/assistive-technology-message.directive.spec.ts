import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AtMessageModule } from './assistive-technology-message.module';
import { I18nTestingModule } from '@spartacus/core';
import { GlobalMessageService } from '../../../../core/src/global-message/facade/global-message.service';
import { GlobalMessageType } from '../../../../core/src/global-message/models/global-message.model';
import createSpy = jasmine.createSpy;

@Component({
  template: `
    <button class="cancel-btn" [cxAtMessage]="'common.cancel' | cxTranslate">
      Action
    </button>
    <button
      class="results-btn"
      [cxAtMessage]="'searchBox.productsResult' | cxTranslate: { count: 4 }"
    >
      Action
    </button>
  `,
})
class MockComponent {}

class MockGlobalMessageService implements Partial<GlobalMessageService> {
  add = createSpy().and.stub();
}

describe('AtMessageDirective', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let globalMessageService: GlobalMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AtMessageModule, I18nTestingModule],
      declarations: [MockComponent],
      providers: [
        {
          provide: GlobalMessageService,
          useClass: MockGlobalMessageService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    globalMessageService = TestBed.inject(GlobalMessageService);
    component = fixture.componentInstance;
  });

  function getCancelButton(): DebugElement {
    return fixture.debugElement.query(By.css('.cancel-btn'));
  }

  function getResultsButton(): DebugElement {
    return fixture.debugElement.query(By.css('.results-btn'));
  }

  it('should create test component', () => {
    expect(component).toBeTruthy();
  });

  it('should add assistive global message on click', () => {
    fixture.detectChanges();
    getCancelButton().nativeElement.click();
    expect(globalMessageService.add).toHaveBeenCalledWith(
      'common.cancel',
      GlobalMessageType.MSG_TYPE_ASSISTIVE
    );
  });

  it('should add assistive global message with parameters on click', () => {
    fixture.detectChanges();
    getResultsButton().nativeElement.click();
    expect(globalMessageService.add).toHaveBeenCalledWith(
      'searchBox.productsResult count:4',
      GlobalMessageType.MSG_TYPE_ASSISTIVE
    );
  });
});
