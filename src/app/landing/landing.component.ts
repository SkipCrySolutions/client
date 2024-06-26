import { Component } from "@angular/core";
import { HomeComponent } from "../home/home.component";
import { LocationService } from "../location.service";
import { PincodePageComponent } from "./pincodepage/pincodepage.component";
import { AppHelper } from "../utils/app.helper";

@Component({
  selector: 'app-landing',
  templateUrl: 'landing.component.html',
  standalone: true,
  imports: [HomeComponent, PincodePageComponent]
})
export class LandingComponent {

  public loadHome = false;

  public pincode = '';
  public isValidPincode = false;

  public distance = '';

  public nearestStore: any;

  public isOutsideDeliveryZone = false;

  constructor(public locationService: LocationService) {
    this.locationService.getStores().subscribe((stores) => {
      this.locationService.stores = stores;
    });
    const store = AppHelper.getFromLocalStorage('scStoreDetails');
    if (store) {
      this.loadHome = true;
    }
  }

  public proceed(): void {
    console.log('pincode => ', this.pincode);
    this.loadHome = true;
    const store: any = this.locationService.selectedStore();
    AppHelper.saveToLocalStorage('scStoreDetails', store);
    AppHelper.saveToLocalStorage('scStore', store.nearestStore.StoreId);
    AppHelper.saveToLocalStorage('scOutside', store.isAway);
    AppHelper.saveToLocalStorage('scDistance', store.shortestDistance);
    AppHelper.saveToLocalStorage('scPincode', this.pincode);
    console.log('store => ', store);
  }
}
