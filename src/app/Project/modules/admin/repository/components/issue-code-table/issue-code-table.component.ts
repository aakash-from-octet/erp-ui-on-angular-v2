import { Component, EventEmitter, OnInit, Output } from '@angular/core';

export interface Data {
  id: number;
  productname: string;
  status: string;
}

@Component({
  selector: 'app-issue-code-table',
  templateUrl: './issue-code-table.component.html',
  styleUrls: ['./issue-code-table.component.css'],
})
export class IssueCodeTableComponent implements OnInit {
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
    const requestData = this.listOfData.filter((data) =>
      this.setOfCheckedId.has(data.id)
    );
    console.log(requestData);
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loading = false;
    }, 1000);
  }

  ngOnInit(): void {
    this.listOfData = new Array(100).fill(0).map((_, index) => ({
      id: index,
      productname: `Dove ${index}`,
      status: 'Active',
    }));
    this.totalItems = this.listOfData.length;
    this.loadTableData(this.currentPageIndex, this.pageSize); // Pass both pageIndex and pageSize
  }
  @Output() openViewEvent = new EventEmitter<void>();
  openView() {
    this.openViewEvent.emit();
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

  listOfSelection = [
    {
      text: 'Mark As Active',
      onSelect: () => {
        const selectedRowsData = this.listOfCurrentPageData.filter((data) => {
          return this.setOfCheckedId.has(data.id);
        });
        selectedRowsData.forEach((row) => {
          row.status = 'Active'; // Use assignment operator =
        });
        this.refreshCheckedStatus();
      },
    },
    {
      text: 'Mark As Inactive',
      onSelect: () => {
        const selectedRowsData = this.listOfCurrentPageData.filter((data) => {
          return this.setOfCheckedId.has(data.id);
        });
        selectedRowsData.forEach((row) => {
          row.status = 'In Active'; // Use assignment operator =
        });
        this.refreshCheckedStatus();
      },
    },
  ];
}
