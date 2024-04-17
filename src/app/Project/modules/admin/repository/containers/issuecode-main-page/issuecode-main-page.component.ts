import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UiCommonService } from 'src/app/Project/shared/services/ui-common/ui-common.service';

@Component({
  selector: 'app-issuecode-main-page',
  templateUrl: './issuecode-main-page.component.html',
  styleUrls: ['./issuecode-main-page.component.css'],
})
export class IssuecodeMainPageComponent implements OnInit {
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
  // handleChange(info: { file: NzUploadFile }): void {
  //   switch (info.file.status) {
  //     case 'uploading':
  //       this.loading = true;
  //       break;
  //     case 'done':
  //       // Get this url from response in real world.
  //       this.getBase64(info.file!.originFileObj!, (img: string) => {
  //         this.loading = false;
  //         this.avatarUrl = img;
  //       });
  //       break;
  //     case 'error':
  //       this.msg.error('Network error');
  //       this.loading = false;
  //       break;
  //   }
  // }

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
    this.notification.create(type, 'Issue  Created Successfully!', '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
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
}
