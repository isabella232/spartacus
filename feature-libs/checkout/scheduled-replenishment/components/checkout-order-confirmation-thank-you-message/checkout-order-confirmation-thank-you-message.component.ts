import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CheckoutOrderConfirmationThankYouMessageComponent } from '@spartacus/checkout/base/components';
import { CheckoutFacade } from '@spartacus/checkout/base/root';
import { ORDER_TYPE } from '@spartacus/checkout/scheduled-replenishment/root';
import { GlobalMessageService, TranslationService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutReplenishmentFormService } from '../services/checkout-replenishment-form.service';

@Component({
  selector: 'cx-order-confirmation-thank-you-message',
  templateUrl: './checkout-order-confirmation-thank-you-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutScheduledReplenishmentOrderConfirmationThankYouMessageComponent
  extends CheckoutOrderConfirmationThankYouMessageComponent
  implements OnInit, OnDestroy
{
  isReplenishmentOrderType$: Observable<boolean>;

  constructor(
    protected checkoutFacade: CheckoutFacade,
    protected globalMessageService: GlobalMessageService,
    protected translationService: TranslationService,
    protected elRef: ElementRef,
    protected checkoutReplenishmentFormService: CheckoutReplenishmentFormService
  ) {
    super(checkoutFacade, globalMessageService, translationService, elRef);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.isReplenishmentOrderType$ = this.checkoutReplenishmentFormService
      .getOrderType()
      .pipe(
        map(
          (orderType) => ORDER_TYPE.SCHEDULE_REPLENISHMENT_ORDER === orderType
        )
      );
  }
}
