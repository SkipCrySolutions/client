import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../products.service';
import { FormsModule } from '@angular/forms';
import { Product } from '../../product.model';

@Component({
  selector: 'app-products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class ProductsFilterComponent implements OnInit {

  @Input() public inputFilter: string = '';

  @Output() public products$ = new EventEmitter<Product[]>();

  public isFilterPanelOpen = false;
  public filterTypes = ['Age', 'Category', 'Brand', 'Price'];
  public selectedFilterType: string | null = 'Age';

  public categories: { name: string, code: string }[] = [];
  public ages: { name: string, code: string }[] = [];

  // Options for each filter type
  // public ageOptions = ['0 to 3 Years', '3 to 6 Years', '6+ Years'];
  // categoryOptions = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books'];
  brandOptions = [{ name: 'Brand 1', code: 'brand1' }, { name: 'Brand 2', code: 'brand2' }, { name: 'Brand 3', code: 'brand3' }];
  priceOptions = [{ name: '0-100', code: 'copper' }, { name: '100-200', code: 'silver' }, { name: '200-300', code: 'gold' }, { name: '300-400', code: 'platinum' }, { name: '400+', code: 'platinumbig' }];

  public selectedAges: { [key: string]: boolean } = {};
  public selectedCategories: { [key: string]: boolean } = {};
  public selectedBrands: { [key: string]: boolean } = {};
  public selectedPrices: { [key: string]: boolean } = {};

  constructor(public productsService: ProductsService) {

    this.ages = [{
      name: '0-3 Years', code: 'preschool'
    }, {
      name: '3-6 Years', code: 'playschool'
    }, {
      name: '6+ Years', code: 'primaryschool'
    }];
  }

  public ngOnInit(): void {
    console.log('Products Filter Component Initialized', this.inputFilter);
    this.categories = this.productsService.getCategories();
    if (this.inputFilter) {
      const matchedAge = this.ages.find(age => age.code === this.inputFilter);
      const matchedCategory = this.categories.find(category => category.code === this.inputFilter);
      const matchedBrand = this.brandOptions.find(brand => brand.code === this.inputFilter);
      const matchedPrice = this.priceOptions.find(price => price.code === this.inputFilter);
      console.log('matchedPrice ===>>> ', matchedPrice);
      if (matchedAge) {
        this.selectedAges[matchedAge.code] = true;
        this.selectedFilterType = 'Age';
      } else if (matchedCategory) {
        this.selectedCategories[matchedCategory.code] = true;
        this.selectedFilterType = 'Category';
      } else if (matchedBrand) {
        this.selectedBrands[matchedBrand.code] = true;
        this.selectedFilterType = 'Brand';
      } else if (matchedPrice) {
        this.selectedPrices[matchedPrice.code] = true;
        this.selectedFilterType = 'Price';
      }
    }
  }

  public applyFilters() {
    console.log('Filter applied:', this.selectedFilterType, this.selectedAges, this.selectedCategories, this.selectedBrands, this.selectedPrices);
    console.log('Selected Ages:', this.getSelectedItems(this.selectedAges));
    console.log('Selected Categories:', this.getSelectedItems(this.selectedCategories));
    console.log('Selected Brands:', this.getSelectedItems(this.selectedBrands));
    console.log('Selected Prices:', this.getSelectedItems(this.selectedPrices));
    const filterApplied = {
      age: this.getSelectedItems(this.selectedAges),
      category: this.getSelectedItems(this.selectedCategories),
      brand: this.getSelectedItems(this.selectedBrands),
      price: this.getSelectedItems(this.selectedPrices)
    };
    this.productsService.applyProductFilter(filterApplied).subscribe((products: Product[]) => {
      console.log('Filter applied successfully');
      this.products$.emit(products);
      this.isFilterPanelOpen = false;
    });
  }

  public resetFilters() {
    this.selectedFilterType = 'Age';
    console.log('Filters cleared');
    // Implement your clear filter logic here
    this.selectedAges = {};
    this.selectedCategories = {};
    this.selectedBrands = {};
    this.selectedPrices = {};
    this.productsService.getAllProducts().subscribe((products: Product[]) => {
      this.products$.emit(products);
      // this.isFilterPanelOpen = false;
    });
  }

  toggleFilterPanel() {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  selectFilterType(filterType: string) {
    this.selectedFilterType = filterType;
  }

  private getSelectedItems(selectedItems: { [key: string]: boolean }): string[] {
    return Object.keys(selectedItems).filter(key => selectedItems[key]);
  }
}
