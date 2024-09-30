import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProductsService } from "../../../products.service";

@Component({
  selector: 'app-product-check',
  templateUrl: 'product-check.component.html',
  standalone: true
})
export class ProductAvailableCheckComponent implements OnInit {
  @Input() public product: any;

  @Output() public emitAddTocart: EventEmitter<any> = new EventEmitter();

  public isAvailable = false;

  private availableProduct: any;

  constructor(public productService: ProductsService) {

  }

  public ngOnInit(): void {
    this.productService.getProductByStoreAvailability(this.product.Code, this.product.StoreId).subscribe((availableProduct: any) => {
      this.isAvailable = !!availableProduct;
      this.availableProduct = availableProduct;
    });
  }

  public addToCart() {
    this.emitAddTocart.emit(this.availableProduct);
  }


}
