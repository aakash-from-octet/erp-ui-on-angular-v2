import { Component } from '@angular/core';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent {
  iotEnabled = false;
  shotEnabled = false;
  ownership = '1';
}
