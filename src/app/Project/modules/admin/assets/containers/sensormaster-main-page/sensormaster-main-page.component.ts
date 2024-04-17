import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-sensormaster-main-page',
  templateUrl: './sensormaster-main-page.component.html',
  styleUrls: ['./sensormaster-main-page.component.css'],
})
export class SensormasterMainPageComponent {
  isVisible = false;
  viewOrganisation = false;
  isEdit = false;
  inputValue = 1;
  avatarUrl?: string;
  loading = false;
  tabSelected = 1;
  isGridModal = false;
  selectedValue = null;
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
  constructor(
    private msg: NzMessageService,
    private notification: NzNotificationService
  ) {}

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
    if (this.tabSelected < 7 && this.tabSelected > 1) {
      this.tabSelected--;
    }
  }
  saveContinue() {
    if (this.tabSelected < 7 && this.tabSelected > 0) {
      this.tabSelected++;
    }
    this.notification.remove();
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
      'Sensor Added Successfully',
      'Sensor Id: 1171',
      { nzPlacement: 'bottomRight', nzDuration: 3000 }
    );
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }
  @ViewChild('noMouldTemplate', { static: false })
  noMouldTemplate: TemplateRef<unknown>;
  continueNotification(): void {
    this.notification.template(this.noMouldTemplate, {
      nzPlacement: 'bottomRight',
      nzDuration: 300000,
    });
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
