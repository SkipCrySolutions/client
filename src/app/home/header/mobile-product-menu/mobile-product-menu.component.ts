import { Component, EventEmitter, Output } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { ProductsService } from "../../../products/products.service";

@Component({
  selector: 'app-mobile-product-menu',
  standalone: true,
  templateUrl: 'mobile-product-menu.component.html',
  imports: [RouterModule]
})
export class MobileProductMenuComponent {

  public firstCategories: any[] = [];
  public secondCategories: any[] = [];
  public thirdCategories: any[] = [];
  public fourthCategories: any[] = [];
  public fifthCategories: any[] = [];


  @Output()
  public closeDrawerEvent: EventEmitter<any> = new EventEmitter();

  constructor(private productService: ProductsService, private router: Router) {
    this.firstCategories = this.productService.getCategories().slice(0, 5);
    this.secondCategories = this.productService.getCategories().slice(5, 10);
    this.thirdCategories = this.productService.getCategories().slice(10, 15);
    this.fourthCategories = this.productService.getCategories().slice(15, 20);
    this.fifthCategories = this.productService.getCategories().slice(20, 25);
  }

  public closeDrawer() {
    this.closeDrawerEvent.emit(true);
  }

  public navigateToProductsByAge(ageType: string): void {
    console.log('Navigating to age:', ageType);
    this.router.navigate(['/products', ageType]).then(() => {
      this.closeDrawer();
    });
  }

  public navigateToProductsByCategory(category: string): void {
    console.log('Navigating to category:', category);
    this.router.navigate(['/products', category]).then(() => {
      this.closeDrawer();
    });
  }
}
