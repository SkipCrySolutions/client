import { Component, OnInit } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CarouselModule } from "primeng/carousel";
import { ProductsService } from "../../../products/products.service";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-category-section',
  standalone: true,
  templateUrl: 'categorySection.component.html',
  imports: [ButtonModule, CarouselModule, RouterModule]
})
export class CategorySectionComponent implements OnInit {
  responsiveOptions: any[] | undefined;
  constructor(private productService: ProductsService) {
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

  public categories: any = [];

  public ngOnInit() {
    this.categories = this.productService.getCategories().map((category: any) => {
      category.link = `assets/categories/${category.code}.png`;
      return category;
    });
  }

}
