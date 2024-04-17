import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UiCommonService } from 'src/app/Project/shared/services/ui-common/ui-common.service';
interface TreeNode {
  id;
  name: string;

  children?: TreeNode[];
}
@Component({
  selector: 'app-msc-main-page',
  templateUrl: './msc-main-page.component.html',
  styleUrls: ['./msc-main-page.component.css'],
})
export class MscMainPageComponent implements OnInit {
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

  mouldAssociationsPreviewData = [
    { id: 0, label: 'Schedule Configuration Code', value: '12354' },
    { id: 1, label: 'Schedule Configuration Name', value: 'Schedule Name 123' },
    {
      id: 2,
      label: 'Schedule Configuration Type',
      value: 'Data Capture',
    },
    { id: 3, label: 'Frequency', value: 'Monthly' },
    { id: 4, label: 'Recurrence', value: 'Every 2nd Of Every Month' },
  ];

  selectedOption = '1';
  confirmationText = 'Active';
  isSmallScreen = false;
  pattern_val = '';
  value: string[] = [];
  nodes = [
    {
      title: 'Sunday',
      value: '0-0',
      key: '0',
    },
    {
      title: 'Monday',
      value: '1',
      key: '1',
    },
    {
      title: 'Tuesday',
      value: '2',
      key: '2',
    },
    {
      title: 'Wednesday',
      value: '3',
      key: '3',
    },
  ];
  var_tree: boolean = false;
  locationnodes: TreeNode[] = [
    {
      name: 'parent 1',
      id: '100',
      children: [
        {
          name: 'Asia',
          id: '1',
          children: [
            {
              name: 'leaf 1-0-0',
              id: '1-1',
            },
            { name: 'leaf 1-0-1', id: '10011' },
          ],
        },
        {
          name: 'parent 1-1',
          id: '1002',
          children: [
            { name: 'leaf 1-1-0', id: '10020' },
            { name: 'leaf 1-1-1', id: '10021' },
          ],
        },
      ],
    },
  ];
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
      'Data Capture Configuration Created Successfully',
      '',
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
  openTreeModal() {
    this.var_tree = true;
  }
  closeTreeModal() {
    this.var_tree = false;
  }
  onLocationSelectedNodesChange(selectedNodes: TreeNode[]): void {
    console.log(selectedNodes);
  }
}
