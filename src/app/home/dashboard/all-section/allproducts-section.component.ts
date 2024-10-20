import { Component } from '@angular/core';
import { Product } from '../../../products/product.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-allproducts-section',
  templateUrl: './allproducts-section.component.html',
  standalone: true,
  imports: [RouterModule]
})
export class AllProductsSectionComponent {

  public products: Product[] = [];

  constructor(private router: Router) { }
  navigateToProducts(): void {
    console.log('Navigating to all:');
    this.router.navigate(['/products', 'all']);
  }
}
