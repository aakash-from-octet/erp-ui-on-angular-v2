import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import * as fromAction from 'src/app/Project/modules/admin/user-management/store/user.action';
import * as fromSelector from 'src/app/Project/modules/admin/user-management/store/user.selector';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';
import { AppState } from 'src/app/Project/store/app.state';
import { RolesService } from '../../services/roles.service';

export interface Data {
  id: number;
  roleCode: string;
  name: string;
  createdDate: string;
  isActive;
  roleDescription: string;
  description;
  idRoles;
}
@Component({
  selector: 'app-roles-main-page',
  templateUrl: './roles-main-page.component.html',
  styleUrls: ['./roles-main-page.component.css'],
})
export class RolesMainPageComponent implements OnInit {
  getLocationList$: Subscription;
  checked = false;
  loading = true;
  indeterminate = false;
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
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
  roleForm: FormGroup;
  editRoleForm: FormGroup;
  isEditVisible = false;
  viewList;
  editRolePatch;
  isEditEnable = false;
  previewValue;
  previewEditValue;
  getRoleList$: Subscription;
  isModalVisible = false;
  States: { [key: string]: boolean } = {};
  subscription: Subscription;
  checkBoxValueUpdate = [];
  columns: string[] = ['Role Name', 'Decription', 'Role Code', 'Status'];

  newColumns: string[];
  columnMap: Map<string, string>;
  valueArray: string[];
  filterState = new Map<string, string[]>();
  searchText = '';

  errorMessage = false;
  inputRoleCode;
  roleCodeApiValue;
  constructor(
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private Service: RolesService,
    private store: Store<AppState>,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.inititalForm();
    this.getRolesListApi();
    this.inititalEditForm();
    setTimeout(() => {
      this.columnMapSet();
      this.resetFilter();
    }, 50);
  }

  columnMapSet() {
    this.columnMap = new Map();
    this.columnMap.set('name', 'Role Name');
    this.columnMap.set('roleCode', 'Role Code');
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
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required]],
      roleCode: ['', [Validators.required]],
      roleDescription: [''],
    });
  }

  inititalEditForm() {
    this.editRoleForm = this.fb.group({
      roleName: ['', [Validators.required]],
      roleCode: ['', [Validators.required]],
      roleDescription: [''],
    });
  }
  get g() {
    return this.editRoleForm.controls;
  }

  loadTableData(pageIndex: number, pageSize: number): void {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfCurrentPageData = this.listOfData.slice(startIndex, endIndex);
  }
  loadData(pageIndex: number, pageSize: number) {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfCurrentPageData = this.listOfCurrentPageData.slice(
      startIndex,
      endIndex
    );
  }
  get f() {
    return this.roleForm.controls;
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
    this.checked = listOfEnabledData.every(({ idRoles }) =>
      this.setOfCheckedId.has(idRoles)
    );
    this.indeterminate =
      listOfEnabledData.some(({ idRoles }) =>
        this.setOfCheckedId.has(idRoles)
      ) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.setCheckBox(id, checked);
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

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ idRoles }) => {
      this.setCheckBox(idRoles, checked);
    });
    this.refreshCheckedStatus();
  }

  // view and location starts
  viewRole(data) {
    this.viewRoleModel = true;
    this.viewList = [data];
  }
  editRoles(data) {
    this.tabSelected = 1;
    this.editRolePatch = data;
    this.isEditEnable = true;
    this.isEditVisible = true;
    this.editRoleForm.patchValue({
      roleName: this.editRolePatch?.name,
      roleCode: this.editRolePatch?.roleCode,
      roleDescription: this.editRolePatch?.description,
    });
  }

  onUpdateRoleApi() {
    const payload = {
      name: this.editRoleForm.controls['roleName'].value,
      roleCode: this.editRoleForm.controls['roleCode'].value,
      description: this.editRoleForm.controls['roleDescription'].value,
      isActive: true,
    };

    this.Service.updateRole(this.editRolePatch.idRoles, payload).subscribe(
      (data) => {
        if (data) {
          this.createNotification(
            'success',
            'Role Details Updated Sucessfully'
          );
          this.roleForm.reset();
          this.Service.getRole().subscribe((data) => {
            this.store.dispatch(
              fromAction.getRoleListSuccess({ getRole: data })
            );
          });
        }
      }
    );
  }

  closeEdit() {
    this.isEditVisible = false;
  }
  Cancel() {
    this.isModalVisible = false;
  }
  // view and location end
  openGridModal() {
    this.isGridModal = true;
    this.isModalVisible = true;
  }

  showModal(create: number) {
    this.tabSelected = create;
    this.isVisible = true;
    this.isEditEnable = false;
    this.roleForm.reset();
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
        this.previewValue = this.roleForm.value;
        this.previewEditValue = this.editRoleForm.value;
      }
    }
  }

  onCreateRole() {
    this.isEditEnable = false;
    const payload = {
      name: this.roleForm.controls['roleName'].value,
      roleCode: this.roleForm.controls['roleCode'].value,
      description: this.roleForm.controls['roleDescription'].value,
      isActive: true,
    };

    this.Service.createRole(payload).subscribe((data) => {
      if (data) {
        this.createNotification('success', 'Role Details Created Sucessfully');
        this.roleForm.reset();
        this.Service.getRole().subscribe((data) => {
          this.store.dispatch(fromAction.getRoleListSuccess({ getRole: data }));
        });
      }
    });
  }

  createNotification(type: string, data): void {
    this.notification.create(type, data, '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
    setTimeout(() => {
      this.isVisible = false;
      this.isEditVisible = false;
    }, 2000);
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

  handleCancel() {
    this.isVisible = false;
    this.viewRoleModel = false;
    this.isGridModal = false;
    this.isEditVisible = false;
    this.roleForm.reset();
    this.editRoleForm.reset();
  }

  handleOk() {
    this.isEditVisible = false;
    this.isVisible = false;
    this.viewRoleModel = false;
    this.isGridModal = false;
    this.isModalVisible = false;
  }

  getRolesListApi() {
    this.Service.getRole().subscribe((data) => {
      if (data) {
        this.store.dispatch(fromAction.getRoleListSuccess({ getRole: data }));
        this.getRoleList$ = this.store
          .select(fromSelector.getRoleList)
          .subscribe((res) => {
            if (res) {
              this.listOfData = res['data'];
              for (const column of this.columns) {
                this.States[column] = true;
              }
              this.totalItems = this.listOfData.length;
            }
            this.pageSizeChange(this.pageSize);
          });
      }
    });
    this.totalItems = this.listOfData.length;
    this.loadTableData(this.currentPageIndex, this.pageSize); // Pass both pageIndex and pageSize
  }

  onStatusChange(data) {
    if (data.isActive === true) {
      const tableId = data.idRoles;
      this.Service.activeToInActive(tableId).subscribe(() => {
        this.getRolesListApi();
      });
    } else {
      const tableId = data.idRoles;
      this.Service.inactiveToActive(tableId).subscribe(() => {
        this.getRolesListApi();
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
          this.getRolesListApi();
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
          this.getRolesListApi();
          this.refreshCheckedStatus();
          this.checkBoxValueUpdate = [];
        }
      }
    );
  }

  onFocusOutEvent(event) {
    this.inputRoleCode = event?.target?.value;
    this.Service.getRoleCodeError(event?.target?.value).subscribe((data) => {
      this.roleCodeApiValue = data?.data?.roleCode;
      if (data?.data?.roleCode === this.inputRoleCode) {
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
      ev.target.value != this.roleCodeApiValue
    ) {
      this.errorMessage = false;
    }
  }
}
