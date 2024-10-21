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
    // filter all
    // filter age
    // filter category
    // filter price
    // filter search
    if (params['filter'] === 'all') {
      this.getAllProducts();
    } else if (params['filter'] === 'preschool' || params['filter'] === 'playschool' || params['filter'] === 'primaryschool') {
      this.inputFilter = params['filter'];
      this.productsService.applyProductFilter({ age: [params['filter']] }).subscribe((products: Product[]) => {
        this.products = products;
      });
    } else if (!!this.productsService.getCategories().find(category => category.code === params['filter'])) {
      this.inputFilter = params['filter'];
      this.productsService.applyProductFilter({ category: [params['filter']] }).subscribe((products: Product[]) => {
        this.products = products;
      });
    } else if (params['filter'] === 'copper' || params['filter'] === 'silver' || params['filter'] === 'gold' || params['filter'] === 'platinum' || params['filter'] === 'platinumbig') {
      this.inputFilter = params['filter'];
      let input = '';
      if (params['filter'] === 'copper') {
        input = '0-100';
      } else if (params['filter'] === 'silver') {
        input = '100-200';
      } else if (params['filter'] === 'gold') {
        input = '200-300';
      } else if (params['filter'] === 'platinum') {
        input = '300-400';
      } else if (params['filter'] === 'platinumbig') {
        input = '400';
      }
      this.productsService.applyProductFilter({ price: [input] }).subscribe((products: Product[]) => {
        this.products = products;
      });
    } else {
      this.productsService.applyProductFilter({ searchKey: [params['filter']] }).subscribe((products: Product[]) => {
        this.products = products;
      });
    }
  }
}
