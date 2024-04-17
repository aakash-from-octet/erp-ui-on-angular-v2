import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.css'],
})
export class FilterSearchComponent {
  value: string[] = [];
  nodes = [
    {
      title: 'Product 1',
      key: '0',
    },
    {
      title: 'Product 2',
      key: '1',
    },
    {
      title: 'Product 3',
      key: '2',
    },
    {
      title: 'Product 4',
      key: '3',
    },
  ];
  value1: string[] = [];
  nodes1 = [
    {
      title: 'Facility 1',
      key: '0',
    },
    {
      title: 'Facility 2',
      key: '1',
    },
    {
      title: 'Facility 3',
      key: '2',
    },
    {
      title: 'Facility 4',
      key: '3',
    },
  ];
  value2: string[] = [];
  nodes2 = [
    {
      title: 'Mould 1',
      key: '0',
    },
    {
      title: 'Mould 2',
      key: '1',
    },
    {
      title: 'Mould 3',
      key: '2',
    },
    {
      title: 'Mould 4',
      key: '3',
    },
  ];
  filteredItems: string[] = [];
  @Output() saveClicked = new EventEmitter<string[]>();
  updateFilterList(): void {
    const selectedProducts = this.nodes
      .filter((node) => this.value.includes(node.key))
      .map((node) => node.title);
    const selectedFacilities = this.nodes1
      .filter((node) => this.value1.includes(node.key))
      .map((node) => node.title);
    const selectedMoulds = this.nodes2
      .filter((node) => this.value2.includes(node.key))
      .map((node) => node.title);

    this.filteredItems = [
      ...selectedProducts,
      ...selectedFacilities,
      ...selectedMoulds,
    ];
    this.saveClicked.emit(this.filteredItems);
  }
}
