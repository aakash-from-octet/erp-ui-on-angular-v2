import { Component } from '@angular/core';

@Component({
  selector: 'app-mould-details',
  templateUrl: './mould-details.component.html',
  styleUrls: ['./mould-details.component.css'],
})
export class MouldDetailsComponent {
  listOfCurrentPageData = [{ id: 0 }, { id: 1 }];
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
