import { Component, HostListener } from "@angular/core";
import { AgeSectionComponent } from "./age-section/ageSection.component";
import { BestRentedComponent } from "./best-rented/bestRented.component";
import { CarouselModule } from "primeng/carousel";
import { MembershipTypeSectionComponent } from "./membership-type-section/membership-type-section.component";
import { SkillSectionComponent } from "./skill-section/skillSection.component";
import { RouterModule } from "@angular/router";
import { AllProductsSectionComponent } from "./all-section/allproducts-section.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: 'dashboard.component.html',
  imports: [AllProductsSectionComponent, AgeSectionComponent, BestRentedComponent, SkillSectionComponent, CarouselModule, MembershipTypeSectionComponent, RouterModule],
  styles: `
    .cc {
      color: 'white'
    }
    `
})
export class DashboardComponent {

  public screenWidth: number = window.innerWidth;

  public banners: string[] = [];

  constructor() {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    // Adjust your variable based on screen width
    this.banners = this.getBanners();
  }

  @HostListener('window:load', ['$event'])
  onload(event: any) {
    this.screenWidth = window.innerWidth;
    // Adjust your variable based on screen width
    this.banners = this.getBanners();
  }

  private getBanners(): string[] {
    let banners = [];
    if (this.screenWidth < 768) {
      banners = [
        'assets/banners/wallet.jpg',
        'assets/banners/newarrival.jpg',
        'assets/banners/newarrival1.jpg',
        'assets/banners/newarrival2.jpg'
      ];
      // Set variable for small screens
    } else if (this.screenWidth >= 768 && this.screenWidth < 1024) {
      // Set variable for medium screens
      banners = [
        'https://via.placeholder.com/1000x300/FF5733/FFFFFF',
        'https://via.placeholder.com/1000x300/FFC300/FFFFFF',
        'https://via.placeholder.com/1000x300/C70039/FFFFFF'
      ];
    } else {
      // Set variable for large screens
      banners = [
        'https://via.placeholder.com/1200x300/FF5733/FFFFFF',
        'https://via.placeholder.com/1200x300/FFC300/FFFFFF',
        'https://via.placeholder.com/1200x300/C70039/FFFFFF'
      ];
    }
    return banners;
  }

}
