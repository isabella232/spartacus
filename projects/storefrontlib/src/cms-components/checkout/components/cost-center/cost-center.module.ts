import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, ConfigModule, I18nModule } from '@spartacus/core';
import { CartNotEmptyGuard } from '../../../cart';
import { CheckoutAuthGuard } from '../../guards';
import { CostCenterComponent } from './cost-center.component';

/**
 * @deprecated since 4.0, use checkout feature lib instead.
 */
@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutCostCenterComponent: {
          component: CostCenterComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [CostCenterComponent],
})
export class CostCenterModule {}
