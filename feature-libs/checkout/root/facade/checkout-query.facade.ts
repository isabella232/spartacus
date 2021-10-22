import { Injectable } from '@angular/core';
import { facadeFactory, QueryState } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CHECKOUT_CORE_FEATURE } from '../feature-name';
import { CheckoutState } from '../model/checkout-state.model';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: CheckoutQueryFacade,
      feature: CHECKOUT_CORE_FEATURE,
      methods: ['getCheckoutDetails', 'getCheckoutDetailsState'],
    }),
})
export abstract class CheckoutQueryFacade {
  abstract getCheckoutDetails(): Observable<CheckoutState | undefined>;

  abstract getCheckoutDetailsState(): Observable<QueryState<CheckoutState>>;
}