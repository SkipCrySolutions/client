import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'membership-type-section',
  template: `
    <div class="flex md:justify-center overflow-auto">
      @for (membershipType of membershipTypes; track $index) {
      <div
        class="w-1/2 md:w-full border-1 surface-border border-round m-0 text-center md:py-1 md:px-0.5 cursor-pointer"
        [routerLink]="['productsByMembershipType', membershipType]"
      >
        <div class="w-64 flex-none">
          <div class="border rounded-lg p-1">
            <div class="w-1/2 md:w-full h-3/5 overflow-hidden">
              <img
                [src]="membershipType.link"
                alt="Item Image"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="border-t bg-white w-1/2 md:w-full h-2/5">
              <div class="mt-1">
                <p class="text-md font-semibold text-center text-pink-600">
                  {{ membershipType }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class MembershipTypeSectionComponent {
  public readonly membershipTypes = ['Silver', 'Gold', 'Platinum'];
}
