import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";

@Component({
    selector: 'app-skill-section',
    standalone: true,
    templateUrl: 'skillSection.component.html',
    imports: [CardModule, ButtonModule, RouterModule]
})
export class SkillSectionComponent {

}
