import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';
import { AppState } from 'src/app/Project/store/app.state';
import { OrganizationService } from '../../services/organization.service';
import * as fromAction from '../../store/orgsetup.action';
import * as fromSelector from '../../store/orgsetup.selectors';

export interface Data {
  id: number;
  orgname: string;
  orgCode: string;
  domainUrl: string;
  name: string;
  contactAddress;
  email;
  mobile;
  contactInfo;
  status;
  domainName;
}

@Component({
  selector: 'app-organisation-table',
  templateUrl: './organisation-table.component.html',
  styleUrls: ['./organisation-table.component.css'],
})
export class OrganisationTableComponent implements OnInit {
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<number>();
  totalItems = 0;
  pageSize = 10;
  currentPageIndex = 1;
  filteredData: Data[] = [];
  isModalVisible = false;
  @Output() openViewEvent = new EventEmitter<void>();
  @Output() openEditEvent = new EventEmitter<void>();
  States: { [key: string]: boolean } = {};
  columns: string[] = [
    'Organisation Name',
    'Organisation Code',
    'Domain Name',
    'Global Currency',
    'Email',
    'Contact Number',
    'Status',
  ];
  tabSelecteds: 1;
  getOrganizationList$: Subscription;
  private subscription: Subscription;

  constructor(
    private service: OrganizationService,
    private store: Store<AppState>,
    private searchService: UtilityService
  ) {
    // this.subscription = this.searchService.searchTerm$.subscribe((term) => {
    //   this.filterData(term);
    // });
  }

  // filterData(searchTerm: string): void {
  //   // Implement your filtering logic based on the searchTerm
  //   // Update this.filteredData accordingly
  //   this.currentPageIndex = 1;
  //   this.filteredData = this.listOfData.filter((entry) =>
  //     //const values=Object.values(entry).flat(Infinity);
  //     Object.keys(entry).some((key) => {
  //       const value = entry[key];
  //       const stringValue = typeof value !== 'string' ? String(value) : value;

  //       return (
  //         (typeof stringValue === 'string' &&
  //           stringValue.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //         (typeof value === 'object' &&
  //           value !== null &&
  //           Object.values(value).some((subValue) =>
  //             typeof subValue !== 'string'
  //               ? String(subValue)
  //                   .toLowerCase()
  //                   .includes(searchTerm.toLowerCase())
  //               : subValue.toLowerCase().includes(searchTerm.toLowerCase())
  //           ))
  //       );
  //     })
  //   );
  // }

  ngOnInit(): void {
    this.getOrganizationListApi();
    this.restFilter();
  }
  // Organization List Api
  getOrganizationListApi() {
    this.service.getOrganisation().subscribe((data) => {
      if (data) {
        this.store.dispatch(
          fromAction.getOranizationSuccess({ getOranization: data })
        );
        this.getOrganizationList$ = this.store
          .select(fromSelector.getOrganizationList)
          .subscribe((res) => {
            if (res) {
              this.listOfData = res['data'];
              this.totalItems = this.listOfData.length;
              this.loadTableData(this.currentPageIndex, this.pageSize);
            }
          });
      }
    });
    this.totalItems = this.listOfData.length;
    this.loadTableData(this.currentPageIndex, this.pageSize); // Pass both pageIndex and pageSize
  }

  loadTableData(pageIndex: number, pageSize: number): void {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfCurrentPageData = this.listOfData.slice(startIndex, endIndex);
    this.filteredData = this.listOfCurrentPageData;
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

  openView(data) {
    this.openViewEvent.emit(data);
  }
  openEdit(data) {
    this.openEditEvent.emit(data);
  }

  openGrid() {
    this.isModalVisible = true;
  }

  Cancel() {
    this.isModalVisible = false;
    this.restFilter();
  }
  handleOk() {
    this.isModalVisible = false;
  }
  restFilter() {
    for (const column of this.columns) {
      this.States[column] = true;
    }
  }
}
