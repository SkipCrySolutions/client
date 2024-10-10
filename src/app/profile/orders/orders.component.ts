import { Component } from "@angular/core";
import { OrderService } from "../../products/order.service";
import { DataViewModule } from "primeng/dataview";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: 'app-profile-orders',
  standalone: true,
  templateUrl: 'orders.component.html',
  imports: [DataViewModule, CommonModule, CardModule, ButtonModule, RouterModule]
})
export class OrdersComponent {

  public orders: any = [];
  public layout: 'grid' | 'list' = 'list';

  constructor(private orderService: OrderService, private router: Router) {
    // get orders
    this.getOrders();
  }

  public getOrders() {
    this.orderService.getOrders().subscribe((orders: any) => {
      this.orders = orders;
    });
  }

  public loadProduct(product: any) {
    this.router.navigate(['productDetails', product.Code]);
  }

  public extendToy(product: any) {
    this.orderService.extendToy(product).subscribe(() => {
      this.getOrders();
    });
  }

  public returnOrder(order: any) {
    this.orderService.returnOrder(order).subscribe(() => {
      this.getOrders();
    });
  }
}
