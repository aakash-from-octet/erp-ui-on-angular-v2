import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-add-component',
  templateUrl: './add-component.component.html',
  styleUrls: ['./add-component.component.css'],
})
export class AddComponentComponent {
  @Input() isVisible = false;
  @Output() cancelClicked = new EventEmitter<void>();
  tabSelected = 1;
  loading = false;
  avatarUrl?: string;
  constructor(
    private msg: NzMessageService,
    private notification: NzNotificationService
  ) {}
  handleCancel() {
    this.cancelClicked.emit();
  }
  handleOk() {
    this.cancelClicked.emit();
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

  updateTabSelected(tab: number) {
    this.tabSelected = tab;
  }
  saveContinue() {
    if (this.tabSelected < 7 && this.tabSelected > 0) {
      this.tabSelected++;
    }
  }
  cancel() {
    this.cancelClicked.emit();
  }
}
