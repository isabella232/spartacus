import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  backOff,
  ConverterService,
  InterceptorUtil,
  isJaloError,
  normalizeHttpError,
  Occ,
  OccEndpointsService,
  OCC_USER_ID_ANONYMOUS,
  USE_CLIENT_TOKEN,
} from '@spartacus/core';
import { UnnamedAdapter } from '@spartacus/order/core';
import { Order, ORDER_NORMALIZER } from '@spartacus/order/root';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class OccUnnamedAdapter implements UnnamedAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  public placeOrder(
    userId: string,
    cartId: string,
    termsChecked: boolean
  ): Observable<Order> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    console.log('1 occ place order');
    if (userId === OCC_USER_ID_ANONYMOUS) {
      console.log('2 anon occ place order');
      headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    }

    return this.http
      .post<Occ.Order>(
        this.getPlaceOrderEndpoint(userId, cartId, termsChecked.toString()),
        {},
        { headers }
      )
      .pipe(
        catchError((error) => throwError(normalizeHttpError(error))),
        backOff({
          shouldRetry: isJaloError,
        }),
        this.converter.pipeable(ORDER_NORMALIZER)
      );
  }

  protected getPlaceOrderEndpoint(
    userId: string,
    cartId: string,
    termsChecked: string
  ): string {
    return this.occEndpoints.buildUrl('placeOrder', {
      urlParams: { userId },
      queryParams: { cartId, termsChecked },
    });
  }
}