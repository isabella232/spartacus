import { DIALOG_TYPE } from '../../../../layout/launch-dialog/config/launch-config';
import { LayoutConfig } from '../../../../layout/config/layout-config';
import { ClearCartDialogComponent } from './clear-cart-dialog.component';

export const defaultClearCartLayoutConfig: LayoutConfig = {
  launch: {
    CLEAR_CART: {
      inline: true,
      component: ClearCartDialogComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
