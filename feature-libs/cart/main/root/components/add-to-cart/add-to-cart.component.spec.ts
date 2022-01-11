import {
  AbstractType,
  Component,
  DebugElement,
  InjectionToken,
  Input,
  Type,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  TestBedStatic,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  CmsAddToCartComponent,
  CxEvent,
  EventService,
  FacadeFactoryService,
  I18nTestingModule,
  Product,
} from '@spartacus/core';
import {
  CmsComponentData,
  CurrentProductService,
  ProductListItemContext,
  SpinnerModule,
} from '@spartacus/storefront';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ActiveCartFacade } from '../../facade/active-cart.facade';
import { Cart, OrderEntry } from '../../models/cart.model';
import { AddToCartComponent } from './add-to-cart.component';

const config$ = new BehaviorSubject<CmsAddToCartComponent>({
  inventoryDisplay: false,
});

const toggleInventoryDisplay = <CmsComponentData<any>>{
  data$: config$.asObservable(),
};

const productCode = '1234';

const mockProduct: Product = {
  name: 'mockProduct',
  code: 'code1',
  stock: {
    stockLevel: 333,
    stockLevelStatus: 'inStock',
  },
};

const mockProduct2: Product = {
  name: 'mockProduct2',
  code: 'code2',
  stock: { stockLevelStatus: 'inStock' },
};

const mockProduct3: Product = {
  name: 'mockProduct',
  code: 'code1',
  stock: {
    isValueRounded: true,
    stockLevel: 10,
    stockLevelStatus: 'inStock',
  },
};

const mockNoStockProduct: Product = {
  name: 'mockProduct',
  code: 'code1',
  stock: { stockLevel: 0, stockLevelStatus: 'outOfStock' },
};

class MockProductListItemContext implements Partial<ProductListItemContext> {
  product$ = of(mockProduct);
}

class MockActiveCartService {
  addEntry(_productCode: string, _quantity: number): void {}
  getEntry(_productCode: string): Observable<OrderEntry> {
    return of();
  }
  isStable(): Observable<boolean> {
    return of();
  }
  getActive(): Observable<Cart> {
    return of();
  }
  getEntries(): Observable<OrderEntry[]> {
    return of([]);
  }
  getLastEntry(_productCode: string): Observable<OrderEntry> {
    return of();
  }
}

class MockCurrentProductService {
  getProduct(): Observable<Product> {
    return of();
  }
}

@Component({
  template: '',
  selector: 'cx-item-counter',
})
class MockItemCounterComponent {
  @Input() min;
  @Input() max;
  @Input() step;
  @Input() control;
}

const mockEventStream$ = new BehaviorSubject<CxEvent>({});

class MockFacadeFactoryService implements Partial<FacadeFactoryService> {
  isFacadeImplProvided<T>(
    _token: Type<T> | InjectionToken<T> | AbstractType<T>
  ): Observable<boolean> {
    return of(true);
  }

  get(): Observable<any> {
    return mockEventStream$.asObservable();
  }
}

describe('AddToCartComponent', () => {
  let addToCartComponent: AddToCartComponent;
  let fixture: ComponentFixture<AddToCartComponent>;
  let activeCartFacade: ActiveCartFacade;
  let currentProductService: CurrentProductService;
  let el: DebugElement;
  let eventService: EventService;

  const mockCartEntry: OrderEntry = { entryNumber: 7 };

  function configureTestingModule(): TestBedStatic {
    return TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        SpinnerModule,
        I18nTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [AddToCartComponent, MockItemCounterComponent],
      providers: [
        { provide: ActiveCartFacade, useClass: MockActiveCartService },
        {
          provide: CurrentProductService,
          useClass: MockCurrentProductService,
        },
        {
          provide: CmsComponentData,
          useValue: toggleInventoryDisplay,
        },
        {
          provide: ProductListItemContext,
          useValue: undefined,
        },
        { provide: FacadeFactoryService, useClass: MockFacadeFactoryService },
      ],
    });
  }

  function stubSeviceAndCreateComponent() {
    fixture = TestBed.createComponent(AddToCartComponent);
    addToCartComponent = fixture.componentInstance;
    activeCartFacade = TestBed.inject(ActiveCartFacade);
    currentProductService = TestBed.inject(CurrentProductService);
    el = fixture.debugElement;
    eventService = TestBed.inject(EventService);

    config$.next({
      inventoryDisplay: false,
    });

    fixture.detectChanges();
  }

  describe('without ProductListItemContext', () => {
    beforeEach(() => {
      configureTestingModule();
      stubSeviceAndCreateComponent();
    });

    it('should be created', () => {
      expect(addToCartComponent).toBeTruthy();
    });

    describe('Product code provided', () => {
      it('should call ngOnInit()', () => {
        addToCartComponent.productCode = productCode;
        addToCartComponent.ngOnInit();
        expect(addToCartComponent.hasStock).toBe(true);
        expect(addToCartComponent.quantity).toBe(1);
      });

      it('should load entry by product code from currentProductService', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockProduct)
        );
        addToCartComponent.ngOnInit();
        expect(addToCartComponent.productCode).toEqual(mockProduct.code);
        expect(addToCartComponent.maxQuantity).toEqual(
          mockProduct.stock.stockLevel
        );
        expect(addToCartComponent.hasStock).toEqual(true);
      });

      it('should not have stock based on current product', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of({
            stock: { stockLevelStatus: 'outOfStock' },
          })
        );
        addToCartComponent.ngOnInit();
        expect(addToCartComponent.hasStock).toEqual(false);
      });

      it('(not supported anymore) should always have stock based when productcode is passed', () => {
        addToCartComponent.productCode = '123';
        addToCartComponent.ngOnInit();
        expect(addToCartComponent.hasStock).toEqual(true);
      });
    });

    describe('Product from page', () => {
      it('should reset counter value when changing product', () => {
        const currentProduct = new BehaviorSubject<Product>(mockProduct);

        //Product 1
        spyOn(currentProductService, 'getProduct').and.returnValue(
          currentProduct
        );
        addToCartComponent.ngOnInit();
        expect(addToCartComponent.productCode).toEqual(mockProduct.code);
        addToCartComponent.quantity = 5;

        //Product 2
        currentProduct.next(mockProduct2);
        expect(addToCartComponent.productCode).toEqual(mockProduct2.code);
        //Quantity is expected to be reset to 1 since it is a new product page
        expect(addToCartComponent.quantity).toEqual(1);
      });

      it('should disable input when the product has no stock', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockNoStockProduct)
        );
        addToCartComponent.ngOnInit();
        expect(addToCartComponent.productCode).toEqual(mockProduct.code);
        expect(addToCartComponent.maxQuantity).toBe(undefined);
        expect(addToCartComponent.hasStock).toEqual(false);
      });
    });

    it('should call addToCart()', () => {
      addToCartComponent.productCode = productCode;
      addToCartComponent.ngOnInit();
      spyOn(activeCartFacade, 'addEntry').and.callThrough();
      spyOn(activeCartFacade, 'getEntries').and.returnValue(
        of([mockCartEntry])
      );
      spyOn(activeCartFacade, 'isStable').and.returnValue(of(true));
      addToCartComponent.quantity = 1;

      addToCartComponent.addToCart();
      expect(activeCartFacade.addEntry).toHaveBeenCalledWith(productCode, 1);
    });

    describe('addToCart ', () => {
      const mockProductCode = 'pcode';
      it('should return if item qty is 0', () => {
        addToCartComponent.addToCartForm.get('quantity')?.setValue(0);
        addToCartComponent.productCode = mockProductCode;
        spyOn(activeCartFacade, 'addEntry').and.stub();
        addToCartComponent.addToCart();
        expect(activeCartFacade.addEntry).not.toHaveBeenCalled();
      });
      it('should add item to cart via ActiveCartFacade', () => {
        addToCartComponent.addToCartForm.get('quantity')?.setValue(1);
        addToCartComponent.productCode = mockProductCode;
        spyOn(activeCartFacade, 'addEntry').and.stub();
        addToCartComponent.addToCart();
        expect(activeCartFacade.addEntry).toHaveBeenCalledWith(
          mockProductCode,
          1
        );
      });
      it('should dispatch the add to cart UI event', () => {
        addToCartComponent.addToCartForm.get('quantity')?.setValue(1);
        addToCartComponent.productCode = mockProductCode;
        spyOn(eventService, 'dispatch').and.stub();
        addToCartComponent.addToCart();
        expect(eventService.dispatch).toHaveBeenCalled();
      });
    });

    describe('UI', () => {
      it('should show addToCart button with productCode input', () => {
        addToCartComponent.productCode = productCode;
        addToCartComponent.ngOnInit();
        fixture.detectChanges();
        expect(el.query(By.css('button')).nativeElement).toBeDefined();
      });

      it('should hide addToCart button with productCode input', () => {
        addToCartComponent.productCode = null;
        addToCartComponent.ngOnInit();
        fixture.detectChanges();
        expect(el.query(By.css('button'))).toBeNull();
      });

      it('should show the addToCart button for currentProduct', () => {
        addToCartComponent.productCode = null;
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockProduct)
        );
        addToCartComponent.ngOnInit();
        fixture.detectChanges();
        expect(el.query(By.css('button')).nativeElement).toBeDefined();
      });

      it('should hide the addToCart button for currentProduct', () => {
        addToCartComponent.productCode = null;
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockNoStockProduct)
        );
        addToCartComponent.ngOnInit();
        fixture.detectChanges();
        expect(el.query(By.css('button'))).toBeNull();
      });
    });

    it('should hide quantity if showQuantity is set to false', () => {
      addToCartComponent.showQuantity = false;
      fixture.detectChanges();
      const quantityEl = el.query(By.css('.quantity'));
      expect(quantityEl).toBeNull();
    });

    describe('Inventory Display test', () => {
      it('should display inventory quantity when enabled', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockProduct)
        );

        config$.next({
          inventoryDisplay: true,
        });

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        expect(
          el.query(By.css('.info')).nativeElement.innerText.trim()
        ).toEqual(mockProduct.stock?.stockLevel + ' addToCart.inStock');
      });

      it('should NOT display inventory when disabled', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockProduct)
        );

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        expect(
          el.query(By.css('.info')).nativeElement.innerText.trim()
        ).toEqual('addToCart.inStock');
      });

      it('should display out of stock inventory when enabled and out of stock', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockNoStockProduct)
        );

        config$.next({
          inventoryDisplay: true,
        });

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        expect(
          el.query(By.css('.info')).nativeElement.innerText.trim()
        ).toEqual('addToCart.outOfStock');
      });

      it('should display out of stock when inventory display disabled', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockNoStockProduct)
        );

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        expect(
          el.query(By.css('.info')).nativeElement.innerText.trim()
        ).toEqual('addToCart.outOfStock');
      });

      it('should display `In Stock` when product forced in stock status and inventory display enabled', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockProduct2)
        );

        config$.next({
          inventoryDisplay: true,
        });

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        expect(
          el.query(By.css('.info')).nativeElement.innerText.trim()
        ).toEqual('addToCart.inStock');
      });

      it('should display `+` when product stock level threshold applied when inventory display enabled', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockProduct3)
        );

        config$.next({
          inventoryDisplay: true,
        });

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        expect(
          el.query(By.css('.info')).nativeElement.innerText.trim()
        ).toEqual(mockProduct3.stock?.stockLevel + '+ addToCart.inStock');
      });

      it('should return max quantity as string in getInventory()', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockProduct)
        );

        config$.next({
          inventoryDisplay: true,
        });

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        const obtained: string = addToCartComponent.getInventory();
        expect(obtained).toEqual(mockProduct.stock?.stockLevel + '');
      });

      it('should return empty string in getInventory() when out of stock', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockNoStockProduct)
        );

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        const obtained: string = addToCartComponent.getInventory();
        expect(obtained).toEqual('');
      });

      it('should return empty string in getInventory() when force InStock', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockProduct2)
        );

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        const obtained: string = addToCartComponent.getInventory();
        expect(obtained).toEqual('');
      });

      it('should return threshold value with + in getInventory()', () => {
        spyOn(currentProductService, 'getProduct').and.returnValue(
          of(mockProduct3)
        );

        config$.next({
          inventoryDisplay: true,
        });

        addToCartComponent.ngOnInit();
        fixture.detectChanges();

        const obtained: string = addToCartComponent.getInventory();
        expect(obtained).toEqual(mockProduct3.stock?.stockLevel + '+');
      });
    });
  });

  describe('with ProductListItemContext', () => {
    it('should get product from ProductListItemContext', () => {
      configureTestingModule().overrideProvider(ProductListItemContext, {
        useValue: new MockProductListItemContext(),
      });
      TestBed.compileComponents();
      stubSeviceAndCreateComponent();

      spyOn(currentProductService, 'getProduct').and.returnValue(
        of(mockProduct)
      );
      addToCartComponent.productCode = undefined;
      addToCartComponent.ngOnInit();

      expect(currentProductService.getProduct).not.toHaveBeenCalled();
    });
  });
});