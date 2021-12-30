import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  EventService,
  GlobalMessageService,
  GlobalMessageType,
  ActiveCartService,
  DeleteCartSuccessEvent,
} from '@spartacus/core';
import { ICON_TYPE } from '../../misc/icon/icon.model';
import { LaunchDialogService } from '../../../layout/launch-dialog/services/launch-dialog.service';
import { FocusConfig } from '../../../layout/a11y/keyboard-focus/keyboard-focus.model';
import { Subscription } from 'rxjs';
import { mapTo, take } from 'rxjs/operators';

@Component({
  selector: 'cx-clear-cart-dialog',
  templateUrl: './clear-cart-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearCartDialogComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  iconTypes = ICON_TYPE;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

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

  ngOnInit(): void {
    this.subscription.add(
      this.eventService
        .get(DeleteCartSuccessEvent)
        .pipe(take(1), mapTo(true))
        .subscribe((success) => this.onComplete(success))
    );
  }

  clear(): void {
    this.activeCartService.clearActiveCart();
  }

  onComplete(success: boolean): void {
    if (success) {
      this.globalMessageService.add(
        { key: 'clearCart.cartClearedSuccessfully' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    }
  }

  close(reason: string): void {
    this.launchDialogService.closeDialog(reason);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.close('close dialog');
  }
}
