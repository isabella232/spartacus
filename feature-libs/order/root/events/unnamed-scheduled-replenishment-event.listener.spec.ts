import { TestBed } from '@angular/core/testing';
import { CxEvent, EventService } from '@spartacus/core';
import { Subject } from 'rxjs';
import { CheckoutScheduledReplenishmentEventListener } from './unnamed-scheduled-replenishment-event.listener';
import { ReplenishmentOrderScheduledEvent } from './unnamed-scheduled-replenishment.events';
import { CheckoutResetQueryEvent } from './unnamed.events';
import createSpy = jasmine.createSpy;

const mockEventStream$ = new Subject<CxEvent>();
class MockEventService implements Partial<EventService> {
  get = createSpy().and.returnValue(mockEventStream$.asObservable());
  dispatch = createSpy();
}

describe(`CheckoutScheduledReplenishmentEventListener`, () => {
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CheckoutScheduledReplenishmentEventListener,
        {
          provide: EventService,
          useClass: MockEventService,
        },
      ],
    });

    TestBed.inject(CheckoutScheduledReplenishmentEventListener);
    eventService = TestBed.inject(EventService);
  });

  describe(`onReplenishmentOrder`, () => {
    it(`ReplenishmentOrderScheduledEvent should dispatch CheckoutResetQueryEvent`, () => {
      mockEventStream$.next(new ReplenishmentOrderScheduledEvent());

      expect(eventService.dispatch).toHaveBeenCalledWith(
        {},
        CheckoutResetQueryEvent
      );
    });
  });
});
