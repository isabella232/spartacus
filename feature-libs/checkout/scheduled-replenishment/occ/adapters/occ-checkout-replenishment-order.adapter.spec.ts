import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ScheduleReplenishmentForm } from '@spartacus/checkout/scheduled-replenishment/root';
import {
  ConverterService,
  HttpErrorModel,
  normalizeHttpError,
  OccConfig,
  OccEndpoints,
} from '@spartacus/core';
import {
  ReplenishmentOrder,
  REPLENISHMENT_ORDER_NORMALIZER,
} from '@spartacus/order/root';
import { defer, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { OccCheckoutReplenishmentOrderAdapter } from './occ-checkout-replenishment-order.adapter';

const cartId = 'testCart';
const termsChecked = true;
const userId = 'testUser';

const mockReplenishmentOrderFormData: ScheduleReplenishmentForm = {
  numberOfDays: 'test-number-days',
};

const mockReplenishmentOrder: ReplenishmentOrder = {
  active: true,
  purchaseOrderNumber: 'test-po',
  replenishmentOrderCode: 'test-repl-order',
  entries: [{ entryNumber: 0, product: { name: 'test-product' } }],
};

const MockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
      endpoints: {
        scheduleReplenishmentOrder:
          'orgUsers/${userId}/replenishmentOrders?fields=FULL,costCenter(FULL),purchaseOrderNumber,paymentType',
      } as OccEndpoints,
    },
  },
  context: {
    baseSite: [''],
  },
};

const mockJaloError = new HttpErrorResponse({
  error: {
    errors: [
      {
        message: 'The application has encountered an error',
        type: 'JaloObjectNoLongerValidError',
      },
    ],
  },
});
const mockNormalizedJaloError = normalizeHttpError(mockJaloError);

describe(`OccCheckoutReplenishmentOrderAdapter`, () => {
  let occAdapter: OccCheckoutReplenishmentOrderAdapter;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let converter: ConverterService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          OccCheckoutReplenishmentOrderAdapter,
          { provide: OccConfig, useValue: MockOccModuleConfig },
        ],
      });
    })
  );

  beforeEach(() => {
    occAdapter = TestBed.inject(OccCheckoutReplenishmentOrderAdapter);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    converter = TestBed.inject(ConverterService);

    spyOn(converter, 'pipeable').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe(`Schedule a replenishment order`, () => {
    it(`should schedule a replenishment order`, () => {
      occAdapter
        .scheduleReplenishmentOrder(
          cartId,
          mockReplenishmentOrderFormData,
          termsChecked,
          userId
        )
        .subscribe((data) => {
          expect(data).toEqual(mockReplenishmentOrder);
        });

      const mockReq = httpMock.expectOne((req) => {
        return (
          req.method === 'POST' &&
          req.url ===
            `orgUsers/${userId}/replenishmentOrders?fields=FULL%2CcostCenter(FULL)%2CpurchaseOrderNumber%2CpaymentType&cartId=${cartId}&termsChecked=${termsChecked}` &&
          req.body === mockReplenishmentOrderFormData
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(converter.pipeable).toHaveBeenCalledWith(
        REPLENISHMENT_ORDER_NORMALIZER
      );
      mockReq.flush(mockReplenishmentOrder);
    });
  });

  describe(`back-off`, () => {
    it(`should unsuccessfully backOff on Jalo error`, fakeAsync(() => {
      spyOn(httpClient, 'post').and.returnValue(throwError(mockJaloError));

      let result: HttpErrorModel | undefined;
      const subscription = occAdapter
        .scheduleReplenishmentOrder(
          cartId,
          mockReplenishmentOrderFormData,
          termsChecked,
          userId
        )
        .pipe(take(1))
        .subscribe({ error: (err) => (result = err) });

      tick(4200);

      expect(result).toEqual(mockNormalizedJaloError);

      subscription.unsubscribe();
    }));

    it(`should successfully backOff on Jalo error and recover after the 2nd retry`, fakeAsync(() => {
      let calledTimes = -1;

      spyOn(httpClient, 'post').and.returnValue(
        defer(() => {
          calledTimes++;
          if (calledTimes === 3) {
            return of(mockReplenishmentOrder);
          }
          return throwError(mockJaloError);
        })
      );

      let result: ReplenishmentOrder | undefined;
      const subscription = occAdapter
        .scheduleReplenishmentOrder(
          cartId,
          mockReplenishmentOrderFormData,
          termsChecked,
          userId
        )
        .pipe(take(1))
        .subscribe((res) => {
          result = res;
        });

      // 1*1*300 = 300
      tick(300);
      expect(result).toEqual(undefined);

      // 2*2*300 = 1200
      tick(1200);
      expect(result).toEqual(undefined);

      // 3*3*300 = 2700
      tick(2700);

      expect(result).toEqual(mockReplenishmentOrder);
      subscription.unsubscribe();
    }));
  });
});
