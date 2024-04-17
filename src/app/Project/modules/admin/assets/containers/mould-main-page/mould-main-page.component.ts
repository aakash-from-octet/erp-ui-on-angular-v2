import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UiCommonService } from 'src/app/Project/shared/services/ui-common/ui-common.service';

@Component({
  selector: 'app-mould-main-page',
  templateUrl: './mould-main-page.component.html',
  styleUrls: ['./mould-main-page.component.css'],
})
export class MouldMainPageComponent implements OnInit {
  isVisible = false;
  viewOrganisation = false;
  isEdit = false;
  inputValue = 1;
  avatarUrl?: string;
  loading = false;
  tabSelected = 1;
  isGridModal = false;
  listOfCurrentPageData = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];
  basicDetailsPreviewData = [
    { id: 0, label: 'Mould Code', value: '3488990' },
    { id: 1, label: 'Mould Name', value: 'Name123' },
    { id: 2, label: 'Mould Owner', value: 'John' },
    { id: 3, label: 'Moulding Process', value: 'Production' },
    { id: 4, label: 'Mould Type', value: 'Production' },
    { id: 5, label: 'Total Number of Cavities', value: '12' },
    { id: 6, label: 'IoT Enabled', value: 'Yes' },
    { id: 7, label: 'Shot Count Enabled', value: 'IoT Enabled' },
    { id: 8, label: 'Commissioning Date', value: '12 March, 2024' },
    { id: 9, label: 'Mould Cycle Time', value: '129 sec' },
    { id: 10, label: 'Machine Tonnage', value: '20 kg' },
    { id: 11, label: 'Component Weight', value: '20 kg' },
    { id: 12, label: 'Warranty (Min Yrs)', value: '2 Years' },
    { id: 13, label: 'Warranty (Min Shot Count)', value: '12' },
  ];
  mouldAssociationsPreviewData = [
    { id: 0, label: 'Project Name', value: 'Asia' },
    { id: 1, label: 'Component', value: 'Cap - GRTR5658786' },
    { id: 2, label: 'Manufacturing Location', value: 'Mumbai' },
    { id: 3, label: 'Mould Manager', value: 'John' },
    { id: 4, label: 'Converter', value: 'Name' },
    { id: 5, label: 'Mould Maker', value: 'Prakash' },
    { id: 6, label: 'Mould Maker Mould Code', value: '987456' },
    { id: 7, label: 'Mould Maker Location', value: 'Mumbai' },
  ];
  mouldDetailsPreviewData = [
    { id: 0, label: 'Mould Height', value: '20 mm' },
    { id: 1, label: 'Mould Breadth', value: '20 mm' },
    { id: 2, label: 'Mould Length', value: '20 mm' },
    { id: 3, label: 'Mould Weight', value: '20 kg' },
    { id: 4, label: 'Mould Opening', value: '20 mm' },
    { id: 5, label: 'Mould Base Material', value: 'Mild Steel (MS)' },
    { id: 6, label: 'Mould Core Material', value: 'Orvar Supreme' },
    { id: 7, label: 'Mould Cavity Material', value: 'Stavax' },
    { id: 8, label: 'Injection Technology', value: 'Cold' },
    { id: 9, label: 'Inmould Closing', value: '20 mm' },
    { id: 10, label: 'Construction Type', value: 'Type' },
    { id: 11, label: 'Sub Assembly Name', value: 'Lorem ipsum' },
    { id: 12, label: 'Sub Assembly Code', value: '123654' },
    { id: 13, label: 'Sub Assembly Type', value: 'Lorem ipsum' },
    { id: 14, label: 'Total Number of Cavities', value: '20' },
    { id: 15, label: 'Cavity Start Number', value: '2' },
    { id: 16, label: 'Cavity End Number', value: '10' },
  ];
  costPreviewData = [
    { id: 0, label: 'Mould Capitalised', value: 'Yes' },
    { id: 1, label: 'Total Capitalised Cost', value: '1200 USD' },
    { id: 2, label: 'Cost Center', value: 'Mumbai' },
    { id: 3, label: 'Finance Asset ID', value: '7854' },
    { id: 4, label: 'Depreciation Rule', value: 'SLM' },
    { id: 5, label: 'Depreciation Life', value: '2 Years' },
    { id: 6, label: 'Mould Refurbished', value: 'No' },
    { id: 7, label: 'Mould Retired', value: 'No' },
  ];
  otherPreviewData = [
    { id: 0, label: 'Lead Mould', value: 'Yes' },
    { id: 1, label: 'Repeat Mould', value: 'Yes' },
    { id: 2, label: 'MDR Date', value: '12 Jan, 2024' },
    { id: 3, label: 'Mould Cycle Time', value: '1290 Sec' },
    { id: 4, label: 'Machine Tonnage', value: '20 kg' },
    { id: 5, label: 'Component Weight', value: '20 kg' },
    { id: 6, label: 'Recyclable Logo Capable', value: 'No' },
    { id: 7, label: 'Brand Logo Capable', value: 'No' },
    { id: 8, label: 'Converter Logo Capable', value: 'No' },
  ];

  selectedOption = '1';
  confirmationText = 'Active';
  isSmallScreen = false;
  constructor(
    private msg: NzMessageService,
    private notification: NzNotificationService,
    private uiService: UiCommonService
  ) {}
  ngOnInit() {
    this.uiService.getWindowWidth().subscribe((width) => {
      this.isSmallScreen = width < 992;
    });
  }
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
 

  private getBase64(
    file: File,
    callback: (result: string | ArrayBuffer | null) => void
  ): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
  }
  back() {
    if (this.tabSelected < 8 && this.tabSelected > 1) {
      this.tabSelected--;
    }
  }
  saveContinue() {
    if (this.tabSelected < 8 && this.tabSelected > 0) {
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
      'Mould Created Successfully',
      'Mould Id: 1171',
      { nzPlacement: 'bottomRight', nzDuration: 3000 }
    );
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }

  openViewModal() {
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
  @ViewChild('noMouldTemplate', { static: false })
  noMouldTemplate: TemplateRef<unknown>;
  showNotification(option: string): void {
    this.selectedOption = option; // Store the selected option
    if (option === '1') {
      this.confirmationText = 'Active';
    } else if (option === '2') {
      this.confirmationText = 'Inactive';
    }
    this.notification.template(this.noMouldTemplate, {
      nzPlacement: 'bottomRight',
      nzDuration: 300000,
    });
  }
  closeNotification() {
    this.notification.remove();
  }
}
