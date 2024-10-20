import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WalletService } from "../wallet.service";

@Component({
  selector: 'app-add-money',
  templateUrl: 'addMoney.component.html',
  standalone: true,
  imports: [FormsModule]
})
export class AddMoneyComponent implements OnInit, OnChanges {
  public amount = 0;

  @Input()
  public amountToLoad = 0;

  @Output()
  public emitWallet: EventEmitter<any> = new EventEmitter<any>();

  constructor(public walletService: WalletService) { }

  public ngOnInit(): void {
    this.amount = this.amountToLoad;
  }

  public ngOnChanges(): void {
    this.amount = this.amountToLoad;
  }

  public addMoney() {
    let amountToWallet = 0;
    if (this.amountToLoad === 3000) {
      amountToWallet = 3500;
    } else if (this.amountToLoad === 1500) {
      amountToWallet = 1700;
    } else {
      amountToWallet = this.amount;
    }
    this.walletService.addMoney(amountToWallet).subscribe((res: any) => {
      console.log('res => ', res);
      this.amount = 0;
      this.emitWallet.emit(res.toyWallet);
    });
  }
}
