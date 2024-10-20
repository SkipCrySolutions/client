import { Component, OnInit } from "@angular/core";
import { AddMoneyComponent } from "./addMoney/addMoney.component";
import { WalletService } from "./wallet.service";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-wallet',
  templateUrl: 'wallet.component.html',
  standalone: true,
  imports: [AddMoneyComponent, RouterModule, FormsModule]
})
export class WalletComponent implements OnInit {
  public wallet: any;
  public amountToLoad: number = 0;
  public paymentOption = 'payCustom';
  public walletSuccess = false;
  constructor(private walletService: WalletService) { }

  public ngOnInit(): void {
    this.walletService.getWallet().subscribe((wallet: any) => {
      console.log("wallet ===>>> ", wallet);
      this.wallet = wallet;
    });
  }

  public updateWallet(value: any) {
    console.log('value => ', value);
    this.wallet = value;
    this.walletSuccess = true;
  }
}
