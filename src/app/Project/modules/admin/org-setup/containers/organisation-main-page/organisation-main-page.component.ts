import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UiCommonService } from 'src/app/Project/shared/services/ui-common/ui-common.service';
import { AppState } from 'src/app/Project/store/app.state';
import { OrganisationTableComponent } from '../../components/organisation-table/organisation-table.component';
import { OrganizationService } from '../../services/organization.service';
import * as fromAction from '../../store/orgsetup.action';
import * as fromSelector from '../../store/orgsetup.selectors';
@Component({
  selector: 'app-organisation-main-page',
  templateUrl: './organisation-main-page.component.html',
  styleUrls: ['./organisation-main-page.component.css'],
})
export class OrganisationMainPageComponent implements OnInit {
  isVisible = false;
  viewOrganisation = false;
  isEdit = false;
  avatarUrl?: string;
  loading = false;
  tabSelected = 1;
  isGridModal = false;
  tableDataValue;
  previewValue;
  orgForm: FormGroup;
  editPatchValue;
  dataSource;
  getGlobalCurrencyData;
  previeworgcode;
  previewDomainUrl;
  previewDomainName;
  previewValueForGlobalCurrency: string;
  getLogo;
  searchText = '';
  isSmallScreen = false;
  uploadFile;
  isReadOnly = true;
  @ViewChild(OrganisationTableComponent)
  OrganisationTableComponent: OrganisationTableComponent;
  constructor(
    // private msg: NzMessageService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private service: OrganizationService,
    private store: Store<AppState>,
    // private dataService: UtilityService,
    private uiService: UiCommonService
  ) {}

  // initial Component render Methods
  ngOnInit() {
    this.initialForm();
    this.getGlobalCurrencyApi();
    // this.getLogoApi();
    this.store.select(fromSelector.getOrganizationList).subscribe((res) => {
      if (res) {
        this.dataSource = res;
      }
    });
    this.uiService.getWindowWidth().subscribe((width) => {
      this.isSmallScreen = width < 992;
    });
  }

  // Single Form For Edit
  initialForm() {
    this.orgForm = this.fb.group({
      orgName: ['', Validators.required],
      orgCode: [{ value: '', disabled: true }, Validators.required],
      domainName: [{ value: '', disabled: true }, Validators.required],
      contactName: [''],
      domainUrl: [{ value: '', disabled: true }],
      globalCurrency: ['mike'],
      ContactNumber: [''],
      ContactName: [''],
      PrimaryEmail: [
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
      state: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  // Form Validation Get Method
  get f() {
    return this.orgForm.controls;
  }

  /*Update Api Methods Starts*/
  updateOrg() {
    const payload = {
      id: this.editPatchValue.id,
      name: this.orgForm?.controls?.['orgName'].value,
      orgCode: this.orgForm?.controls?.['orgCode'].value,
      domainName: this.orgForm?.controls?.['domainName'].value,
      domainUrl: this.orgForm?.controls?.['domainUrl'].value,
      status: true,
      globalCurrencyId: {
        id: this.orgForm.controls?.['globalCurrency'].value,
      },
      logo: '',
      contactInfo: {
        id: this.editPatchValue?.contactInfo?.id,
        name: this.orgForm.controls?.['ContactName']?.value,
        email: this.orgForm.controls?.['PrimaryEmail']?.value,
        mobile: this.orgForm.controls?.['ContactNumber']?.value,
      },
      contactAddressInfo: {
        id: this.editPatchValue?.contactAddressInfo?.id,
        addressLine1: this.orgForm.controls?.['addressOne']?.value,
        addressLine2: this.orgForm.controls?.['addressTwo']?.value,
        zipCode: this.orgForm.controls?.['pinCode']?.value,
        city: this.orgForm.controls?.['city']?.value,
        state: this.orgForm.controls?.['state']?.value,
        country: this.orgForm.controls?.['country']?.value,
      },
    };
    if (!this.orgForm.valid) {
      this.notification.create(
        'error',
        'Please fill all required fields.',
        '' + '',
        { nzPlacement: 'bottomRight', nzDuration: 3000 }
      );
    }
    if (this.orgForm.valid) {
      this.service
        .updateOrganization(payload, this.editPatchValue.id, this.uploadFile)
        .subscribe((data) => {
          if (data) {
            this.createNotification('success', data);
            this.service.getOrganisation().subscribe((data) => {
              this.store.dispatch(
                fromAction.getOranizationSuccess({ getOranization: data })
              );
            });
          }
        });
    }
  }

  /*Update Api Methods Ends*/

  /* button Methods starts */

  // Methods For Show Tabs
  showModal(create: number) {
    this.tabSelected = create;
    this.isVisible = true;
  }
  // Methods For Close Button
  handleCancel() {
    this.isVisible = false;
    this.viewOrganisation = false;
    this.isGridModal = false;
  }
  // Method For ok Button
  handleOk() {
    this.isVisible = false;
    this.viewOrganisation = false;
    this.isGridModal = false;
  }
  // Open Grid Method
  openGridModal() {
    this.isGridModal = true;
    this.OrganisationTableComponent.openGrid();
  }
  // Reset Method For Grid
  restFilter() {
    this.OrganisationTableComponent.restFilter();
  }
  // back button method
  back() {
    if (this.tabSelected < 4 && this.tabSelected > 1) {
      this.tabSelected--;
    }
  }
  // save and Continue methods
  saveContinue() {
    if (this.tabSelected < 3 && this.tabSelected > 0) {
      this.tabSelected++;
      if (this.tabSelected === 3) {
        this.previewValue = this.orgForm.value;
      }
    }
  }

  /* button Methods End */

  update() {
    if (this.tabSelected < 4 && this.tabSelected > 0) {
      this.tabSelected++;
      if (this.tabSelected === 3) {
        this.previewValue = this.orgForm.value;
        this.filterById(this.previewValue?.globalCurrency);
      }
      if (this.tabSelected === 4) {
        this.updateOrg();
      }
    }
  }
  updateTabSelected(tab: number) {
    this.tabSelected = tab;
  }

  openViewModal(data) {
    this.tableDataValue = data;
    this.getLogoApi(data?.id);
    this.viewOrganisation = true;
    this.service.getByIdView(data?.id).subscribe((data) => {
      if (data) {
        this.tableDataValue = data?.data;
      }
    });
  }

  openEditModal(num, data) {
    this.editPatchValue = data;
    this.getLogoApi(data?.id);
    this.previeworgcode = this.editPatchValue?.orgCode;
    this.previewDomainUrl = this.editPatchValue?.domainUrl;
    this.previewDomainName = this.editPatchValue?.domainUrl;
    this.isVisible = true;
    this.tabSelected = num;
    this.viewOrganisation = false;
    this.isEdit = true;
    if (this.editPatchValue) {
      this.orgForm.patchValue({
        orgName: this.editPatchValue.name,
        orgCode: this.editPatchValue.orgCode,
        domainUrl: this.editPatchValue?.domainUrl,
        domainName: this.editPatchValue?.domainName,
        globalCurrency: this.editPatchValue?.globalCurrencyId?.id,
        ContactNumber: this.editPatchValue?.contactInfo?.mobile,
        ContactName: this.editPatchValue?.contactInfo?.name,
        PrimaryEmail: this.editPatchValue?.contactInfo?.email,
        addressOne: this.editPatchValue?.contactAddressInfo?.addressLine1,
        addressTwo: this.editPatchValue?.contactAddressInfo?.addressLine2,
        city: this.editPatchValue?.contactAddressInfo?.city,
        pinCode: this.editPatchValue?.contactAddressInfo?.zipCode,
        state: this.editPatchValue?.contactAddressInfo?.state,
        country: this.editPatchValue?.contactAddressInfo?.country,
      });
    }
  }

  editModal(tabNumber: number, data) {
    this.editPatchValue = data;
    this.tabSelected = tabNumber;
    this.viewOrganisation = false;
    this.isVisible = true;
    this.isEdit = true;
    if (this.editPatchValue) {
      this.orgForm.patchValue({
        orgName: this.editPatchValue.name,
        orgCode: this.editPatchValue.orgCode,
        contactName: this.editPatchValue?.contactInfo?.mobile,
        domainUrl: this.editPatchValue?.domainUrl,
        domainName: this.editPatchValue?.domainName,
        globalCurrency: this.editPatchValue?.globalCurrencyId?.currencyCode,
        ContactNumber: this.editPatchValue?.contactInfo?.mobile,
        ContactName: this.editPatchValue?.contactInfo?.firstName,
        PrimaryEmail: this.editPatchValue?.contactInfo?.email,
        addressOne: this.editPatchValue?.contactAddressInfo?.addressLine1,
        addressTwo: this.editPatchValue?.contactAddressInfo?.addressLine2,
        city: this.editPatchValue?.contactAddressInfo?.city,
        pinCode: this.editPatchValue?.contactAddressInfo?.zipCode,
        state: this.editPatchValue?.contactAddressInfo?.state,
        country: this.editPatchValue?.contactAddressInfo?.country,
      });
    }
  }

  // Global currency Api Method
  getGlobalCurrencyApi() {
    this.service.getGlobalcurrency().subscribe((data) => {
      if (data) {
        this.getGlobalCurrencyData = data;
      }
    });
  }
  /*Logo Api Methods And Intigration Starts*/

  // get api methods for logo
  getLogoApi(id) {
    this.service.getLogo(id).subscribe((data) => {
      this.getLogo = data;
    });
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
  /*Log Api Methods And Intigration End*/

  /* Methods For Conver Table Data into excel file starts*/
  convertToXLSX(paradata): void {
    const header = Object.keys(paradata[0]);
    const rows = paradata.map((obj) => header.map((key) => obj[key]));
    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join(
      '\n'
    );
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'organisationDetails.xlsx';
    link.click();
  }

  convertToJSON() {
    const filteredData = this.dataSource?.data?.map((item) => {
      return {
        ID: item.id,
        ORGANISATION_NAME: item.name || '',
        ORGANISATION_CODE: item.orgCode || '',
        DOMAIN_URL: item?.domainUrl || '',
        GLOBAL_CURRENCY: item?.globalCurrencyId?.currencyCode || '',
        EMAIL: item?.contactInfo?.email || '',
        CONTACT: item?.contactInfo?.mobile || '',
        STATUS: (item?.status === true ? 'active' : 'inactive') || '',
      };
    });
    this.convertToXLSX(filteredData);
  }
  /* Methods For Conver Table Data into excel file End*/

  /* Method For Create Notification Starts*/
  createNotification(type: string, data): void {
    this.notification.create(type, data.message, ' ' + '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }
  /* Method For Create Notification Ends*/

  filterById(id) {
    const item = this.getGlobalCurrencyData.find((item) => item.id === id);
    this.previewValueForGlobalCurrency = item
      ? item.currencyCode
      : 'Item not found';
  }
  // searchEntries() {
  //   this.dataService.setSearchTerm(this.searchText);
  // }
}
