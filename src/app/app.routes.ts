import { Routes } from '@angular/router';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { HowItWorksComponent } from './howitworks/howItWorks.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './home/cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './profile/orders/orders.component';
import { AccountComponent } from './profile/account/account.component';
import { ProductDetailsComponent } from './products/product/product-details/product-details.component';
import { SignupComponent } from './login/signup/signup.component';
import { WishlistComponent } from './profile/wishlist/wishlist.component';
import { WalletComponent } from './profile/wallet/wallet.component';
import { ContactComponent } from './contact/contact.component';
import { BlockToysComponent } from './profile/blocktoys/blocktoys.component';
import { ReferComponent } from './refer/refer.component';
import { GiftCardComponent } from './giftCards/giftcard.component';
import { GiftCardFormComponent } from './giftCards/giftcard_form/giftcard_form.component';
import { AllProductsComponent } from './products/allProducts/allProducts.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'productDetails/:Code/:Id/:StoreId', component: ProductDetailsComponent },
  { path: 'products/:filter', component: AllProductsComponent },
  // { path: 'productsByAge/:agetype', component: ProductsByAgeComponent },
  // {
  //   path: 'productsByCategory/:category',
  //   component: ProductsByCategoryComponent,
  // },
  // {
  //   path: 'productsByMembershipType/:membershipType',
  //   component: ProductsByMembershipTypeComponent,
  // },
  // { path: 'productsBySearch/:searchKey', component: ProductsBySearchComponent },
  { path: 'howitworks', component: HowItWorksComponent },
  { path: 'cart', component: CartComponent },
  { path: 'refer', component: ReferComponent },
  { path: 'giftCards', component: GiftCardComponent },
  { path: 'giftcard_form', component: GiftCardFormComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'account', component: AccountComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'blockproduct', component: BlockToysComponent },
    ],
  },
];
