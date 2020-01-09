import { NgModule } from '@angular/core';
import { OrderCancellationModule } from './amend-order/cancellations/order-cancellation.module';
import { OrderReturnModule } from './amend-order/returns/order-return.module';
import { OrderDetailsModule } from './order-details/order-details.module';
import { OrderHistoryModule } from './order-history/order-history.module';
import { ReturnRequestDetailModule } from './return-request-detail/return-request-detail.module';
import { ReturnRequestListModule } from './return-request-list/order-return-request-list.module';

@NgModule({
  imports: [
    OrderHistoryModule,
    OrderDetailsModule,
    OrderCancellationModule,
    OrderReturnModule,
    ReturnRequestListModule,
    ReturnRequestDetailModule,
  ],
})
export class OrderModule {}
