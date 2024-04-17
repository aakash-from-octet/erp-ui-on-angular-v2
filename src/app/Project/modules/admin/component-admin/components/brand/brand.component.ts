import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';
import { AppState } from 'src/app/Project/store/app.state';
import { BrandService } from '../../services/brand.service';
export interface Data {
  id: number;
  roleCode: string;
  name: string;
  parent: string;
  createdDate: string;
  isActive;
  roleDescription: string;
  description;
}
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
})
export class BrandComponent implements OnInit {
  getLocationList$: Subscription;
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData;
  listOfCurrentPageData;
  setOfCheckedId = new Set<number>();
  totalItems = 0;
  pageSize = 10;
  isVisible = false;
  viewRoleModel = false;
  isEdit = false;
  inputValue = 1;
  avatarUrl?: string;
  tabSelected = 1;
  isGridModal = false;
  currentPageIndex = 1;
  locationPreview = false;
  editBrandForm: FormGroup;
  brandForm: FormGroup;
  isEditVisible = false;
  viewList;
  editBrandPatch;
  isEditEnable = false;
  previewValue;
  previewEditValue;
  getRoleList$: Subscription;
  restofData;
  States: { [key: string]: boolean } = {};
  subscription: Subscription;
  checkBoxValueUpdate = [];
  flag = false;
  columns: string[] = [
    'Brand Name',
    'Brand Code',
    'Parent Brand',
    'Description',
    'Status',
  ];
  searchText = '';
  getLogo: string;
  uploadFile: File;
  errorMessage = false;
  inputBrandCode;
  brandCodeApiValue;
  columnMap: Map<string, string>;
  newColumns: string[];
  filterState = new Map<string, string[]>();
  constructor(
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private Service: BrandService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private utilityService: UtilityService
  ) {
    for (const column of this.columns) {
      this.States[column] = true;
    }
  }
  actions = [
    { title: 'Action 1', description: 'Lorem ipsum is a dummy text' },
    { title: 'Action 2', description: 'Another dummy text' },
    { title: 'Action 3', description: 'Another ipsum is a dummy text' },
    { title: 'Action 4', description: 'Another dummy text' },
  ];

  ngOnInit() {
    this.inititalForm();
    this.getBrandListApi();
    //this.inititalEditForm();
    setTimeout(() => {
      this.columnMapSet();
      this.resetFilter();
    }, 200);
  }
  columnMapSet() {
    this.columnMap = new Map();
    this.columnMap.set('name', 'Brand Name');
    this.columnMap.set('code', 'Brand Code');
    this.columnMap.set('parentBrand.name', 'Parent Brand');
    this.columnMap.set('description', 'Description');
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
  inititalForm() {
    this.brandForm = this.fb.group({
      BrandLogo: [''],
      BrandName: ['', [Validators.required]],
      BrandCode: ['', [Validators.required]],
      ParentBrand: [''],
      BrandDescription: [''],
    });
  }
  get f() {
    return this.brandForm.controls;
  }
  inititalEditForm() {
    this.editBrandForm = this.fb.group({
      BrandName: ['', [Validators.required]],
      BrandCode: ['', [Validators.required]],
      ParentBrand: ['', [Validators.required]],
      BrandDescription: [''],
    });
  }

  resetFilter() {
    for (const column of this.columns) {
      this.States[column] = true;
    }
    this.searchText = '';
    this.filterState = new Map<string, string[]>();
    this.loadTableData(this.currentPageIndex, this.pageSize);
  }
  loadTableData(pageIndex: number, pageSize: number): void {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfData = this.utilityService.getData();
    this.listOfCurrentPageData = this.listOfData?.slice(startIndex, endIndex);
  }

  loadData(pageIndex: number, pageSize: number) {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfCurrentPageData = this.listOfCurrentPageData?.slice(
      startIndex,
      endIndex
    );
  }
  Cancel() {
    this.isGridModal = false;
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
    // this.checkBoxValueUpdate.push(id);
    this.setCheckBox(id, checked);

    // this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) =>
      // this.updateCheckedSet(id, checked)
      this.setCheckBox(id, checked)
    );
    this.refreshCheckedStatus();
  }

  setCheckBox(id: number, checked: boolean): void {
    if (checked) {
      this.checkBoxValueUpdate.push(id);
    } else {
      const index = this.checkBoxValueUpdate.indexOf(id);
      if (index !== -1) {
        this.checkBoxValueUpdate.splice(index, 1);
      }
    }
    this.updateCheckedSet(id, checked);
  }

  // view and location starts
  viewBrand(data) {
    this.getLogoApi(data?.id);
    this.viewRoleModel = true;
    this.viewList = [data];
    this.isEditEnable = true;
    this.isEdit = true;
  }
  editBrand(data) {
    this.tabSelected = 1;
    this.editBrandPatch = data;
    this.getLogoApi(data?.id);
    this.isEditEnable = true;
    this.isEditVisible = true;
    this.isEdit = false;
    this.getBrandListExcludingCurrentBrandApi();

    this.brandForm.patchValue({
      BrandName: this.editBrandPatch?.name,
      BrandCode: this.editBrandPatch?.code,
      ParentBrand: this.editBrandPatch?.ParentBrand?.name,
      BrandDescription: this.editBrandPatch?.description,
    });
  }

  onUpdateBrandApi() {
    const payload = {
      name: this.brandForm.controls['BrandName'].value,
      code: this.brandForm.controls['BrandCode'].value,
      parentId: this.brandForm.controls['ParentBrand'].value,
      description: this.brandForm.controls['BrandDescription'].value,
      isActive: true,
    };

    this.Service.updateBrand(this.editBrandPatch.id, payload).subscribe(
      (data) => {
        if (data) {
          this.updateNotification('success');
          this.getBrandListApi();
          this.brandForm.reset();
        }
      }
    );
    this.isEditVisible = false;
    this.viewRoleModel = false;
  }

  closeEdit() {
    this.isEditVisible = false;
  }

  // view and location end
  openGridModal() {
    this.isGridModal = true;
  }

  showModal(create: number) {
    this.tabSelected = create;
    this.isVisible = true;
    this.isEditEnable = false;
    this.errorMessage = false;
    this.restofData = this.listOfData;
    this.brandForm.reset();
    this.editBrandForm.reset();
  }

  openViewModal() {
    this.viewRoleModel = true;
  }

  updateTabSelected(tab: number) {
    this.tabSelected = tab;
  }

  back() {
    this.tabSelected = 1;
  }

  saveContinue() {
    if (this.tabSelected < 2 && this.tabSelected > 0) {
      this.tabSelected++;
      if (this.tabSelected === 2) {
        this.previewValue = this.brandForm.value;
        this.previewEditValue = this.editBrandForm.value;
      }
    }
  }

  onCreateBrand() {
    this.isEditEnable = false;
    const payload = {
      name: this.brandForm.controls['BrandName'].value,
      code: this.brandForm.controls['BrandCode'].value,
      parentId: this.brandForm.controls['ParentBrand'].value,
      description: this.brandForm.controls['BrandDescription'].value,
      isActive: true,
    };

    // this.Service.createBrand(payload).subscribe((data) => {
    //   if (data?.statuscode == 201) {
    //     this.createNotification('success');
    //     this.brandForm.reset();
    //     this.Service.getBrand().subscribe((data) => {

    //     });
    //   }
    // });
    this.Service.uploadLogo(payload, this.uploadFile).subscribe((data) => {
      if (data.statuscode === 201) {
        this.createNotification('success');
        this.brandForm.reset();
        this.getBrandListApi();
      } else {
        this.createNotification('error');
      }
    });
  }

  createNotification(type: string): void {
    this.notification.create(type, 'Brand Created Successfully', '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }

  updateNotification(type: string): void {
    this.notification.create(type, 'Brand updated Successfully', '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }
  update() {
    this.isVisible = false;
  }

  handleChange(info: { file: NzUploadFile }): void {
    this.uploadFile = info.file.originFileObj;
    if (info.file && info.file.originFileObj) {
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.getLogo = img;
      });
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

  handleCancel() {
    this.isVisible = false;
    this.viewRoleModel = false;
    this.isGridModal = false;
    this.isEditVisible = false;
    this.getLogo = '';
    this.brandForm.reset();
    this.editBrandForm.reset();
  }

  handleOk() {
    this.isVisible = false;
    this.viewRoleModel = false;
    this.isGridModal = false;
    this.isEditVisible = false;
  }

  getBrandListApi() {
    this.Service.getBrand().subscribe((data) => {
      if (data) {
        this.listOfData = data['data'];
        this.totalItems = data['data']?.length;
        this.listOfCurrentPageData = this.listOfData;
        this.utilityService.setData(this.listOfData);
        this.pageSizeChange(this.pageSize);
      }
    });
  }

  getBrandListExcludingCurrentBrandApi() {
    this.Service.getBrandExcludingCurrentBrand(
      this.editBrandPatch.id
    ).subscribe((data) => {
      if (data) {
        /*this.store.dispatch(
          fromAction.getRoleListSuccess({ getRole: data })
        );*/
        this.restofData = data['data'];
        //for(let i in this.restofData.length)
        this.totalItems = this.restofData.length;
        //this.loadTableData(this.currentPageIndex, this.pageSize);
      }
    });
  }
  onStatusChange(data) {
    if (data.isActive === true) {
      const tableId = data.id;
      this.Service.activeToInActive(tableId).subscribe(() => {
        this.getBrandListApi();
      });
    } else {
      const tableId = data.id;
      this.Service.inactiveToActive(tableId).subscribe(() => {
        this.getBrandListApi();
      });
    }
  }

  bulkActive() {
    this.Service.bulkActionActive(this.checkBoxValueUpdate).subscribe(
      (data) => {
        if (data) {
          this.getBrandListApi();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.refreshCheckedStatus();
          this.checkBoxValueUpdate = [];
        }
      }
    );
  }
  bulkInactive() {
    this.Service.bulkActionDeActive(this.checkBoxValueUpdate).subscribe(
      (data) => {
        if (data) {
          this.getBrandListApi();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.refreshCheckedStatus();
          this.checkBoxValueUpdate = [];
        }
      }
    );
  }

  getLogoApi(id) {
    this.Service.getLogo(id).subscribe((data) => {
      const getLogoImage = 'data:image/jpg;base64' + ',' + data;
      this.getLogo = getLogoImage;
    });
  }

  // brand error message api
  onFocusOutEvent(event) {
    this.inputBrandCode = event?.target?.value;
    this.Service.getBrandCodeError(event?.target?.value).subscribe((data) => {
      this.brandCodeApiValue = data?.data?.code;
      if (data?.data?.code === this.inputBrandCode) {
        this.errorMessage = true;
      } else {
        this.errorMessage = false;
      }
    });
    this.errorMessage = false;
  }
  onInput(ev) {
    if (
      ev.target.value.length === 0 ||
      ev.target.value != this.brandCodeApiValue
    ) {
      this.errorMessage = false;
    }
  }

  getLabel(id, array, value, label): string {
    const option = array.find((option) => option?.[value] === id);
    // If an option with the provided value is found, return its label; otherwise, return an empty string
    return option ? option?.[label] : '';
  }
}
