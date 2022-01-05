import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { IconModule } from '../../../misc/icon/icon.module';
import { ClearCartDialogComponent } from './clear-cart-dialog.component';
import { KeyboardFocusModule } from '../../../../layout/a11y/keyboard-focus/keyboard-focus.module';

@NgModule({
  imports: [CommonModule, I18nModule, IconModule, KeyboardFocusModule],
  declarations: [ClearCartDialogComponent],
  exports: [ClearCartDialogComponent],
})
export class ClearCartDialogModule {}
