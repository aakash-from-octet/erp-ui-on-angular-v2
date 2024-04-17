import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';
import { AppState } from 'src/app/Project/store/app.state';
import { LocationService } from '../../services/location.service';
import * as fromAction from '../../store/orgsetup.action';
import * as fromSelector from '../../store/orgsetup.selectors';

// interface
export interface Data {
  id: number;
  locationCode: string;
  url: string;
  locationName: string;
  createdDate: string;
  isActive;
  contactInfo;
  location: string;
  locationType;
  localCurrency;
  parentLocation;
}
@Component({
  selector: 'app-location-table',
  templateUrl: './location-table.component.html',
  styleUrls: ['./location-table.component.css'],
})
export class LocationTableComponent implements OnInit {
  getLocationList$: Subscription;
  vendorList;
  ischecked = true;
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<number>();
  totalItems = 0;
  pageSize = 10;
  isVisible = false;
  viewLocationModel = false;
  isEdit = false;
  inputValue = 1;
  avatarUrl?: string;
  inputLocationCode;
  tabSelected = 1;
  isGridModal = false;
  currentPageIndex = 1;
  locationPreview = false;
  locationForm: FormGroup;
  locationEditForm: FormGroup;
  isEditVisible = false;
  viewList;
  editLocationPatch;
  previewValue;
  parentLocation;
  dropDownValue;
  locationCodeApiValue;
  localCurrencyDropDown;
  locationTypeDropDown;
  previewEditValue;
  isEditEnable = false;
  isModalVisible = false;
  errorMessage = false;
  filteredData;
  checkBoxValueUpdate = [];
  States: { [key: string]: boolean } = {};
  columns: string[] = [
    'Location Name',
    'Location Code',
    'Location Type',
    'Status',
    'Parent Location',
    'Local Currency',
  ];

  newColumns: string[];
  columnMap: Map<string, string>;
  valueArray: string[];
  filterState = new Map<string, string[]>();

  tabSelecteds: 1;
  subscription: Subscription;
  subscriptions: Subscription[] = [];
  constructor(
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private Service: LocationService,
    private store: Store<AppState>,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.inititalForm();
    this.getLocationListApi();
    this.inititalEditForm();
    this.getLocalCurrency();
    this.getLocationType();
    setTimeout(() => {
      this.columnMapSet();
      this.resetFilter();
    }, 200);
  }

  columnMapSet() {
    this.columnMap = new Map();
    this.columnMap.set('locationName', 'Location Name');
    this.columnMap.set('locationCode', 'Location Code');
    this.columnMap.set('locationType.name', 'Location Type');
    this.columnMap.set('isActive', 'Status');
    this.columnMap.set('parentLocation.locationName', 'Parent Location');
    this.columnMap.set('localCurrency.currencyCode', 'Local Currency');
    this.newColumns = [...this.columnMap.values()];
  }

  inititalForm() {
    this.locationForm = this.fb.group({
      locationName: ['', [Validators.required]],
      locationCode: ['', [Validators.required]],
      locationtype: ['', [Validators.required]],
      parentLocation: [''],
      localCurrency: [''],
    });
  }

  inititalEditForm() {
    this.locationEditForm = this.fb.group({
      locationName: ['', [Validators.required]],
      locationCode: ['', [Validators.required]],
      locationtype: ['', [Validators.required]],
      parentLocation: [''],
      localCurrency: ['', [Validators.required]],
    });
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
  onPageIndexChange(pageIndex: number) {
    this.currentPageIndex = pageIndex;
    this.loadTableData(this.currentPageIndex, this.pageSize);
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
    const listOfEnabledData = this.filteredData;
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
  get g() {
    return this.locationEditForm.controls;
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
  // view and location starts
  viewLocation(data) {
    this.viewLocationModel = true;
    this.viewList = [data];
  }
  editLocation(data) {
    this.tabSelected = 1;
    this.isEditEnable = true;
    this.editLocationPatch = data;
    this.isEditVisible = true;
    this.locationEditForm.patchValue({
      locationName: this.editLocationPatch?.locationName,
      locationCode: this.editLocationPatch?.locationCode,
      locationtype: this.editLocationPatch?.locationType?.id,
      parentLocation: this.editLocationPatch?.parentLocationId,
      localCurrency: this.editLocationPatch?.localCurrency?.id,
    });
  }

  closeEdit() {
    this.isEditVisible = false;
  }

  // view and location end
  openGridModal() {
    // this.isGridModal = true;
    this.isModalVisible = true;
  }
  Cancel() {
    this.isModalVisible = false;
  }

  showModal(create: number) {
    this.tabSelected = create;
    this.isVisible = true;
    this.isEditEnable = false;
  }

  openViewModal() {
    this.viewLocationModel = true;
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
        this.previewValue = this.locationForm.value;
        this.previewEditValue = this.locationEditForm.value;
      }
    }
  }

  saveContinueEdit() {
    if (this.tabSelecteds < 2 && this.tabSelecteds > 0) {
      this.tabSelecteds++;
      if (this.tabSelecteds === 2) {
        this.previewEditValue = this.locationEditForm.value;
      }
    }
  }

  onCreateLocation() {
    if (this.locationForm.valid) {
      this.isEditEnable = false;
      const payload = {
        locationCode: this.locationForm.controls['locationCode'].value,
        locationName: this.locationForm.controls['locationName'].value,
        description: null,
        locationType: {
          id: this.locationForm.controls['locationtype'].value,
        },
        parentLocationId: this.locationForm.controls['parentLocation'].value,
        localCurrency: {
          id: this.locationForm.controls['localCurrency'].value,
        },
        isActive: true,
      };

      this.Service.createLocation(payload).subscribe((data) => {
        if (data) {
          this.createNotification('success', data);
          this.locationForm.reset();
          this.Service.getLocation().subscribe((data) => {
            this.store.dispatch(
              fromAction.getLocationListSuccess({ getLocation: data })
            );
          });
        }
      });
    }
  }
  onUpdateLocationApi() {
    if (this.locationEditForm.valid) {
      const payload = {
        locationCode: this.locationEditForm.controls['locationCode'].value,
        locationName: this.locationEditForm.controls['locationName'].value,
        description: null,
        locationType: {
          id: this.locationEditForm.controls['locationtype'].value,
        },
        parentLocationId:
          this.locationEditForm.controls['parentLocation'].value,
        localCurrency: {
          id: this.locationEditForm.controls['localCurrency'].value,
        },
        isActive: true,
      };

      this.Service.updateLocation(this.editLocationPatch.id, payload).subscribe(
        (data) => {
          if (data) {
            this.createNotification('success', data);
            this.locationForm.reset();
            this.Service.getLocation().subscribe((data) => {
              this.store.dispatch(
                fromAction.getLocationListSuccess({ getLocation: data })
              );
            });
          }
        }
      );
    }
  }
  createNotification(type: string, data): void {
    this.notification.create(type, data.message, '', {
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
    this.viewLocationModel = false;
    this.isGridModal = false;
    this.isEditVisible = false;
    this.locationForm.reset();
    this.locationEditForm.reset();
  }

  handleOk() {
    this.isVisible = false;
    this.viewLocationModel = false;
    this.isGridModal = false;
    this.isEditVisible = false;
    this.isModalVisible = false;
  }

  getLocationListApi() {
    this.Service.getLocation().subscribe((data) => {
      if (data) {
        this.store.dispatch(
          fromAction.getLocationListSuccess({ getLocation: data })
        );
        this.getLocationList$ = this.store
          .select(fromSelector.getLocationList)
          .subscribe((res) => {
            if (res) {
              this.listOfData = res['data'];
              this.dropDownValue =
                this.listOfData?.['parentLocation']?.locationName;
              this.totalItems = this.listOfData.length;
              this.listOfCurrentPageData = this.listOfData;
              this.pageSizeChange(this.pageSize);
            }
          });
      }
    });
    this.totalItems = this.listOfData.length;
  }

  onStatusChange(data) {
    if (data.isActive === true) {
      const tableId = data.id;
      this.Service.activeToInActive(tableId).subscribe(() => {
        this.getLocationListApi();
      });
    } else {
      const tableId = data.id;
      this.Service.inactiveToActive(tableId).subscribe(() => {
        this.getLocationListApi();
      });
    }
  }

  getLocalCurrency() {
    this.Service.getGlobalcurrency().subscribe((data) => {
      this.localCurrencyDropDown = data;
    });
  }

  getLocationType() {
    this.Service.getLocationTypeApi().subscribe((data) => {
      if (data) {
        this.locationTypeDropDown = data;
      }
    });
  }
  onFocusOutEvent(event) {
    this.inputLocationCode = event?.target?.value;
    this.Service.getLocationCodeError(event?.target?.value).subscribe(
      (data) => {
        this.locationCodeApiValue = data?.data?.locationCode;
        if (data?.data?.locationCode === this.inputLocationCode) {
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
      ev.target.value != this.locationCodeApiValue
    ) {
      this.errorMessage = false;
    }
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
    link.download = 'LocationDetails.xlsx';
    link.click();
  }

  convertToJSON() {
    const filteredData = this.listOfCurrentPageData.map((item) => {
      return {
        ID: item.id,
        LOCATIONCODE: item.locationCode || '',
        LOCATIONNAME: item.locationName || '',
        LOCATIONTYPE: item?.locationType?.name || '',
        PARENTLOCATION: item?.parentLocation?.locationName || '',
        LOCALCURRENCY: item?.localCurrency?.currencyCode || '',
        STATUS: (item?.isActive?.value === true ? 'active' : 'inactive') || '',
      };
    });
    this.convertToXLSX(filteredData);
  }

  resetFilter() {
    for (const column of this.columns) {
      this.States[column] = true;
    }
    this.searchText = '';
    this.filterState = new Map<string, string[]>();
    this.loadTableData(this.currentPageIndex, this.pageSize);
  }
  searchText = '';
  get f() {
    return this.locationForm.controls;
  }
  searchEntries() {
    this.utilityService.setSearchTerm(this.searchText);
    this.loadTableData(this.currentPageIndex, this.pageSize);
  }
  options = [
    { label: 'MOLD MAKER', value: 'MOLD MAKER' },
    { label: 'CONVERTER', value: 'CONVERTER' },
    { label: ' OTHERS', value: 'OTHERS' },
  ];

  bulkActive() {
    this.Service.bulkActionActive(this.checkBoxValueUpdate).subscribe(
      (data) => {
        if (data) {
          this.getLocationListApi();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.checkBoxValueUpdate = [];
          this.refreshCheckedStatus();
        }
      }
    );
  }
  bulkInactive() {
    this.Service.bulkActionDeActive(this.checkBoxValueUpdate).subscribe(
      (data) => {
        if (data) {
          this.getLocationListApi();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.checkBoxValueUpdate = [];
          this.refreshCheckedStatus();
        }
      }
    );
  }

  getLabel(id, array, value, label): string {
    const option = array.find((option) => option?.[value] === id);
    // If an option with the provided value is found, return its label; otherwise, return an empty string
    return option ? option?.[label] : '';
  }
}
