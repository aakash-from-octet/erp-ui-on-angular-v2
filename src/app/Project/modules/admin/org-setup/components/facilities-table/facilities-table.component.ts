import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';

import { UiCommonService } from 'src/app/Project/shared/services/ui-common/ui-common.service';
import { regex } from 'src/environments/environment.development';
import { FacilitiesService } from '../../services/facilities.service';
import { vendorService } from '../../services/vendors.services';

export interface Data {
  facilityName: string;
  orgCode: string;
  domainUrl: string;
  name: string;
  contactAddress;
  email;
  mobile;
  contactInfo;
  status;
}

@Component({
  selector: 'app-facilities-table',
  templateUrl: './facilities-table.component.html',
  styleUrls: ['./facilities-table.component.css'],
})
export class FacilitiesTableComponent implements OnInit {
  isVisible = false;
  viewFacility = false;
  isEdit = false;
  inputValue = 1;
  avatarUrl?: string;
  loading = false;
  tabSelected = 1;
  isReadOnly = true;
  tableDataValue;
  previewValue;
  facilityForm: FormGroup;
  listOfCurrentPageData = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  totalItems = 0;
  pageSize = 10;
  currentPageIndex = 1;
  facilityList;
  fnOrg = 'ORG';
  selectFacilityType = [];
  facilitySelectedValue;
  locationList;
  vendorList = [];
  editFacilityPatch;
  editFacilityId;
  editContactId;
  editAddressId;
  // orgFacilityList;
  selectVendor;
  vendorIdFacilityList = [];
  selectFacility = null;
  isModalVisible = false;
  subscription: Subscription;
  checkBoxValueUpdate = [];
  States: { [key: string]: boolean } = {};
  vendorDataForFacility;
  columns: string[] = [
    'Facility Name',
    'Facility Code',
    'Facility Type',
    'Facility Nature',
    'Location Name',
    'Vendor Name',
    'Cost Center',
    'Parent Facility',
    'Status',
  ];

  newColumns: string[];
  columnMap: Map<string, string>;
  valueArray: string[];
  filterState = new Map<string, string[]>();
  searchText = '';

  errorMessage = false;
  inputFacilitiesCode;
  facilitiesCodeApiValue;
  isSmallScreen = false;
  constructor(
    private msg: NzMessageService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private facilitiesService: FacilitiesService,
    private vendorService: vendorService,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private router: Router,
    private uiService: UiCommonService
  ) {}

  ngOnInit() {
    this.initialForm();
    this.ongetfacilitiesList();
    this.ongetfacilityType();
    this.ongetLocationList();
    this.ongetVendorList();
    this.ongetOrgFacility();
    // Check if the 'id' param exists and has a value
    if ('id' in this.route.snapshot.queryParams) {
      const dataId = this.route.snapshot.queryParams['id'];
      this.settingVendorId(dataId);
    }
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
    this.columnMap.set('facilityName', 'Facility Name');
    this.columnMap.set('facilityCode', 'Facility Code');
    this.columnMap.set('facilityTypes.name', 'Facility Type');
    this.columnMap.set('facilityNature', 'Facility Nature');
    this.columnMap.set('location.locationName', 'Location Name');
    this.columnMap.set('vendor.name', 'Vendor Name');
    this.columnMap.set('costCentre', 'Cost Center');
    this.columnMap.set('parentFacility.facilityName', 'Parent Facility');
    this.columnMap.set('isActive', 'Status');
    this.newColumns = [...this.columnMap.values()];
  }

  filterData(): void {
    this.currentPageIndex = 1;
    this.listOfCurrentPageData = this.utilityService.filterTable(
      this.facilityList,
      this.searchText
    );
  }

  getValueArray(keyName: string): string[] {
    return this.utilityService.getValueArray(this.facilityList, keyName);
  }

  search(searchString: string, keyName: string) {
    this.listOfCurrentPageData = this.utilityService.search(
      this.facilityList,
      searchString,
      keyName,
      this.currentPageIndex,
      this.pageSize
    );
  }

  sort(sortOrder: string, keyName: string) {
    this.listOfCurrentPageData = this.utilityService.sort(
      this.facilityList,
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
      this.facilityList,
      this.filterState,
      filterValue,
      columnName,
      this.currentPageIndex,
      this.pageSize
    );
  }

  settingVendorId(id) {
    this.showModal(1);
    this.getVendorById(id);
  }

  getVendorById(dataid) {
    if (dataid != undefined && dataid != null && dataid != '') {
      this.vendorService.getVendorById(dataid).subscribe((data) => {
        if (data.statuscode === 200) {
          this.vendorDataForFacility = data.data;
          this.facilityForm.patchValue({
            facilityNature: this.facilityNatureValues[0].value,
            vendor: this.vendorDataForFacility?.id,
          });
          this.selectVendor = this.vendorDataForFacility?.id;
        }
      });
    }
  }

  get f() {
    return this.facilityForm.controls;
  }

  ongetfacilityType() {
    this.facilitiesService.getfacilitiesType().subscribe((data) => {
      if (data) {
        this.selectFacilityType = data;
      }
    });
  }

  loadTableData(pageIndex: number, pageSize: number): void {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfCurrentPageData = this.facilityList.slice(startIndex, endIndex);
  }

  loadData(pageIndex: number, pageSize: number) {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfCurrentPageData = this.listOfCurrentPageData.slice(
      startIndex,
      endIndex
    );
  }

  initialForm() {
    this.facilityForm = this.fb.group({
      facilityName: ['', [Validators.required]],
      facilityType: ['', [Validators.required]],
      facilityCode: ['', [Validators.required]],
      facilityNature: ['', [Validators.required]],
      costCentre: [''],
      parentFacility: [''],
      vendor: [''],
      location: ['', [Validators.required]],
      contactName: ['', [Validators.required]],
      contactMobile: [
        '',
        [Validators.required, Validators.pattern(regex.mobile)],
      ],
      emailid: ['', [Validators.required, Validators.pattern(regex.email)]],
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      // orgFacility: [''],
    });
  }

  facilityNatureValues = [
    { label: 'VENDOR', value: 'VENDOR' },
    { label: 'ORG', value: 'ORG' },
  ];

  //handle modals and tab functionalities

  showModal(create: number) {
    this.tabSelected = create;
    this.isVisible = true;
  }
  pageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadTableData(this.currentPageIndex, size);
  }
  handleCancel() {
    this.isModalVisible = false;
    this.isVisible = false;
    this.viewFacility = false;
    this.facilityForm.reset();
    this.router.navigate(['home/admin/facilities']);
  }
  handleOk() {
    this.isVisible = false;
    this.viewFacility = false;
    this.isModalVisible = false;
  }
  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
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

  back() {
    if (this.tabSelected < 4 && this.tabSelected > 1) {
      this.tabSelected--;
    }
  }

  saveContinue() {
    if (this.tabSelected < 3 && this.tabSelected > 0) {
      this.tabSelected++;
      if (this.tabSelected === 3) {
        this.previewValue = this.facilityForm.value;
      }
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
  update() {
    if (this.tabSelected < 3 && this.tabSelected > 0) {
      this.tabSelected++;
      if (this.tabSelected === 3) {
        this.previewValue = this.facilityForm.value;
      }
    }
  }

  updateTabSelected(tab: number) {
    this.tabSelected = tab;
  }
  createNotification(type: string, data, message): void {
    this.notification.create(type, data?.message, message, {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
  }

  onStatusChange(data) {
    if (data.isActive === true) {
      const tableId = data.id;

      this.facilitiesService.activeToInActive(tableId).subscribe(() => {
        this.ongetfacilitiesList();
      });
    } else {
      const tableId = data.id;
      this.facilitiesService.inactiveToActive(tableId).subscribe(() => {
        this.ongetfacilitiesList();
      });
    }
  }

  openViewModal(data) {
    this.viewFacility = true;
    this.tableDataValue = data;
  }
  editModal(tabNumber: number) {
    this.tabSelected = tabNumber;
    this.isEdit = true;
    this.viewFacility = false;
    this.isVisible = true;
  }

  openGridModal() {
    this.isModalVisible = true;
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) =>
      this.updateCheckedSet(id, checked)
    );
    this.refreshCheckedStatus();
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
    this.checkBoxValueUpdate.push(id);
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  //facilities api

  ongetfacilitiesList() {
    this.facilitiesService.getfacilitiesList().subscribe((data) => {
      if (data) {
        this.facilityList = data;
        this.totalItems = this.facilityList.length;
        this.listOfCurrentPageData = this.facilityList;
        this.pageSizeChange(this.pageSize);
      }
    });
  }

  createFacility() {
    if (this.facilityForm.valid) {
      const payLoad = {
        facilityName: this.facilityForm.controls['facilityName'].value,
        description: '',
        facilityCode: this.facilityForm.controls['facilityCode'].value,
        facilityTypes:
          this.facilityForm.controls['facilityType'].value === null ||
          this.facilityForm.controls['facilityType'].value === ''
            ? null
            : {
                id: this.facilityForm.controls['facilityType'].value,
              },
        facilityNature: this.facilityForm.controls['facilityNature'].value,
        vendor:
          this.facilityForm.controls['vendor'].value === null ||
          this.facilityForm.controls['vendor'].value === ''
            ? null
            : {
                id: this.facilityForm.controls['vendor'].value,
              },
        location:
          this.facilityForm.controls['location'].value === null ||
          this.facilityForm.controls['location'].value === ''
            ? null
            : {
                id: this.facilityForm.controls['location'].value,
              },
        addressInfo: {
          addressLine1: this.facilityForm.controls['address1'].value,
          addressLine2: this.facilityForm.controls['address2'].value,
          zipCode: this.facilityForm.controls['pincode'].value,
          city: this.facilityForm.controls['city'].value,
          state: this.facilityForm.controls['state'].value,
          country: this.facilityForm.controls['country'].value,
        },
        contactInfo: {
          name: this.facilityForm.controls['contactName'].value,
          email: this.facilityForm.controls['emailid'].value,
          mobile: this.facilityForm.controls['contactMobile'].value,
        },
        isActive: true,
        parentFacilityId: this.facilityForm.controls['parentFacility'].value,
        costCentre: this.facilityForm.controls['costCentre'].value,
      };
      this.facilitiesService.createFacility(payLoad).subscribe((data) => {
        if (data) {
          this.createNotification(
            'success',
            data,
            'Facility code : ' + data['data']?.facilityCode
          );
          this.facilityForm.reset();
          this.facilitiesService.getfacilitiesList().subscribe(() => {
            this.vendorList = [];
            this.ongetfacilitiesList();
          });
        }
      });
      this.isVisible = false;
    } else {
      this.createNotification(
        'error',
        { message: 'Invalid' },
        'Please fill all the required fields'
      );
    }
  }

  cancelEdit() {
    this.facilityForm.reset();
    this.tableDataValue = null;
    this.isEdit = false;
  }

  editFacility(data) {
    this.editModal(1);
    this.editFacilityId = data?.id ?? '';
    this.editContactId = data?.contactInfo?.id ?? '';
    this.editAddressId = data?.addressInfo?.id ?? '';
    this.facilityForm.patchValue({
      facilityName: data.facilityName ?? '',
      facilityType: data?.facilityTypes?.id ?? '',
      facilityCode: data.facilityCode ?? '',
      facilityNature: data?.facilityNature ?? '',
      costCentre: data.costCentre ?? '',
      parentFacility: data?.parentFacilityId ?? '',
      vendor: data?.vendor?.id ?? '',
      location: data?.location?.id ?? '',
      contactName: data.contactInfo.name ?? '',
      contactMobile: data.contactInfo.mobile ?? '',
      emailid: data.contactInfo.email ?? '',
      address1: data.addressInfo.addressLine1 ?? '',
      address2: data.addressInfo.addressLine2 ?? '',
      city: data.addressInfo.city ?? '',
      pincode: data.addressInfo.zipCode ?? '',
      state: data.addressInfo.state ?? '',
      country: data.addressInfo.country ?? '',
      // orgFacility: data?.orgFacilityId ?? '',
    });
    this.facilitySelectedValue = data?.facilityNature;
  }

  updateFacility() {
    // if (this.facilityForm.valid) {
    const payLoad = {
      facilityCode: this.facilityForm.controls['facilityCode'].value,
      facilityName: this.facilityForm.controls['facilityName'].value,
      description: '',
      facilityTypes: {
        id: this.facilityForm.controls['facilityType'].value,
      },
      facilityNature: this.facilityForm.controls['facilityNature'].value,
      vendor:
        this.facilityForm.controls['vendor'].value === null ||
        this.facilityForm.controls['vendor'].value === ''
          ? null
          : {
              id: this.facilityForm.controls['vendor'].value,
            },
      location:
        this.facilityForm.controls['location'].value === null ||
        this.facilityForm.controls['location'].value === ''
          ? null
          : {
              id: this.facilityForm.controls['location'].value,
            },
      addressInfo: {
        id: this.editAddressId,
        addressLine1: this.facilityForm.controls['address1'].value,
        addressLine2: this.facilityForm.controls['address2'].value,
        zipCode: this.facilityForm.controls['pincode'].value,
        city: this.facilityForm.controls['city'].value,
        state: this.facilityForm.controls['state'].value,
        country: this.facilityForm.controls['country'].value,
      },
      contactInfo: {
        id: this.editContactId,
        name: this.facilityForm.controls['contactName'].value,
        email: this.facilityForm.controls['emailid'].value,
        mobile: this.facilityForm.controls['contactMobile'].value,
      },
      isActive: true,
      parentFacilityId: this.facilityForm.controls['parentFacility'].value,
      costCentre: this.facilityForm.controls['costCentre'].value,
      // orgFacilityId: this.facilityForm.controls['orgFacility'].value,
    };
    this.facilitiesService
      .updateFacilityList(this.editFacilityId, payLoad)
      .subscribe((data) => {
        if (data.statuscode === 200) {
          this.createNotification(
            'success',
            data,
            'Facility code : ' + data['data']?.facilityCode
          );
          this.facilityForm.reset();
          this.isEdit = false;
          this.isVisible = false;
          this.tableDataValue = null;
          this.ongetfacilitiesList();
        }
      });
  }

  ongetLocationList() {
    this.facilitiesService.getLocationList().subscribe((data) => {
      if (data) {
        this.locationList = data;
      }
    });
  }
  Cancel() {
    this.isModalVisible = false;
    this.resetFilter();
  }

  ongetOrgFacility() {
    this.facilitiesService.getOrgFacilities().subscribe((data) => {
      if (data) {
        // this.orgFacilityList = data;
      }
    });
  }

  ongetVendorList() {
    this.vendorService.getVendorList().subscribe((data) => {
      if (data) {
        this.vendorList = data.data;
      }
    });
  }

  onVendorSelectionChange(selectedVendor) {
    if (!selectedVendor) {
      // Handle the case where selectedVendor is null or undefined
      console.error('Selected vendor is null or undefined');
      return; // Exit the method to prevent further execution
    }

    this.selectFacility = null;
    // Call your API service method here
    this.facilitiesService.getFacilitiesWithVendorId(selectedVendor).subscribe(
      (response) => {
        // Handle API response
        this.vendorIdFacilityList = response;
      },
      (error) => {
        // Handle API error
        console.error(error);
      }
    );
  }

  bulkActive() {
    this.facilitiesService
      .bulkActionActive(this.checkBoxValueUpdate)
      .subscribe((data) => {
        if (data) {
          this.ongetfacilitiesList();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.refreshCheckedStatus();
          this.checkBoxValueUpdate = [];
        }
      });
  }
  bulkInactive() {
    this.facilitiesService
      .bulkActionDeActive(this.checkBoxValueUpdate)
      .subscribe((data) => {
        if (data) {
          this.ongetfacilitiesList();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.refreshCheckedStatus();
          this.checkBoxValueUpdate = [];
        }
      });
  }
  getLabel(id, array, value, label): string {
    const option = array.find((option) => option?.[value] === id);
    // If an option with the provided value is found, return its label; otherwise, return an empty string
    return option ? option?.[label] : '';
  }

  onFocusOutEvent(event) {
    this.inputFacilitiesCode = event?.target?.value;
    this.facilitiesService
      .getFacilitieCodeError(event?.target?.value)
      .subscribe((data) => {
        this.facilitiesCodeApiValue = data?.data?.facilityCode;
        if (data?.data?.facilityCode === this.inputFacilitiesCode) {
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
      ev.target.value != this.facilitiesCodeApiValue
    ) {
      this.errorMessage = false;
    }
  }
}
