import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CheckoutFacade } from '@spartacus/checkout/base/root';
import { GlobalMessageService, GlobalMessageType, TranslationService } from '@spartacus/core';
import { Order } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { filter, take, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'cx-order-confirmation-thank-you-message',
  templateUrl: './checkout-order-confirmation-thank-you-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutOrderConfirmationThankYouMessageComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  order$: Observable<Order | undefined>;

  isGuestCustomer = false;
  orderGuid: string | undefined;

  constructor(
    protected checkoutFacade: CheckoutFacade,
    protected globalMessageService: GlobalMessageService,
    protected translationService: TranslationService,
    protected elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.order$ = this.checkoutFacade.getOrderDetails().pipe(
      tap((order) => {
        this.isGuestCustomer =
          order && 'guestCustomer' in order
            ? order.guestCustomer ?? false
            : false;
        this.orderGuid = order?.guid;
      })
    );
  }

  ngAfterViewInit(): void {
    const confirmationOfOrderMessage$ = this.translationService.translate(
      'checkoutOrderConfirmation.confirmationOfOrder'
    );
    const thankYouMessage$ = this.translationService.translate(
      'checkoutOrderConfirmation.thankYou'
    );
    const invoiceHasBeenSentByEmailMessage$ = this.translationService.translate(
      'checkoutOrderConfirmation.invoiceHasBeenSentByEmail'
    );

    const hostElement = this.elRef.nativeElement as HTMLElement;
    hostElement.setAttribute('aria-live', 'polite');
    hostElement.setAttribute('aria-atomic', 'true');
    console.log('HOST', hostElement);
    setTimeout(() => {
      console.log('HOST', hostElement);
      hostElement.click();
      console.log(document.activeElement);
    }, 1000);
    console.log(document.activeElement);

    this.order$
      .pipe(
        filter((order) => !!order),
        withLatestFrom(
          confirmationOfOrderMessage$,
          thankYouMessage$,
          invoiceHasBeenSentByEmailMessage$
        ),
        take(1)
      )
      .subscribe(
        ([
          order,
          confirmationOfOrderMessage,
          thankYouMessage,
          invoiceHasBeenSentByEmailMessage,
        ]) => {
          const message = `${confirmationOfOrderMessage}${order?.code}\n${thankYouMessage}\n${invoiceHasBeenSentByEmailMessage}`;
          this.globalMessageService.add(
            message,
            GlobalMessageType.MSG_TYPE_ASSISTIVE
          );
        }
      );
  }

  ngOnDestroy() {
    this.checkoutFacade.clearOrder();
  }
}
