import { TestBed } from '@angular/core/testing';
import {
  EventService,
  SiteContextParamsService,
  StatePersistenceService,
  StorageSyncType,
} from '@spartacus/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { CartConfig } from '../../config/cart-config';
import { defaultCartConfig } from '../../config/default-cart-config';
import { CartPersistentStorageChangeEvent } from '../../events/cart.events';
import { ActiveCartFacade } from '../../facade/active-cart.facade';
import { Cart } from '../../models/cart.model';
import { MiniCartComponentService } from './mini-cart-component.service';

const activeCart = new ReplaySubject<Cart>();

class MockActiveCartFacade implements Partial<ActiveCartFacade> {
  getActive(): Observable<Cart> {
    return activeCart.asObservable();
  }
}

class MockEventService implements Partial<EventService> {
  get(): Observable<any> {
    return of();
  }
}

class MockStatePersistenceService implements Partial<StatePersistenceService> {
  readStateFromStorage<T>({}: {
    key: string;
    context?: string | Array<string>;
    storageType?: StorageSyncType;
  }): T | undefined {
    return {} as T | undefined;
  }
}
class MockSiteContextParamsService
  implements Partial<SiteContextParamsService>
{
  getValue(_param: string): string {
    return 'SiteContextParamsService.value';
  }
}

const mockBrowserCartState = {
  active: 'mockCartId',
};

const mockBaseSite = 'mockBaseSite';

// const mockCartPersistentStorageChangeEvent = {
//   state: mockBrowserCartState,
// } as Partial<CartPersistentStorageChangeEvent>;

const mockCartPersistentStorageChangeEvent =
  new CartPersistentStorageChangeEvent();
mockCartPersistentStorageChangeEvent.state = mockBrowserCartState;

fdescribe('MiniCartComponentService', () => {
  let service: MiniCartComponentService;
  // let activeCartFacade: ActiveCartFacade;
  // let eventService: EventService;
  let statePersistenceService: StatePersistenceService;
  let siteContextParamsService: SiteContextParamsService;
  // let config: CartConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: ActiveCartFacade, useClass: MockActiveCartFacade },
        { provide: EventService, useClass: MockEventService },
        {
          provide: StatePersistenceService,
          useClass: MockStatePersistenceService,
        },
        {
          provide: SiteContextParamsService,
          useClass: MockSiteContextParamsService,
        },
        {
          provide: CartConfig,
          useValue: JSON.parse(JSON.stringify(defaultCartConfig)),
        },
      ],
    });
    service = TestBed.inject(MiniCartComponentService);
    // activeCartFacade = TestBed.inject(ActiveCartFacade);
    // eventService = TestBed.inject(EventService);
    statePersistenceService = TestBed.inject(StatePersistenceService);
    siteContextParamsService = TestBed.inject(SiteContextParamsService);
    // config = TestBed.inject(CartConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCartStateFromBrowserStorage', () => {
    it('should return the state from the browser storage', () => {
      spyOn(siteContextParamsService, 'getValue').and.returnValue(mockBaseSite);
      spyOn(statePersistenceService, 'readStateFromStorage').and.returnValue(
        mockBrowserCartState
      );
      const result = service.getCartStateFromBrowserStorage();
      expect(result).toBe(mockBrowserCartState);
    });
  });

  describe('createEventFromStorage', () => {
    it('should create an event from the browser storage state.', () => {
      spyOn(service, 'getCartStateFromBrowserStorage').and.returnValue(
        mockBrowserCartState
      );
      const result = service.createEventFromStorage();
      expect(result).toEqual(mockCartPersistentStorageChangeEvent);
    });
  });
});