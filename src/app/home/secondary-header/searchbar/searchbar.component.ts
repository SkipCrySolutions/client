import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-searchbar',
  templateUrl: 'searchbar.component.html',
  imports: [RouterModule, FormsModule]
})
export class SearchBarComponent {
  public searchKey = '';

  constructor(private router: Router) { }

  public search(): void {
    console.log('Searching for:', this.searchKey);
    this.router.navigate(['/products', this.searchKey]);
  }
}
