import { Component, Input } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { Router } from "@angular/router";

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  imports: [ButtonModule]
})
export class ProductComponent {
  @Input()
  public product: any = null;
  // public productAdded = false;

  constructor(
    private router: Router
  ) {
  }

  // public addCart(product: any) {
  //   console.log('user => ', this.appService.user);
  //   const request = {
  //     CustomerId: this.appService.user().CustomerId,
  //     Product: product
  //   }
  //   console.log('request => ', request);
  //   this.orderService.addToCart(request).subscribe(() => {
  //     this.orderService.cartCount.update(value => value + 1);
  //     this.productAdded = true;
  //   });
  // }

  public loadProductDetails(product: any) {
    console.log('loadProductDetails product => ', product);
    this.router.navigate(['productDetails', product.Code, product._id, product.StoreId]);
  }
}

