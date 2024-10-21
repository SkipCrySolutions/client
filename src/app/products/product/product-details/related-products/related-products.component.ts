import { Component, Input, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ProductsService } from "../../../products.service";

@Component({
  standalone: true,
  selector: 'app-related-products',
  templateUrl: 'related-products.component.html',
  imports: [RouterModule]
})
export class RelatedProductsComponent implements OnInit {
  @Input()
  public product: any;
  public products: any[] = [];

  constructor(private productService: ProductsService, private router: Router) { }

  public ngOnInit(): void {
    this.productService.applyProductFilter({ category: this.product.Category }).subscribe((products) => {
      this.products = products.filter((product: any) => product.Code !== this.product.Code);
    });
  }

  public loadProduct(product: any) {
    this.router.navigate(['productDetails', product.Code]);
  }
}
