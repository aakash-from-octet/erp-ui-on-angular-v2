import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';
import { AppState } from 'src/app/Project/store/app.state';
import { CategoryService } from '../../services/category.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
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
  editCategoryForm: FormGroup;
  CategoryForm: FormGroup;
  isEditVisible = false;
  viewList;
  editCategoryPatch;
  isEditEnable = false;
  previewValue;
  previewEditValue;
  getRoleList$: Subscription;
  restofData;
  checkBoxValueUpdate = [];
  subscription: Subscription;
  States: { [key: string]: boolean } = {};
  columns: string[] = [
    'Category Name',
    'Category Code',
    'Parent Category',
    'Description',
    'Status',
  ];

  newColumns: string[];
  columnMap: Map<string, string>;
  valueArray: string[];
  filterState = new Map<string, string[]>();
  searchText = '';

  inputCategoryCode;
  errorMessage: boolean;
  categoryCodeApiValue;
  constructor(
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private Service: CategoryService,
    private store: Store<AppState>,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.inititalForm();
    this.getCategoryListApi();
    this.inititalEditForm();

    setTimeout(() => {
      this.columnMapSet();
      this.resetFilter();
    }, 200);
  }

  inititalForm() {
    this.CategoryForm = this.fb.group({
      CategoryName: ['', [Validators.required]],
      CategoryCode: ['', [Validators.required]],
      ParentCategory: [''],
      CategoryDescription: [''],
    });
  }

  inititalEditForm() {
    this.editCategoryForm = this.fb.group({
      CategoryName: ['', [Validators.required]],
      CategoryCode: ['', [Validators.required]],
      ParentCategory: ['', [Validators.required]],
      CategoryDescription: [''],
    });
  }
  get f() {
    return this.CategoryForm.controls;
  }

  columnMapSet() {
    this.columnMap = new Map();
    this.columnMap.set('name', 'Category Name');
    this.columnMap.set('code', 'Category Code');
    this.columnMap.set('description', 'Description');
    this.columnMap.set('parentCategory.name', 'Parent Category');
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

  loadTableData(pageIndex: number, pageSize: number): void {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfCurrentPageData = this.listOfData?.slice(startIndex, endIndex);
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
    this.setCheckBox(id, checked);
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
  viewCategory(data) {
    this.viewRoleModel = true;
    this.viewList = [data];
    this.isEditEnable = true;
    this.isEdit = true;
  }
  editCategory(data) {
    this.tabSelected = 1;
    this.editCategoryPatch = data;
    this.isEditEnable = true;
    this.isEditVisible = true;
    this.isEdit = false;
    this.getCategoryListExcludingCurrentCategoryApi();

    this.CategoryForm.patchValue({
      CategoryName: this.editCategoryPatch?.name,
      CategoryCode: this.editCategoryPatch?.code,
      ParentCategory: this.editCategoryPatch?.ParentCategory?.name,
      CategoryDescription: this.editCategoryPatch?.description,
    });
  }

  onUpdateCategoryApi() {
    const payload = {
      name: this.CategoryForm.controls['CategoryName'].value,
      code: this.CategoryForm.controls['CategoryCode'].value,
      parentId: this.CategoryForm.controls['ParentCategory'].value,
      description: this.CategoryForm.controls['CategoryDescription'].value,
      isActive: true,
    };

    this.Service.updateCategory(this.editCategoryPatch.id, payload).subscribe(
      (data) => {
        if (data.statuscode === 200) {
          this.updateNotification(
            'success',
            'Category Details updates Sucessfully'
          );
          this.CategoryForm.reset();
          this.getCategoryListApi();
          this.isVisible = false;
          this.isEditVisible = false;
        }
      }
    );
  }

  closeEdit() {
    this.isEditVisible = false;
    this.restofData = null;
  }

  // view and location end
  openGridModal() {
    this.isGridModal = true;
  }
  Cancel() {
    this.isGridModal = false;
  }
  showModal(create: number) {
    this.tabSelected = create;
    this.isVisible = true;
    this.isEditEnable = false;
    this.restofData = this.listOfData;
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
        this.previewValue = this.CategoryForm.value;
        this.previewEditValue = this.editCategoryForm.value;
      }
    }
  }

  onCreateCategory() {
    this.isEditEnable = false;
    const payload = {
      name: this.CategoryForm.controls['CategoryName'].value,
      code: this.CategoryForm.controls['CategoryCode'].value,
      parentId: this.CategoryForm.controls['ParentCategory'].value,
      description: this.CategoryForm.controls['CategoryDescription'].value,
      isActive: true,
    };

    this.Service.createCategory(payload).subscribe((data) => {
      if (data) {
        this.createNotification('success');
        this.CategoryForm.reset();
        this.getCategoryListApi();
      }
    });
  }

  createNotification(type: string): void {
    this.notification.create(type, 'Category Created Successfully', '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }

  updateNotification(type: string, data): void {
    this.notification.create(type, data, '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
  }
  update() {
    this.isVisible = false;
  }

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

  handleCancel() {
    this.isVisible = false;
    this.viewRoleModel = false;
    this.isGridModal = false;
    this.isEditVisible = false;
    this.restofData = null;
    this.editCategoryForm.reset();
    this.CategoryForm.reset();
  }

  handleOk() {
    this.isVisible = false;
    this.viewRoleModel = false;
    this.isGridModal = false;
    this.isEditVisible = false;
  }

  getCategoryListApi() {
    this.Service.getCategory().subscribe((data) => {
      if (data) {
        this.listOfData = data['data'];
        this.totalItems = this.listOfData.length;
        //this.loadTableData(this.currentPageIndex, this.pageSize);
        this.listOfCurrentPageData = this.listOfData;
        this.totalItems = this.listOfData.length;
        this.pageSizeChange(this.pageSize);
      }
    });
    this.pageSizeChange(this.pageSize);
  }

  getCategoryListExcludingCurrentCategoryApi() {
    this.Service.getCategoryExcludingCurrentCategory(
      this.editCategoryPatch.id
    ).subscribe((data) => {
      if (data) {
        this.restofData = data['data'];
        this.totalItems = this.restofData.length;
      }
    });
  }
  onStatusChange(data) {
    if (data.isActive === true) {
      const tableId = data.id;
      this.Service.activeToInActive(tableId).subscribe(() => {
        this.getCategoryListApi();
      });
    } else {
      const tableId = data.id;
      this.Service.inactiveToActive(tableId).subscribe(() => {
        this.getCategoryListApi();
      });
    }
  }

  resetFilter() {
    for (const column of this.columns) {
      this.States[column] = true;
    }
    this.searchText = '';
    this.filterState = new Map<string, string[]>();
    this.loadTableData(this.currentPageIndex, this.pageSize);
  }

  bulkActive() {
    this.Service.bulkActionActive(this.checkBoxValueUpdate).subscribe(
      (data) => {
        if (data) {
          this.getCategoryListApi();
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
          this.getCategoryListApi();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.refreshCheckedStatus();
          this.checkBoxValueUpdate = [];
        }
      }
    );
  }

  // category error message api
  onFocusOutEvent(event) {
    this.inputCategoryCode = event?.target?.value;
    this.Service.getCategoryCodeError(event?.target?.value).subscribe(
      (data) => {
        this.categoryCodeApiValue = data?.data?.code;
        if (data?.data?.code === this.inputCategoryCode) {
          this.errorMessage = true;
        } else {
          this.errorMessage = false;
        }
      }
    );
    this.errorMessage = false;
  }
  onInput(ev) {
    if (
      ev.target.value.length === 0 ||
      ev.target.value != this.categoryCodeApiValue
    ) {
      this.errorMessage = false;
    }
  }

  getLabel(id, array, value, label): string {
    const option = array?.find((option) => option?.[value] === id);
    // If an option with the provided value is found, return its label; otherwise, return an empty string
    return option ? option?.[label] : '';
  }
}
