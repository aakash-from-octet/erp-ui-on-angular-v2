import { Component, EventEmitter, OnInit, Output } from '@angular/core';

export interface Data {
  id: number;
  mouldname: string;
}

@Component({
  selector: 'app-mould-table',
  templateUrl: './mould-table.component.html',
  styleUrls: ['./mould-table.component.css'],
})
export class MouldTableComponent implements OnInit {
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<number>();
  totalItems = 0;
  pageSize = 20;
  currentPageIndex = 1;

  loadTableData(pageIndex: number, pageSize: number): void {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfCurrentPageData = this.listOfData.slice(startIndex, endIndex);
  }

  // Add a new method to handle size change
  pageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadTableData(this.currentPageIndex, size);
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData;
    this.checked = listOfEnabledData.every(({ id }) =>
      this.setOfCheckedId.has(id)
    );
    this.indeterminate =
      listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) &&
      !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) =>
      this.updateCheckedSet(id, checked)
    );
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    this.loading = true;
    this.listOfData.filter((data) => this.setOfCheckedId.has(data.id));
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loading = false;
    }, 1000);
  }

  ngOnInit(): void {
    this.listOfData = new Array(100).fill(0).map((_, index) => ({
      id: index,
      mouldname: `Dove ${index}`,
    }));
    this.totalItems = this.listOfData.length;
    this.loadTableData(this.currentPageIndex, this.pageSize); // Pass both pageIndex and pageSize
  }
  @Output() openViewEvent = new EventEmitter<void>();
  openView() {
    // this.openViewEvent.emit();
  }

  isVisible = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
