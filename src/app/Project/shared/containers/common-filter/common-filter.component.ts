import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-common-filter',
  templateUrl: './common-filter.component.html',
  styleUrls: ['./common-filter.component.css'],
})
export class CommonFilterComponent {
  

  @Output() searchEvent = new EventEmitter<string>();
  @Output() sortEvent = new EventEmitter<string>();
  @Output() filterEvent = new EventEmitter<string>();
  @Input() filterByString: string;
  @Input() valueArray: string[];
  @Input() filterEnabled: boolean;

  isDropDownOpen = false;
  searchTerm = '';


  close(): void {
    this.isDropDownOpen = false;
  }
  reset() {
    this.searchTerm = '';
    this.isDropDownOpen = false;
  }

  sort(sortType: string) {
    this.sortEvent.emit(sortType);
  }

  search() {
    this.searchEvent.emit(this.searchTerm);
  }

  filter(filterValue:string){
    this.filterEvent.emit(filterValue);
  }

  getType(obj): string {
    if (typeof obj === 'string') {
      return 'string';
    } else if (typeof obj === 'boolean') {
      return 'boolean';
    } else {
      return 'unknown';
    }
  }
}
