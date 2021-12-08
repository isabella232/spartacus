import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CheckoutFacade } from '@spartacus/checkout/base/root';
import { Order } from '@spartacus/order/root';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-order-confirmation-totals',
  templateUrl: './checkout-order-confirmation-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutOrderConfirmationTotalsComponent implements OnDestroy {
  order$: Observable<Order | undefined> = this.checkoutFacade.getOrder();

  constructor(protected checkoutFacade: CheckoutFacade) {}

  ngOnDestroy() {
    this.checkoutFacade.clearOrder();
  }
}