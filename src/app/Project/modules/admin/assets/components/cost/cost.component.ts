import { Component } from '@angular/core';

@Component({
  selector: 'app-cost',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.css'],
})
export class CostComponent {
  value: string[] = [];
  nodes = [
    {
      title: 'Mild Steel (MS)',
      value: '0-0',
      key: '0',
    },
    {
      title: 'P20',
      value: '1',
      key: '1',
    },
    {
      title: 'P32',
      value: '2',
      key: '2',
    },
    {
      title: 'SS 1.2316 or Equivalent',
      value: '3',
      key: '3',
    },
  ];
}
