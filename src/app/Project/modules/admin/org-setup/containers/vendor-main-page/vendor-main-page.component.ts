import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';
import { AppState } from 'src/app/Project/store/app.state';
import { vendorService } from '../../services/vendors.services';
import * as fromAction from '../../store/orgsetup.action';
import * as fromSelector from '../../store/orgsetup.selectors';

import { UiCommonService } from 'src/app/Project/shared/services/ui-common/ui-common.service';

// interface
export interface Data {
  id: number;
  orgname: string;
  vendorCode: string;
  url: string;
  name: string;
  createdDate: string;
  isActive;
  contactInfo;
  vendorType;
}

@Component({
  selector: 'app-vendor-main-page',
  templateUrl: './vendor-main-page.component.html',
  styleUrls: ['./vendor-main-page.component.css'],
})
export class VendorMainPageComponent implements OnInit {
  inputVendorValue: string;
  isVisible = false;
  viewOrganisation = false;
  isEdit = false;
  inputValue = 1;
  avatarUrl?: string;
  loading = false;
  tabSelected = 1;
  isGridModal = false;
  vendorForm: FormGroup;
  logopath: string;
  tableDataValue;
  editPatchValue;
  isReadOnly = true;
  savedData;
  previewValue;
  isModalVisible = false;
  States: { [key: string]: boolean } = {};
  //table values and methods
  checked = false;
  indeterminate = false;
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<number>();
  totalItems = 0;
  pageSize = 10;
  currentPageIndex = 1;
  filteredData;
  checkBoxValueUpdate = [];
  columns: string[] = [
    'Vendor Name',
    'Vendor Code',
    'Vendor Type',
    'Primary Email',
    'Primary Contact',
    'Status',
  ];
  newColumns: string[];
  columnMap: Map<string, string>;
  valueArray: string[];
  filterState = new Map<string, string[]>();
  searchText = '';

  options = [
    { label: 'MOLD MAKER', value: 'MOLD MAKER' },
    { label: 'CONVERTER', value: 'CONVERTER' },
    { label: ' OTHERS', value: 'OTHERS' },
  ];
  getVendorList$: Subscription;
  vendorList;
  ischecked = true;
  subscription: Subscription;
  selectedValue: string;
  updateShow = false;
  inputVendorCode;
  errorMessage = false;
  VendorCodeCheck;
  vendorCodeApiValue;
  getLogo: string;
  uploadFile: File;
  isSmallScreen: boolean = false;
  var_bulkupload: boolean = false;
  bulkStep: number = 0;
  bulklistOfData = [
    {
      key: '1',
      error: true,
    },
    {
      key: '2',
      error: false,
    },
    {
      key: '3',
      error: true,
    },
    {
      key: '4',
      error: false,
    },
    {
      key: '5',
      error: true,
    },
    {
      key: '6',
      error: false,
    },
  ];

  constructor(
    private msg: NzMessageService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private vendorService: vendorService,
    private store: Store<AppState>,
    private router: Router,
    private utilityService: UtilityService,
    private uiService: UiCommonService
  ) {}

  ngOnInit() {
    this.inititalForm();
    this.onGetVendorList();
    setTimeout(() => {
      this.columnMapSet();
      this.resetFilter();
    }, 200);
    this.uiService.getWindowWidth().subscribe((width) => {
      this.isSmallScreen = width < 992;
    });
  }

  columnMapSet() {
    this.columnMap = new Map();
    this.columnMap.set('name', 'Vendor Name');
    this.columnMap.set('vendorCode', 'Vendor Code');
    this.columnMap.set('vendorType', 'Vendor Type');
    this.columnMap.set('contactInfo.email', 'Primary Email');
    this.columnMap.set('contactInfo.mobile', 'Primary Contact');
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
    this.setCheckBox(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) => {
      this.setCheckBox(id, checked);
    });
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

  onGetVendorList() {
    this.vendorService.getVendorList().subscribe((data) => {
      if (data) {
        this.store.dispatch(
          fromAction.getVendorListSuccess({ getvendor: data })
        );
        this.getVendorList$ = this.store
          .select(fromSelector.getVendorList)
          .subscribe((res) => {
            if (res) {
              this.listOfData = res['data'];
              this.totalItems = this.listOfData.length;
            }
          });
        this.pageSizeChange(this.pageSize);
      }
    });
  }

  onStatusChange(data) {
    if (data.isActive == true) {
      const tableId = data.id;
      this.vendorService.activeToInActive(tableId).subscribe(() => {
        this.onGetVendorList();
      });
    } else {
      const tableId = data.id;
      this.vendorService.inactiveToActive(tableId).subscribe(() => {
        this.onGetVendorList();
      });
    }
  }

  inititalForm() {
    this.vendorForm = this.fb.group({
      logo: '',
      vendorName: ['', Validators.required],
      vendorType: ['', Validators.required],
      vendorCode: ['', Validators.required],
      userName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      // emailId: ['',[Validators.required,Validators.pattern('^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,4}$')]],
      emailId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,4}$'),
        ],
      ],
      addressOne: ['', Validators.required],
      addressTwo: [''],
      city: ['', Validators.required],
      pinCode: ['', Validators.required],
      State: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  get f() {
    return this.vendorForm.controls;
  }

  showModal(create: number) {
    this.vendorForm.reset();
    this.tabSelected = create;
    this.isVisible = true;
    this.isEdit = false;
    this.vendorForm?.get('vendorCode')?.enable();
  }
  handleCancel() {
    this.isVisible = false;
    this.viewOrganisation = false;
    this.isGridModal = false;
    this.updateShow = false;
    this.vendorForm.reset();
    this.getLogo = null;
    this.var_bulkupload = false;
  }
  handleOk() {
    this.isModalVisible = false;
    this.isVisible = false;
    this.viewOrganisation = false;
    this.var_bulkupload = false;
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

  onFocusOutEvent(event) {
    this.inputVendorValue;
    this.VendorCodeCheck;
    this.inputVendorCode = event?.target?.value;
    this.vendorService
      .getVendorCodeError(event?.target?.value)
      .subscribe((data) => {
        this.vendorCodeApiValue = data?.data?.vendorCode;
        if (data.data.vendorCode == this.inputVendorCode) {
          this.errorMessage = true;
        } else {
          this.errorMessage = false;
        }
      });
    this.errorMessage = false;
  }

  updateTabSelected(tab: number) {
    this.tabSelected = tab;
  }

  onInput(ev) {
    if (
      ev.target.value.length == 0 ||
      ev.target.value != this.vendorCodeApiValue
    ) {
      this.errorMessage = false;
    }
  }

  openViewModal(data) {
    this.getLogoApi(data?.id);
    this.tableDataValue = data;
    this.viewOrganisation = true;
    this.vendorService.getByIdView(data?.id).subscribe((data) => {
      if (data) {
        this.tableDataValue = data?.data;
      }
    });
  }
  editModal(tabNumber: number, editValue) {
    this.getLogoApi(editValue?.id);
    this.editPatchValue = editValue;
    this.tabSelected = tabNumber;
    this.viewOrganisation = false;
    this.isVisible = true;
    this.isEdit = true;
    this.updateShow = true;
    this.inputVendorValue = this.editPatchValue?.vendorCode;
    this.vendorForm?.get('vendorCode')?.disable();
    if (this.editPatchValue) {
      this.vendorForm.patchValue({
        logo: '',
        vendorType: this.editPatchValue?.vendorType,
        vendorCode: this.editPatchValue?.vendorCode,
        vendorName: this.editPatchValue?.name,
        // isActive:true,
        userName: this.editPatchValue['contactInfo']?.name,
        contactNumber: this.editPatchValue?.contactInfo?.mobile,
        emailId: this.editPatchValue?.contactInfo?.email,
        addressOne: this.editPatchValue?.addressInfo?.addressLine1,
        addressTwo: this.editPatchValue?.addressInfo?.addressLine2,
        pinCode: this.editPatchValue?.addressInfo?.zipCode,
        State: this.editPatchValue?.addressInfo?.state,
        country: this.editPatchValue?.addressInfo?.country,
        city: this.editPatchValue?.addressInfo?.city,
      });
    }
  }
  openGridModal() {
    this.isGridModal = true;
    this.isModalVisible = true;
  }

  // tab changeing one compoent to another ccomponent example vendor details to contact details
  saveContinue() {
    if (this.tabSelected < 3 && this.tabSelected > 0) {
      this.tabSelected++;
      if (this.tabSelected == 3) {
        // this.isEdit=false
        this.previewValue = this.vendorForm.value;
      }
    }
  }

  // back button
  back() {
    if (this.tabSelected <= 3 && this.tabSelected > 1) {
      this.tabSelected--;
    }
  }

  // create vendor Api
  createVendorApi() {
    if (this.vendorForm.valid) {
      const payload = {
        // logo: this.logopath == null ? 'test.png' : this.logopath,
        logo: '',
        vendorType:
          this.vendorForm.controls['vendorType'].value == null
            ? 'MOLD'
            : this.vendorForm.controls['vendorType'].value,
        vendorCode:
          this.vendorForm.controls['vendorCode'].value == null
            ? '12345'
            : this.vendorForm.controls['vendorCode'].value,
        name: this.vendorForm.controls['vendorName'].value,
        isActive: true,
        contactInfo: {
          name: this.vendorForm.controls['userName'].value,
          mobile: this.vendorForm.controls['contactNumber'].value,
          email: this.vendorForm.controls['emailId'].value,
        },
        addressInfo: {
          addressLine1: this.vendorForm.controls['addressOne'].value,
          addressLine2: this.vendorForm.controls['addressTwo'].value,
          city: this.vendorForm.controls['city'].value,
          zipCode: this.vendorForm.controls['pinCode'].value,
          state: this.vendorForm.controls['State'].value,
          country: this.vendorForm.controls['country'].value,
        },
      };

      this.vendorService
        .uploadLogo(payload, this.uploadFile)
        .subscribe((data) => {
          if (data.statuscode == 201) {
            this.createNotification('success', data);
            this.savedData = data;
            this.vendorForm.reset();
            this.vendorService.getVendorList().subscribe((data) => {
              this.store.dispatch(
                fromAction.getVendorListSuccess({ getvendor: data })
              );
            });
            // this.updateShow = false;
            this.isVisible = false;
          } else {
            this.createNotification('error', data);
          }
        });
    }
  }

  // vendor update Api
  update() {
    if (this.tabSelected == 3 && this.tabSelected > 0 && this.updateShow) {
      // this.tabSelected++;true
      if (this.tabSelected === 3) {
        this.isEdit = false;
        // this.previewValue=this.vendorForm.value
      }
      if (this.vendorForm.valid) {
        const payload = {
          id: this.editPatchValue?.id,
          // logo: this.logopath===null?'test_logoPath':this.logopath,
          logo: '',
          vendorType: this.vendorForm.controls['vendorType'].value,
          vendorCode: this.vendorForm.controls['vendorCode'].value,
          name: this.vendorForm.controls['vendorName'].value,
          isActive: true,
          contactInfo: {
            name: this.vendorForm.controls['userName'].value,
            mobile: this.vendorForm.controls['contactNumber'].value,
            email: this.vendorForm.controls['emailId'].value,
          },
          addressInfo: {
            addressLine1: this.vendorForm.controls['addressOne'].value,
            addressLine2: this.vendorForm.controls['addressTwo'].value,
            city: this.vendorForm.controls['city'].value,
            zipCode: this.vendorForm.controls['pinCode'].value,
            state: this.vendorForm.controls['State'].value,
            country: this.vendorForm.controls['country'].value,
          },
        };
        if (this.editPatchValue?.id) {
          this.vendorService
            .updateVendorList(payload, this.editPatchValue.id, this.uploadFile)
            .subscribe((data) => {
              if (data) {
                this.createNotification('success', data);
                this.vendorService.getVendorList().subscribe((data) => {
                  this.store.dispatch(
                    fromAction.getVendorListSuccess({ getvendor: data })
                  );
                });
                // this.createNotification(data,'success');
                this.updateShow = false;
                this.isVisible = false;
                this.vendorForm.reset();
              } else {
                this.isVisible = true;
                this.updateShow = true;
              }
            });
        }
      }
    }
  }

  // notification method
  createNotification(type, data): void {
    this.notification.create(
      type,
      data.message,
      'vendor code: ' + data['data'].vendorCode,
      { nzPlacement: 'bottomRight', nzDuration: 3000 }
    );
    setTimeout(() => {
      // this.isVisible = false;
    }, 2000);
  }

  cancel() {
    this.isModalVisible = false;
    this.var_bulkupload = false;
    this.resetFilter();
  }
  resetFilter() {
    for (const column of this.newColumns) {
      this.States[column] = true;
    }
    this.searchText = '';
    this.filterState = new Map<string, string[]>();
    this.loadTableData(this.currentPageIndex, this.pageSize);
  }

  // redirect to create facility
  redirectToCreateFacility(data): void {
    // Navigate to the "Create Facility" component along with the current data
    this.router.navigate(['home/admin/facilities'], {
      queryParams: { id: data },
    });
  }
  bulkActive() {
    this.vendorService
      .bulkActionActive(this.checkBoxValueUpdate)
      .subscribe((data) => {
        if (data) {
          this.onGetVendorList();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.checkBoxValueUpdate = [];
          this.refreshCheckedStatus();
        }
      });
  }
  bulkInactive() {
    this.vendorService
      .bulkActionDeActive(this.checkBoxValueUpdate)
      .subscribe((data) => {
        if (data) {
          this.onGetVendorList();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.checkBoxValueUpdate = [];
          this.refreshCheckedStatus();
        }
      });
  }

  convertToXLSX(paradata): void {
    const header = Object.keys(paradata[0]);
    const rows = paradata.map((obj) => header.map((key) => obj[key]));
    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join(
      '\n'
    );
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'VendorsDetails.xlsx';
    link.click();
  }

  convertToJSON() {
    const filteredData = this.listOfCurrentPageData?.map((item) => {
      return {
        ID: item?.id,
        Vendors_NAME: item?.name || '',
        Vendors_CODE: item?.vendorCode || '',
        Type: item?.vendorType || '',
        Primary_Email: item?.contactInfo?.email || '',
        Primary_Contact: item?.contactInfo?.mobile || '',
        STATUS: (item?.isActive === true ? 'active' : 'inactive') || '',
      };
    });
    this.convertToXLSX(filteredData);
  }

  getLogoApi(id) {
    this.vendorService.getLogo(id).subscribe((data) => {
      if (data) {
        const logopath = data;
        this.getLogo = logopath;
      }
    });
  }

  openBulkUpload() {
    this.var_bulkupload = true;
  }
  onIndexChange(event: number): void {
    this.bulkStep = event;
  }
  var_notification: boolean = false;
  continueNotification() {
    this.var_notification = !this.var_notification;
  }
}
