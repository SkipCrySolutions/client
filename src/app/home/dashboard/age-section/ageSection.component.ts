import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";

@Component({
    selector: 'app-age-section',
    standalone: true,
    templateUrl: 'ageSection.component.html',
    imports: [CardModule, ButtonModule, RouterModule]
})
export class AgeSectionComponent {

  constructor(private router: Router) { }

  public navigateToProducts(ageType: string): void {
    console.log('Navigating to age:', ageType);
    this.router.navigate(['/products', ageType]);
  }
}
