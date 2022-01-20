import { addProduct } from '../../helpers/accessibility/tabbing-order';
import { tabbingOrderConfig as config } from '../../helpers/accessibility/tabbing-order.config';
import { addToCartTabbingOrder } from '../../helpers/accessibility/tabbing-order/add-to-cart';
import {
  asmTabbingOrderNoSelectedUser,
  asmTabbingOrderNotLoggedIn,
  asmTabbingOrderWithSelectedUser,
} from '../../helpers/accessibility/tabbing-order/asm';
import {
  checkoutAppliedCouponsTabbingOrder,
  checkoutCouponsTabbingOrder,
} from '../../helpers/accessibility/tabbing-order/checkout/coupons';
import { checkoutDeliveryModeTabbingOrder } from '../../helpers/accessibility/tabbing-order/checkout/delivery-mode';
import {
  checkoutBillingAddressTabbingOrder,
  checkoutPaymentDetailsTabbingOrder,
} from '../../helpers/accessibility/tabbing-order/checkout/payment-details';
import { checkoutReviewOrderTabbingOrder } from '../../helpers/accessibility/tabbing-order/checkout/review-order';
import {
  checkoutShippingAddressExistingTabbingOrder,
  checkoutShippingAddressNewTabbingOrder,
} from '../../helpers/accessibility/tabbing-order/checkout/shipping-address';
import {
  consignmentTrackingEventsTabbingOrder,
  consignmentTrackingTabbingOrder,
} from '../../helpers/accessibility/tabbing-order/consignment-tracking';
import {
  addressBookDirectoryTabbingOrder,
  addressBookFormTabbingOrder,
  setupForAddressBookTests,
} from '../../helpers/accessibility/tabbing-order/my-account/address-book';
import { closeAccountTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/close-account';
import { consentManagementTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/consent-management';
import { checkoutMyCouponsTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/my-coupons';
import { myInterestTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/my-interests';
import { notificationPreferenceTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/notification-preference';
import { orderDetailsTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/order-details';
import {
  orderHistoryNoOrdersTabbingOrder,
  orderHistoryWithOrdersTabbingOrder,
} from '../../helpers/accessibility/tabbing-order/my-account/order-history';
import { paymentDetailsTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/payment-details';
import { personalDetailsTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/personal-details';
import { updateEmailTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/update-email';
import { wishlistTabbingOrder } from '../../helpers/accessibility/tabbing-order/my-account/wishlist';
import {
  productListTabbingOrderDesktop,
  productListTabbingOrderMobile,
  productListTabbingOrderMobileFilters,
  toggleProductView,
} from '../../helpers/accessibility/tabbing-order/product-list';
import { saveForLaterTabbingOrder } from '../../helpers/accessibility/tabbing-order/save-for-later';
import {
  stockNotificationDialogTabbingOrder,
  stockNotificationNotLoginTabbingOrder,
  stockNotificationTabbingOrderNotificationsAllowed,
  stockNotificationTabbingOrderNotificationsNotAllowed,
  stockNotificationTabbingOrderProductSubscribed,
} from '../../helpers/accessibility/tabbing-order/stock-notification';
import { countriesListTabbingOrder } from '../../helpers/accessibility/tabbing-order/store-finder/countries-list';
import { defaultViewTabbingOrder } from '../../helpers/accessibility/tabbing-order/store-finder/default-view';
import { searchResultsTabbingOrder } from '../../helpers/accessibility/tabbing-order/store-finder/search-results';
import { storeDetailsTabbingOrder } from '../../helpers/accessibility/tabbing-order/store-finder/store-details';
import { storesListTabbingOrder } from '../../helpers/accessibility/tabbing-order/store-finder/stores-list';

describe("Tabbing order - tests don't require user to be logged in", () => {
  before(() => {
    cy.window().then((win) => win.sessionStorage.clear());
  });

  context('Product List', () => {
    it('should allow to navigate with tab key (desktop - list view)', () => {
      productListTabbingOrderDesktop(config.productListDesktop);
    });

    it('should allow to navigate with tab key (desktop - grid view)', () => {
      toggleProductView(); // switch to grid view
      productListTabbingOrderDesktop(config.productListDesktop);
      toggleProductView(); // reset to default (list view)
    });

    it('should allow to navigate with tab key (mobile)', () => {
      productListTabbingOrderMobile(config.productListMobile);
    });

    it('should allow to navigate with tab key (mobile filters)', () => {
      productListTabbingOrderMobileFilters(config.productListMobileFilters);
    });
  });

  context('Add to cart', () => {
    it('should allow to navigate with tab key', () => {
      addToCartTabbingOrder(config.addToCart);
    });
  });

  context('Store finder', () => {
    context('Default view', () => {
      it('should allow to navigate with tab key', () => {
        defaultViewTabbingOrder(config.storeFinder);
      });
    });

    context('Search results page', () => {
      it('should allow to navigate with tab key', () => {
        searchResultsTabbingOrder(config.storeFinderSearchResults);
      });
    });

    context('Store details page', () => {
      it('should allow to navigate with tab key', () => {
        storeDetailsTabbingOrder(config.storeFinderStoreDetails);
      });
    });

    context('Countries list', () => {
      it('should allow to navigate with tab key', () => {
        countriesListTabbingOrder(config.storeFinderCountriesList);
      });
    });

    context('Stores list', () => {
      it('should allow to navigate with tab key', () => {
        storesListTabbingOrder(config.storeFinderStoresList);
      });
    });
  });

  context('Stock Notification', () => {
    it('should allow to navigate with tab key (not login)', () => {
      stockNotificationNotLoginTabbingOrder(config.stockNotificationNotLogin);
    });
  });

  // TODO: Fix helpers and renable
  // context('ASM', () => {
  //   it('should allow to navigate with tab key (not logged in)', () => {
  //     asmTabbingOrderNotLoggedIn(config.asmNotLoggedIn);
  //   });

  //   it('should allow to navigate with tab key (no user selected)', () => {
  //     asmTabbingOrderNoSelectedUser(config.asmNoSelectedUser);
  //   });

  //   it('should allow to navigate with tab key (with user selected)', () => {
  //     asmTabbingOrderWithSelectedUser(config.asmWithSelectedUser);
  //   });
  // });
});

describe('Tabbing order - tests do require user to be logged in', () => {
  before(() => {
    cy.requireLoggedIn();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  describe('Checkout', () => {
    before(() => {
      cy.restoreLocalStorage();
      addProduct();
      cy.findAllByText(/Proceed to checkout/i)
        .first()
        .click(); // move to checkout
      cy.get('cx-breadcrumb').should('contain', 'Checkout'); // check if we begin checkout tests in checkout
      cy.saveLocalStorage();
    });

    context('Shipping address', () => {
      it('should allow to navigate with tab key (add address)', () => {
        checkoutShippingAddressNewTabbingOrder(config.shippingAddressNew);
      });

      it('should allow to navigate with tab key (choose existing)', () => {
        checkoutShippingAddressExistingTabbingOrder(
          config.shippingAddressExisting
        );
      });
    });

    context('Delivery mode', () => {
      it('should allow to navigate with tab key', () => {
        checkoutDeliveryModeTabbingOrder(config.deliveryMode);
      });
    });

    context('Payment details', () => {
      it('should allow to navigate with tab key (card)', () => {
        checkoutPaymentDetailsTabbingOrder(config.paymentDetailsCard);
      });

      it('should allow to navigate with tab key (billing address)', () => {
        checkoutBillingAddressTabbingOrder(config.paymentDetailsBillingAddress);
      });
    });

    context('Review order', () => {
      it('should allow to navigate with tab key', () => {
        checkoutReviewOrderTabbingOrder(config.checkoutReviewOrder);
      });
    });
  });

  context('Order History', () => {
    it('should allow to navigate with tab key (no orders)', () => {
      orderHistoryNoOrdersTabbingOrder(config.orderHistoryNoOrders);
    });

    it('should allow to navigate with tab key (with orders)', () => {
      cy.window().then((win) => win.sessionStorage.clear());
      cy.requireLoggedIn();
      orderHistoryWithOrdersTabbingOrder();
    });
  });

  context('Notification preference', () => {
    it('should allow to navigate with tab key', () => {
      notificationPreferenceTabbingOrder(config.notificationPreference);
    });
  });

  context('Personal details', () => {
    it('should allow to navigate with tab key', () => {
      personalDetailsTabbingOrder(config.personalDetails);
    });
  });

  context('Update email', () => {
    it('should allow to navigate with tab key', () => {
      updateEmailTabbingOrder(config.updateEmail);
    });
  });

  context('Close account', () => {
    it('should allow to navigate with tab key', () => {
      closeAccountTabbingOrder(config.closeAccount);
    });
  });

  context('Consent Management', () => {
    it('should allow to navigate with tab key', () => {
      consentManagementTabbingOrder(config.consentManagement);
    });
  });

  context('Address Book (Form)', () => {
    it('should allow to navigate with tab key (Directory)', () => {
      setupForAddressBookTests();
      addressBookDirectoryTabbingOrder();
    });

    it('should allow to navigate with tab key (Form)', () => {
      addressBookFormTabbingOrder(config.addressBookForm);
    });
  });

  context('Payment Details', () => {
    it('should allow to navigate with tab key', () => {
      paymentDetailsTabbingOrder(config.paymentDetails);
    });
  });

  context('Order Details', () => {
    it('should allow to navigate with tab key', () => {
      orderDetailsTabbingOrder(config.orderDetails);
    });
  });

  context('Wishlist', () => {
    it('should allow to navigate with tab key', () => {
      wishlistTabbingOrder(config.wishlist);
    });
  });

  context('Save for later', () => {
    it('should allow to navigate with tab key', () => {
      saveForLaterTabbingOrder(config.saveForLater);
    });
  });

  context.skip('My Interest', () => {
    it('should allow to navigate with tab key', () => {
      myInterestTabbingOrder(config.myInterests);
    });
  });

  context('Coupons', () => {
    it('should allow to navigate with tab key', () => {
      checkoutCouponsTabbingOrder(config.coupons);
    });

    it('should allow to navigate with tab key (applied coupons)', () => {
      checkoutAppliedCouponsTabbingOrder(config.appliedCoupons);
    });
  });

  context.skip('My-coupons', () => {
    it('should allow to navigate with tab key', () => {
      checkoutMyCouponsTabbingOrder(config.myCoupons);
    });
  });

  context('Stock Notification', () => {
    it('should allow to navigate with tab key (notification preference NOT allowed)', () => {
      stockNotificationTabbingOrderNotificationsNotAllowed(
        config.stockNotificationPreferenceNotAllowed
      );
    });

    it('should allow to navigate with tab key (notification preference allowed)', () => {
      stockNotificationTabbingOrderNotificationsAllowed(
        config.stockNotificationPreferenceAllowed
      );
    });

    it.skip('should allow to navigate with tab key (dialog)', () => {
      stockNotificationDialogTabbingOrder(config.stockNotificationDialog);
    });

    it.skip('should allow to navigate with tab key (product subscribed)', () => {
      stockNotificationTabbingOrderProductSubscribed(
        config.stockNotificationSubscribed
      );
    });
  });

  context('Consignment Tracking', () => {
    it('should allow to navigate with tab key', () => {
      consignmentTrackingTabbingOrder(config.consignmentTracking);
    });

    it('should allow to navigate with tab key(tracking events)', () => {
      consignmentTrackingEventsTabbingOrder(config.consignmentTrackingEvents);
    });
  });
});