import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UiCommonService } from 'src/app/Project/shared/services/ui-common/ui-common.service';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';
import { ProductService } from '../../services/product.service';

export interface Data {
  id: number;
  productname: string;
  status: string;
}

@Component({
  selector: 'app-product-main-page',
  templateUrl: './product-main-page.component.html',
  styleUrls: ['./product-main-page.component.css'],
})
export class ProductMainPageComponent implements OnInit {
  isVisible = false;
  viewProduct = false;
  isEdit = false;
  inputValue = 1;
  avatarUrl?: string;
  loading = false;
  tabSelected = 1;
  isGridModal = false;
  listOfCurrentPageData = [];
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
  isSmallScreen = false;
  States: { [key: string]: boolean } = {};
  columns: string[] = [
    'Product Name',
    'Product Code',
    'Brand',
    'Brand Code',
    'Category',
    'Category Code',
    'Created On',
    'Status',
  ];
  newColumns: string[];
  columnMap: Map<string, string>;
  valueArray: string[];
  filterState = new Map<string, string[]>();
  searchText = '';

  // table values and methods

  checked = false;
  indeterminate = false;
  listOfData: Data[] = [];
  setOfCheckedId = new Set<number>();
  totalItems = 0;
  pageSize = 20;
  currentPageIndex = 1;
  isModalVisible = false;
  filteredData;

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

  constructor(
    private notification: NzNotificationService,
    private uiService: UiCommonService,
    private productService: ProductService,
    private utilityService: UtilityService
  ) {}
  ngOnInit() {
    this.getProductList();
    this.uiService.getWindowWidth().subscribe((width) => {
      this.isSmallScreen = width < 992;
    });
    setTimeout(() => {
      this.columnMapSet();
      this.resetFilter();
    }, 200);
  }

  columnMapSet() {
    this.columnMap = new Map();
    this.columnMap.set('productName', 'Product Name');
    this.columnMap.set('productCode', 'Product Code');
    this.columnMap.set('brand.name', 'Brand');
    this.columnMap.set('brand.code', 'Brand Code');
    this.columnMap.set('category.name', 'Category');
    this.columnMap.set('category.code', 'Category Code');
    this.columnMap.set('createdAt', 'Created On');
    this.columnMap.set('isActive', 'Status');
    this.newColumns = [...this.columnMap.values()];
  }

  filterData(): void {
    this.currentPageIndex = 1;
    this.listOfCurrentPageData = this.utilityService.filterTable(
      this.listOfData,
      this.searchText
    );
  }
  resetFilter() {
    for (const column of this.newColumns) {
      this.States[column] = true;
    }
    this.searchText = '';
    this.filterState = new Map<string, string[]>();
    this.loadTableData(this.currentPageIndex, this.pageSize);
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
  showModal(create: number) {
    this.tabSelected = create;
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
    this.viewProduct = false;
    this.isGridModal = false;
    this.isModalVisible = false;
    this.resetFilter();
  }
  handleOk() {
    this.isVisible = false;
    this.viewProduct = false;
    this.isModalVisible = false;
    this.isGridModal = false;
  }

  private getBase64(
    file: File,
    callback: (result: string | ArrayBuffer | null) => void
  ): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
  }
  back() {
    if (this.tabSelected < 4 && this.tabSelected > 1) {
      this.tabSelected--;
    }
  }
  saveContinue() {
    if (this.tabSelected < 4 && this.tabSelected > 0) {
      this.tabSelected++;
    }
  }
  update() {
    this.isVisible = false;
  }
  updateTabSelected(tab: number) {
    this.tabSelected = tab;
  }
  createNotification(type: string): void {
    this.notification.create(
      type,
      'Product Created Successfully',
      'Product Id: 1171',
      { nzPlacement: 'bottomRight', nzDuration: 3000 }
    );
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }

  openViewModal(data) {
    this.viewProduct = true;
    console.log(data);
  }
  editModal(tabNumber: number) {
    this.tabSelected = tabNumber;
    this.viewProduct = false;
    this.isVisible = true;
    this.isEdit = true;
  }
  openGridModal() {
    this.isGridModal = true;
    this.isModalVisible = true;
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

  fileList: NzUploadFile[] = [
    {
      uid: '1',
      name: 'file1.pdf',
      size: 10,
      type: 'application/pdf',
      uploading: '30%',
    },
    {
      uid: '2',
      name: 'file2.txt',
      size: 20,
      type: 'text/plain',
      uploading: '100%',
    },
  ];

  handleChange(event): void {
    this.fileList = [...event.fileList];
  }

  handleDelete(file: NzUploadFile): void {
    this.fileList = this.fileList.filter((f) => f.uid !== file.uid);
  }

  bulkActive() {
    console.log();
  }
  bulkInactive() {
    console.log();
  }

  // API methods

  getProductList() {
    this.productService.getProductList().subscribe((data) => {
      if (data.statuscode === 200) {
        this.listOfData = data.data;
      }
    });
    this.pageSizeChange(this.pageSize);
  }
}
