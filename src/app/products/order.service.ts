import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "../app.service";
import { AppHelper } from "../utils/app.helper";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public dateFor15Days = '';
  public dateFor30Days = '';

  constructor(private http: HttpClient, private appService: AppService) {
    const day15 = new Date(AppHelper.getParticularDateFromTodayByDays(15));
    const day30 = new Date(AppHelper.getParticularDateFromTodayByDays(30));
    this.dateFor15Days = AppHelper.getFormattedDate(day15);
    this.dateFor30Days = AppHelper.getFormattedDate(day30);
  }

  public addToCart(request: any) {
    const url = `/api/cart/addCart`;
    return this.http.post(url, request);
  }

  public getCartByCustomerId() {
    const customerId = this.appService.user().CustomerId;
    const url = `/api/cart/getCart/${customerId}`;
    return this.http.get(url);
  }

  public placeOrder(order: any): Observable<any> {
    order.Status = 'Placed';
    const url = `/api/orders/order`;
    return this.http.post(url, order);
  }

  public extendToy(product: any) {
    console.log('product => ', product);
    const orderedProduct = {
      product: product.product,
      return: product.rentedDays === '15 days' ? this.dateFor15Days : this.dateFor30Days,
      rentedDays: product.rentedDays,
      rentedAmount: product.rentedAmount
    };
    const order = {
      customerId: this.appService.user().CustomerId,
      products: [orderedProduct] as any,
      orderDate: AppHelper.getFormattedDate(new Date()),
      deductFromWallet: this.calculateAmountToPay(product.rentedAmount).deductedFromWallet,
      toysTotal: product.rentedAmount,
      deliveryTotal: 0,
      orderTotal: product.rentedAmount,
      amountToPay: this.calculateAmountToPay(product.rentedAmount).amountToPay,
      Status: 'Placed',
      addonDeposit: 0,
      storeId: this.appService.user().StoreId,
      isExtend: true
    };
    console.log('order => ', order);
    return this.placeOrder(order);
  }

  public returnOrder(order: any) {
    const url = `/api/orders/changeState/${order.storeId}/${order.customerId}/${order.orderId}/true`;
    return this.http.get(url);
  }

  public removeFromCart(id: string) {
    const customerId = this.appService.user().CustomerId;
    const url = `/api/cart/removecartItem/${customerId}/${id}`;
    return this.http.delete(url);
  }

  public clearCart() {
    const customerId = this.appService.user().CustomerId;
    const url = `/api/cart/clearCart/${customerId}`;
    return this.http.delete(url);
  }

  public getOrders() {
    const customerId = this.appService.user().CustomerId;
    const url = `/api/orders/hold/${customerId}`;
    return this.http.get(url);
  }

  private calculateAmountToPay(amountToPay: number = 0): { amountToPay: number, deductedFromWallet: number } {
    let deductedFromWallet = 0;
    if (this.appService.user().totalAmount) {
      const userTotalAmount = this.appService.user().totalAmount;
      if (userTotalAmount > amountToPay) {
        deductedFromWallet = amountToPay;
        amountToPay = 0;
      } else {
        amountToPay -= userTotalAmount;
        deductedFromWallet = userTotalAmount;
      }
    }
    return { amountToPay, deductedFromWallet };
  }
}

