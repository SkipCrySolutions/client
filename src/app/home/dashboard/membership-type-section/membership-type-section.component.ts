import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'membership-type-section',
  templateUrl: 'membership-type-section.component.html',
})
export class MembershipTypeSectionComponent {
  public readonly membershipTypes = [{ name: 'Copper', code: 'copper' }, { name: 'Silver', code: 'silver' }, { name: 'Gold', code: 'gold' }, { name: 'Platinum', code: 'platinum' }, { name: 'Platinum Big', code: 'platinumbig' }];

  constructor(private router: Router) { }

  public onMembershipTypeClick(membershipType: string): void {
    console.log(`Membership type clicked: ${membershipType}`);
    this.router.navigate(['/products', membershipType]);
  }
}
