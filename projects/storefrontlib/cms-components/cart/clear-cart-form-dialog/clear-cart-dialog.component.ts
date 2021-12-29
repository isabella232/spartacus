import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Cart,
  EventService,
  GlobalMessageService,
  GlobalMessageType,
  ActiveCartService,
} from '@spartacus/core';
import { ICON_TYPE } from '../../misc/icon/icon.model';
import { LaunchDialogService } from '../../../layout/launch-dialog/services/launch-dialog.service';
import { Subscription } from 'rxjs';

export interface SavedCartFormDialogOptions {
  cart: Cart;
  layoutOption?: string;
}

@Component({
  selector: 'cx-clear-cart-dialog',
  templateUrl: './clear-cart-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearCartDialogComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  iconTypes = ICON_TYPE;
  cart: Cart;
  layoutOption: string | undefined;

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    // Close on click outside the dialog window
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.close('Cross click');
    }
  }

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected el: ElementRef,
    protected eventService: EventService,
    protected globalMessageService: GlobalMessageService,
    protected activeCartService: ActiveCartService
  ) {}

  ngOnInit(): void {}

  clear(): void | boolean {
    this.activeCartService.clearActiveCart();
    this.globalMessageService.add(
      { key: 'clearCart.cartClearedSuccessfully' },
      GlobalMessageType.MSG_TYPE_CONFIRMATION
    );
  }

  close(reason: string): void {
    this.launchDialogService.closeDialog(reason);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.close('close dialog');
  }
}
