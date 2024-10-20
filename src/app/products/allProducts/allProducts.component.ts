import { Component } from '@angular/core';
import { Product } from '../product.model';
import { ProductComponent } from '../product/product.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProductsService } from '../products.service';
import { ProductsFilterComponent } from './filter/products-filter.component';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-all-products',
  standalone: true,
  templateUrl: './allProducts.component.html',
  styleUrl: './allProducts.component.scss',
  imports: [ProductComponent, ScrollingModule, ProductsFilterComponent]
})
export class AllProductsComponent {
  public products: Product[] = [];
  public inputFilter: string = '';

  constructor(private productsService: ProductsService, private route: ActivatedRoute) {
    // this.getAllProducts();
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      if (params['filter']) {
        this.routerHandler(params);
      } else {
        this.getAllProducts();
      }
    });
  }


  public getAllProducts(): void {
    this.productsService.getAllProducts().subscribe((products: Product[]) => {
      this.products = products;
      console.log('products ===>>> ', products);
    });
  }

  private routerHandler(params: Params): void {
    if (params['filter'] === 'all') {
      this.getAllProducts();
    } else if (params['filter'] === 'preschool' || params['filter'] === 'playschool' || params['filter'] === 'primaryschool') {
      this.inputFilter = params['filter'];
      this.productsService.applyProductFilter({ age: [params['filter']] }).subscribe((products: Product[]) => {
        this.products = products;
      });
    } else if (params['filter'] === 'category') {
      this.productsService.getProductsByCategory(params['value']).subscribe((products: Product[]) => {
        this.products = products;
      });
    } else if (params['filter'] === 'membershipType') {
      this.productsService.getProductsByMembershipType(params['value']).subscribe((products: Product[]) => {
        this.products = products;
      });
    } else if (params['filter'] === 'search') {
      this.productsService.getProductBySearchKey(params['value']).subscribe((products: Product[]) => {
        this.products = products;
      });
    }
  }
}
