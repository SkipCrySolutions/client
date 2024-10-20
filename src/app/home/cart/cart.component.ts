import { Component } from "@angular/core";
import { OrderService } from "../../products/order.service";
import { AppService } from "../../app.service";
import { DataViewModule } from "primeng/dataview";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { AppHelper } from "../../utils/app.helper";
import { Router, RouterModule } from "@angular/router";
import { CardModule } from "primeng/card";
import { FormsModule } from "@angular/forms";
import { LocationService } from "../../location.service";
import { PincodePageComponent } from "../../landing/pincodepage/pincodepage.component";
import { AppConstants } from "../../app.constants";
import { Product } from "../../products/product.model";

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: 'cart.component.html',
  imports: [CommonModule, DataViewModule, ButtonModule, CardModule, RouterModule, FormsModule, PincodePageComponent]
})
export class CartComponent {
  public distance = 0;
  public cartTotal = 0;
  public deliveryTotal = 0;
  public bigToyDelivery = true;
  private bigToyPresentAlready = false;
  public cartItems: any = [];
  public layout: 'grid' | 'list' = 'list';
  public today = new Date();
  public dateFor15Days = "";
  public dateFor30Days = "";
  public availableSunday = "";
  public orderPlaced = false;
  public amountToPay = 0;
  public totalByCoins = 0;

  public showMinOrderMessage = false;

  public pincode = '';

  public tempDistanceFromPincode = 0;

  public depositAmount = 0;

  public isOdz = false;

  public deductedFromWallet = 0;

  public walletLoadingRequired = false;

  constructor(private orderService: OrderService, public appService: AppService,
    private router: Router
  ) {
    this.availableSunday = AppHelper.getNextSundayDate();
    const day15 = new Date(AppHelper.getParticularDateFromTodayByDays(15));
    const day30 = new Date(AppHelper.getParticularDateFromTodayByDays(30));
    this.dateFor15Days = AppHelper.getFormattedDate(day15);
    this.dateFor30Days = AppHelper.getFormattedDate(day30);
    const distance = AppHelper.getFromLocalStorage('scDistance');
    this.isOdz = AppHelper.getFromLocalStorage('scOutside');
    if (distance) {
      this.distance = distance;
      this.getCart();
    }
    if (this.appService.user()) {
      this.depositAmount = this.appService.user().DepositAmount;
    }
  }

  public placeOrder(): void {
    console.log('user => ', this.appService.user());
    const order = {
      customerId: this.appService.user().CustomerId,
      products: [] as any,
      orderDate: AppHelper.getFormattedDate(this.today),
      deductFromWallet: this.deductedFromWallet,
      toysTotal: this.cartTotal,
      deliveryTotal: this.deliveryTotal,
      orderTotal: this.cartTotal + this.deliveryTotal,
      amountToPay: this.amountToPay,
      Status: 'Placed',
      addonDeposit: 0,
      isNewCustomer: this.appService.user().Status === 'New',
      storeId: this.appService.user().StoreId
    };
    console.log('order => ', order);
    this.cartItems.forEach((item: any) => {
      order.addonDeposit += this.addOnDeposit(item);
      order.products = [...order.products, {
        product: item.Product,
        return: item.rentedDays === '15 days' ? this.dateFor15Days : this.dateFor30Days,
        rentedDays: item.rentedDays,
        rentedAmount: item.rentedAmount
      }];
    });

    this.orderService.placeOrder(order).subscribe(() => {
      this.orderPlaced = true;
      this.clearCart();
      if (this.appService.user().Status === 'New') {
        location.reload();
      }
    });
  }

  public gotoOrders(): void {
    this.router.navigate(['profile', 'orders']);
  }

  public removeFromCart(cartItem: any): void {
    if (this.appService.user()) {
      this.orderService.removeFromCart(cartItem._id).subscribe(() => {
        this.getCart();
      });
    } else {
      const cartItems = AppHelper.getFromLocalStorage('scCart');
      const updatedCart = cartItems.filter((item: any) => item._id !== cartItem._id);
      AppHelper.saveToLocalStorage('scCart', updatedCart);
      this.getCart();
    }
  }

  public gotoHome(): void {
    this.router.navigate(['']);
  }

  public loadProduct(product: any) {
    this.router.navigate(['productDetails', product.Code]);
  }

  public getCart(fromManualPincode?: boolean): void {
    if (this.appService.user()) {
      this.cartTotal = 0;
      this.amountToPay = 0;
      this.orderService.getCartByCustomerId().subscribe((res) => {
        if (res) {
          this.distance = this.appService.user().KmDistance;
          this.cartItems = res;
          const cartCount = this.cartItems.length;
          this.appService.cartCount.update(() => cartCount);
          this.isOdz = this.appService.user().outsideDeliveryZone;
          this.calculateTotal();
          this.calculateDeliveryCharges();
          this.calculateRewards();
        }
      });
    } else {
      // If pincode entered in cart page
      if (fromManualPincode) {
        AppHelper.saveToLocalStorage('scDistance', this.tempDistanceFromPincode);
        this.distance = this.tempDistanceFromPincode;
      }
      this.cartItems = AppHelper.getFromLocalStorage('scCart');
      if (this.cartItems.length) {
        this.isOdz = AppHelper.getFromLocalStorage('scAway');
        this.calculateTotal();
        this.calculateDeliveryCharges();
      }
    }
  }

  public proceedToLoadWallet(): void {
    this.router.navigate(['profile', 'wallet']);
  }

  private addOnDeposit(product: Product): number {
    return product.BudgetType === 'Platinum Big' ? 500 : 0;
  }

  private clearCart(): void {
    this.appService.cartCount.update(() => 0);
    this.orderService.clearCart().subscribe();
  }

  private calculateTotal() {
    this.cartItems.forEach((element: any) => {
      const product = element.Product;
      let rent = element.rentedAmount;
      this.cartTotal += rent;
      this.handleBigToysInCart(product);
    });
    this.amountToPay += this.cartTotal;
    if (!this.depositAmount) {
      this.amountToPay += this.isOdz ? AppConstants.ODZDepostitAmount : AppConstants.DepositAmount;
    }
  }

  private handleBigToysInCart(product: Product): void {
    const bigToyPresent = product.BudgetType === 'Platinum Big';
    if (bigToyPresent) {
      console.log('distance => ', this.distance);
      this.distance = 9;
      if (this.distance > 15) {
        // rent = 0;
        this.bigToyDelivery = false;
      } else {
        let deliveryCharge = 0;
        if (this.distance <= AppConstants.MinDistance) {
          deliveryCharge = AppConstants.MinDistanceDeliveryChargeBigToy;
        } else if (this.distance > AppConstants.MinDistance && this.distance <= AppConstants.MediumDistance) {
          deliveryCharge = AppConstants.MediumDistanceDeliveryChargeBigToy;
        } else {
          deliveryCharge = AppConstants.MaxDistanceDeliveryChargeBigToy;
        }
        this.deliveryTotal += (this.bigToyPresentAlready ? (deliveryCharge * 0.5) : deliveryCharge);
      }
      this.bigToyPresentAlready = true;
    } else {
      this.showMinOrderMessage = this.cartTotal < AppConstants.MinCartValue ? true : false;
    }
  }

  public calculateDeliveryCharges() {
    console.log('carttotal => ', this.cartTotal, this.distance);
    if (!this.isOdz) {
      if (this.cartTotal < AppConstants.MinCartValue) {
        let deliveryCharges = 0;
        if (this.distance <= AppConstants.MinDistance) {
          deliveryCharges += AppConstants.MinDistanceDeliveryCharge;
        } else if (this.distance > AppConstants.MinDistance && this.distance <= AppConstants.MediumDistance) {
          deliveryCharges += AppConstants.MediumDistanceDeliveryCharge;
        } else {
          deliveryCharges += AppConstants.ChargePerKm * this.distance;
        }
        this.deliveryTotal = this.deliveryTotal === 0 ? deliveryCharges : this.deliveryTotal;
      } else {
        console.log('sdfgh => ', this.distance);
        if (this.distance > AppConstants.HighDistance && this.distance <= AppConstants.VeryHighDistance) {
          const extraDeliveryDistance = this.distance - AppConstants.HighDistance;
          this.deliveryTotal = this.deliveryTotal + (extraDeliveryDistance * AppConstants.ChargePerKm);
        }
      }
      console.log('deliveryTotal => ', this.deliveryTotal);
      this.amountToPay += this.deliveryTotal;
    }
  }

  private calculateRewards() {
    console.log('total => ', this.amountToPay, this.appService.user().totalAmount);
    if (this.appService.user().totalAmount) {
      const userTotalAmount = this.appService.user().totalAmount;
      console.log('userTotalAmount => ', userTotalAmount);
      if (userTotalAmount > 0) {
        if (userTotalAmount > this.amountToPay) {
          this.deductedFromWallet = this.amountToPay;
          this.amountToPay = 0;
        } else {
          this.amountToPay -= userTotalAmount;
          this.deductedFromWallet = userTotalAmount;
        }
      }
      console.log('orderTotal => ', this.amountToPay);
      console.log('deductedFromWallet => ', this.deductedFromWallet);
      if (this.amountToPay > userTotalAmount) {
        this.walletLoadingRequired = true;
      } else {
        this.walletLoadingRequired = false;
      }
    }
  }
}
