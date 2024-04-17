import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-customization',
  templateUrl: './grid-customization.component.html',
  styleUrls: ['./grid-customization.component.css'],
})
export class GridCustomizationComponent {
  @Input() columns: string[];
  @Input() checkboxStates: { [key: string]: boolean };

  onCheckboxChange(columnName: string) {
    this.checkboxStates[columnName] = !this.checkboxStates[columnName];
  }
}
