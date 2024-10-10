import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Event, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AppService } from '../app.service';
import { UserService } from '../login/user.service';
import { SecondaryHeaderComponent } from './secondary-header/secondary-header.component';
import { FooterComponent } from './footer/footer.component';
import { AppHelper } from '../utils/app.helper';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterModule,
    SecondaryHeaderComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('content', { static: false })
  public bodyElement!: ElementRef;

  public loadHome = false;

  public isSimpleHeader = false;

  constructor(
    public appService: AppService,
    private userService: UserService,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: Event) => {
      window.scrollTo(0, 0);
      const navigationEndEvent = event as NavigationEnd;
      console.log('NavigationEnd:', navigationEndEvent.urlAfterRedirects);
      const url = navigationEndEvent.urlAfterRedirects;
      if (url === '/login' || url === '/signup' || url === '/refer' || url === '/giftCards' || url === '/giftcard_form') {
        this.isSimpleHeader = true;
      } else {
        this.isSimpleHeader = false;
      }
    });
    const user = AppHelper.getFromLocalStorage('scUser');
    console.log('user => ', user);
    if (user && user._id) {
      this.userService.getUserById(user._id,user.CustomerId).subscribe((user: any) => {
        console.log('aaa => ', user);
        AppHelper.saveToLocalStorage('scUser', user);
        this.appService.user.update(() => user);
        const cartCount = user?.cartCount;
        this.appService.cartCount.update(() => cartCount);
      });
    }
  }

  ngAfterViewInit(): void {
    // Listen for header resize
    window.addEventListener('resize', () => {
      window.scrollTo(0, 0);
      this.adjustDivBelowHeader();
    });
    this.adjustDivBelowHeader();
  }

  private adjustDivBelowHeader() {
    // Set margin-top of content to header height + additional margin
    const padding = 2; // Additional margin if needed
    const headerHeight = +this.appService.headerHeight();
    this.renderer.setStyle(
      this.bodyElement.nativeElement,
      'padding-top',
      `${headerHeight + padding}px`
    );
  }
}
