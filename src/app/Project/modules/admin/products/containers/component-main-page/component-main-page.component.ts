import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UiCommonService } from 'src/app/Project/shared/services/ui-common/ui-common.service';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';
import { ComponentService } from '../../services/component.service';

export interface Data {
  id: number;
  productname: string;
  name: string;
  code: string;
  isActive: boolean;
}
@Component({
  selector: 'app-component-main-page',
  templateUrl: './component-main-page.component.html',
  styleUrls: ['./component-main-page.component.css'],
})
export class ComponentMainPageComponent implements OnInit {
  checked = false;
  indeterminate = false;
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<number>();
  totalItems = 0;
  pageSize = 2;
  currentPageIndex = 1;
  isVisible = false;
  viewOrganisation = false;
  isEdit = false;
  inputValue = 1;
  avatarUrl?: string;
  loading = false;
  tabSelected = 1;
  isGridModal = false;
  document = false;
  documentList = false;
  listOfCurrentDocData = [];
  searchText = '';
  columnMap: Map<string, string>;
  newColumns: string[];
  filterState = new Map<string, string[]>();
  // listOfCurrentPageData = [
  //   { id: 0 },
  //   { id: 1 },
  //   { id: 2 },
  //   { id: 3 },
  //   { id: 4 },
  //   { id: 5 },
  //   { id: 6 },
  //   { id: 7 },
  // ];
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
  componentDetails = [
    {
      id: 1,
      label: 'Height',
      value: '40 mm',
    },
    {
      id: 2,
      label: 'Width',
      value: '40 mm',
    },
    {
      id: 3,
      label: 'Length',
      value: '40 mm',
    },
    {
      id: 4,
      label: 'Gross Weight',
      value: '100 gms',
    },
    {
      id: 5,
      label: 'Polymer Type',
      value: 'India',
    },
    {
      id: 6,
      label: 'Material Name',
      value: 'Mumbai',
    },
    {
      id: 7,
      label: 'Resin Type',
      value: '44 mm',
    },
    {
      id: 8,
      label: 'Lead Resin Grade',
      value: '44 mm',
    },
    {
      id: 9,
      label: 'Back Up Resin Grade',
      value: '44 mm',
    },
    {
      id: 10,
      label: 'Master Batch',
      value: '10 gm',
    },
    {
      id: 11,
      label: 'Additives',
      value: 'lorem ipsum',
    },
    {
      id: 12,
      label: 'PCR %',
      value: 'lorem ipsum',
    },
  ];
  isSmallScreen = false;
  constructor(
    private msg: NzMessageService,
    private notification: NzNotificationService,
    private service: ComponentService,
    private utilityService: UtilityService,
    private uiService: UiCommonService
  ) {}

  // initial running lifecycle hook
  ngOnInit(): void {
    this.getComponentApi();
    this.uiService.getWindowWidth().subscribe((width) => {
      this.isSmallScreen = width < 992;
    });
  }

  /*button methods Starts*/

  showModal(create: number) {
    this.tabSelected = create;
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
    this.viewOrganisation = false;
    this.isGridModal = false;
  }
  handleOk() {
    this.isVisible = false;
    this.viewOrganisation = false;
    this.isGridModal = false;
  }
  back() {
    if (this.tabSelected < 6 && this.tabSelected > 1) {
      this.tabSelected--;
    }
  }
  saveContinue() {
    if (this.tabSelected < 6 && this.tabSelected > 0) {
      this.tabSelected++;
    }
  }
  update() {
    this.isVisible = false;
  }
  openViewModal() {
    alert('working');
    this.viewOrganisation = true;
  }
  editModal(tabNumber: number) {
    this.tabSelected = tabNumber;
    this.viewOrganisation = false;
    this.isVisible = true;
    this.isEdit = true;
  }
  openGridModal() {
    this.isGridModal = true;
  }
  openView() {
    alert('working');
    this.viewOrganisation = true;
  }
  /*button methods End*/

  /*logo logic starts*/
  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.

        if (info.file && info.file.originFileObj) {
          this.getBase64(info.file.originFileObj, (img: string) => {
            this.loading = false;
            this.avatarUrl = img;
          });
        } else {
          // Handle the case where `info.file` or `info.file.originFileObj` is null or undefined
        }
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  private getBase64(
    file: File,
    callback: (result: string | ArrayBuffer | null) => void
  ): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
  }
  /*logo logic End*/

  updateTabSelected(tab: number) {
    this.tabSelected = tab;
  }
  createNotification(type: string): void {
    this.notification.create(
      type,
      'Component Created Successfully',
      'Component Id: 1171',
      { nzPlacement: 'bottomRight', nzDuration: 3000 }
    );
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }

  // add new component
  openComponent = false;
  openAddNewComponent() {
    this.openComponent = true;
  }
  closeAddNewModal() {
    this.openComponent = false;
  }
  // select component
  openSelComponent = false;
  openSelectComponent() {
    this.openSelComponent = true;
  }
  closeSelectModal() {
    this.openSelComponent = false;
  }

  openDocumentModal() {
    this.document = true;
    this.documentList = false;
  }
  closeDocumentModal() {
    this.document = false;
    this.documentList = false;
    this.listOfCurrentDocData = [{ id: 0 }];
  }
  openDocumentListModal() {
    this.documentList = true;
  }

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

  // getCompoentList
  getComponentApi() {
    this.service.getComponentList().subscribe((data) => {
      if (data) {
        this.listOfCurrentPageData = data;
      }
    });
  }

  filterData() {
    this.currentPageIndex = 1;
    this.listOfCurrentPageData = this.utilityService.filterTable(
      this.listOfData,
      this.searchText
    );
  }

  columnMapSet() {
    this.columnMap = new Map();
    this.columnMap.set('name', 'Component Name');
    this.columnMap.set('code', 'Component Code');
    this.columnMap.set('', '');
    this.columnMap.set('', '');
    this.columnMap.set('', '');
    this.columnMap.set('isActive', 'Status');
    this.newColumns = [...this.columnMap.values()];
  }

  getValueArray(keyName: string): string[] {
    return this.utilityService.getValueArray(this.listOfData, keyName);
  }

  search(searchString: string, keyName: string) {
    this.listOfCurrentPageData = this.utilityService.search(
      this.listOfData,
      searchString,
      keyName,
      this.currentPageIndex,
      this.pageSize
    );
  }

  sort(sortOrder: string, keyName: string) {
    this.listOfCurrentPageData = this.utilityService.sort(
      this.listOfData,
      sortOrder,
      keyName,
      this.currentPageIndex,
      this.pageSize
    );
  }

  filter(filterValue: string, columnName: string) {
    this.filterState = this.utilityService.manageFilterState(
      this.filterState,
      filterValue,
      columnName
    );

    this.listOfCurrentPageData = this.utilityService.filter(
      this.listOfData,
      this.filterState,
      filterValue,
      columnName,
      this.currentPageIndex,
      this.pageSize
    );
  }
}
