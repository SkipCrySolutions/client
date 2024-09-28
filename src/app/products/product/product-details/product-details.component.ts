import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../products.service';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../app.service';
import { OrderService } from '../../order.service';
import { LocalStorageService } from '../../../localStorage.service';
import { ProductGalleryComponent } from './gallery/product-gallery.component';
import { WishlistService } from './wishlist.service';
import { BlockPricePipe } from './blockProductPrice.pipe';
import { AppHelper } from '../../../utils/app.helper';
import { AddMoneyComponent } from '../../../profile/wallet/addMoney/addMoney.component';
import { BlockProductComponent } from './blockProduct/blockProduct.component';
import { RelatedProductsComponent } from './related-products/related-products.component';
import { ProductAvailableCheckComponent } from './availabilityCheck/product-check.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  imports: [
    FormsModule,
    GalleriaModule,
    ButtonModule,
    SelectButtonModule,
    RouterModule,
    ProductGalleryComponent,
    BlockPricePipe,
    AddMoneyComponent,
    BlockProductComponent,
    RelatedProductsComponent,
    ProductAvailableCheckComponent
  ],
})
export class ProductDetailsComponent implements OnInit {
  public productId: any;

  private productCode: string = '';

  public product: any = null;

  responsiveOptions: any[] | undefined;

  public stateOptions: any[] = [
    { label: '15 Days', value: '15d' },
    { label: '30 Days', value: '30d' },
  ];

  public daysValue = '30d';

  public productAdded = false;

  public rentedDays = '';
  public rentedAmount = 0;

  private localCart: any = [];

  public productInCart = false;

  public productAddedToWishlist = false;

  public canNotify = false;

  private wishlistId: string = '';

  public wallet: any;

  public canBlockToy = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    public appService: AppService,
    private orderService: OrderService,
    private router: Router,
    private local: LocalStorageService,
    private wishlistService: WishlistService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5,
      },
      {
        breakpoint: '768px',
        numVisible: 3,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
      },
    ];
  }

  public ngOnInit(): void {
    this.product = null;
    this.route.params.subscribe((params) => {
      this.productCode = params['Code'];
      this.productId = params['Id'];
      this.getProductByCode();
    });
  }

  public addToCart(product: any) {
    const request = {
      CustomerId: this.appService.user()
        ? this.appService.user().CustomerId
        : 'New',
      Product: product,
      rentedDays: this.rentedDays,
      rentedAmount: this.rentedAmount,
    };
    if (this.appService.user()) {
      this.orderService.addToCart(request).subscribe(() => {
        this.appService.cartCount.update((value) => value + 1);
        this.productAdded = true;
        this.productInCart = true;
      });
    } else {
      const cartItem: any = localStorage.getItem('scCart');
      if (cartItem) {
        this.localCart = [...JSON.parse(cartItem), request];
      } else {
        this.localCart = [...this.localCart, request];
      }
      this.appService.cartCount.update(() => this.localCart.length);
      localStorage.setItem('scCart', JSON.stringify(this.localCart));
      this.productAdded = true;
      this.productInCart = true;
    }
  }

  public setRentValue(daysValue: string, product: any) {
    this.rentedDays = daysValue === '15d' ? '15 days' : '30 days';
    this.rentedAmount = daysValue === '15d' ? product.rent15 : product.rent30;
  }

  public addToWishlist() {
    if (this.appService.user()) {
      this.wishlistService.addItemToWishlist(this.product).subscribe((res) => {
        this.productAddedToWishlist = true;
        this.wishlistId = res.result._id;
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  public removeFromWishlist() {
    if (this.appService.user()) {
      this.wishlistService
        .removeItemFromWishlist(this.wishlistId)
        .subscribe(() => {
          this.productAddedToWishlist = false;
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  public notifyAvailability(product: any) {
    console.log('product => ', product);
    if (this.appService.user()) {
      const req = {
        productId: product.Code,
        storeId: product.StoreId,
        customerId: this.appService.user().CustomerId,
        nextAvailable: product.NextAvailableBy
      }
      console.log('reee => ', req);
      this.wishlistService.addNotifyProduct(req).subscribe(() => {
        this.canNotify = true;
      }, () => {
        this.canNotify = false;
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  public share() {
    const textToShare =
      'Hello, I found this interesting toy on SkipCry Toy Library. Take a look ' +
      location.href;
    const text = encodeURIComponent('Check out this awesome link: ');
    const url = encodeURIComponent(
      'https://montymaestro.com/shop/2-4-yrs/marine-biological-cognition'
    );

    // Generate the WhatsApp sharing link
    const whatsappLink = `https://api.whatsapp.com/send?text=${url}`;
    window.open(whatsappLink);
  }

  private getProductByCode() {
    this.productService
      .getProductByCode(this.productCode, this.productId)
      .subscribe((product: any) => {
        this.product = product;
        console.log('getProductByCode product => ', product);
        this.setRentValue(this.daysValue, product);
        this.productInCart = this.local.checkIfProductInCart(product);
        console.log('productincart => ', this.productInCart);
        if (this.product.ShopQty === 0) {
          this.productService.getProductByStoreAvailability(this.product.Code).subscribe((availableProduct: any) => {
            // this.isAvailable = !!availableProduct;
            this.product = availableProduct;
            console.log('product from mother store => ', product);
          });
        }
      });
  }
}
