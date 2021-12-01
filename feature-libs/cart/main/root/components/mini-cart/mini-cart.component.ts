import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { MiniCartComponentService } from './mini-cart-component.service';

@Component({
  selector: 'cx-mini-cart',
  templateUrl: './mini-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCartComponent {
  iconTypes = ICON_TYPE;

  quantity$: Observable<number>;

  total$: Observable<string>;

  constructor(protected miniCartComponentService: MiniCartComponentService) {
    this.quantity$ = this.miniCartComponentService.getQuantity();
    this.total$ = this.miniCartComponentService.getTotalPrice();
  }
}