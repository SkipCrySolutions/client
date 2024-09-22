import { Component } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ProductsService } from "../../../products/products.service";
import { CarouselModule } from "primeng/carousel";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-new-arrival',
  standalone: true,
  templateUrl: 'newArrival.component.html',
  imports: [CardModule, ButtonModule, CarouselModule, RouterModule]
})
export class NewArrivalComponent {

  public products: any = [];
  responsiveOptions: any[] | undefined;
  constructor(private productsService: ProductsService) {
    this.getProducts();
    this.responsiveOptions = [
      {
        breakpoint: '1499px',
        numVisible: 6,
        numScroll: 3
      },
      {
        breakpoint: '1199px',
        numVisible: 4,
        numScroll: 2
      },
      {
        breakpoint: '991px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
      }
    ];
  }

  private getProducts(): void {
    this.productsService.getAllProducts().subscribe((resp: any) => {
      this.products = resp.filter((t: any) => t.Age === '4+').splice(0, 20);
    });
  }
}
