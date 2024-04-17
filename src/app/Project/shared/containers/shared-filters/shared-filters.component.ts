import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilityService } from '../../services/utility-service.service';

@Component({
  selector: 'app-shared-filters',
  templateUrl: './shared-filters.component.html',
  styleUrls: ['./shared-filters.component.css'],
})
export class SharedFiltersComponent {
  @Input() columnName = '';
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  //@Input() searchText: string='';
  searchTerm = '';
  data;
  isDropdownOpen = false;

  
  constructor(private filterService: UtilityService) {}
  close(): void {    
    this.isDropdownOpen = false;
  }
  reset(){
    this.filterService.setFilter(this.columnName,'');
    this.searchTerm='';
    this.isDropdownOpen=false;
  }
  updateSearch(): void {
    this.filterService.setFilter(this.columnName, this.searchTerm);
  }
  sort(item: string) {
    this.data = this.filterService.getData();
    if (item === 'asc') {
      this.data.sort((a, b) =>
        a[this.columnName] > b[this.columnName] ? 1 : -1
      );
    }
    if (item === 'desc') {
      this.data.sort((a, b) =>
        a[this.columnName] < b[this.columnName] ? 1 : -1
      );
    }
    this.filterService.setData(this.data);
    this.refreshTable.emit();
  }
}
