import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartSharedModule } from '@spartacus/cart/main/components';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import {
  CardModule,
  IconModule,
  PromotionsModule,
} from '@spartacus/storefront';
import { CartNotEmptyGuard } from '../guards/cart-not-empty.guard';
import { CheckoutAuthGuard } from '../guards/checkout-auth.guard';
import { CheckoutReviewSubmitComponent } from './checkout-review-submit.component';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    CartSharedModule,
    I18nModule,
    UrlModule,
    RouterModule,
    PromotionsModule,
    IconModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutReviewOrder: {
          component: CheckoutReviewSubmitComponent,
          // TODO(#8880): Shouldn't we keep ShippingAddressSetGuard and others here?
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [CheckoutReviewSubmitComponent],
  exports: [CheckoutReviewSubmitComponent],
})
export class CheckoutReviewSubmitModule {}