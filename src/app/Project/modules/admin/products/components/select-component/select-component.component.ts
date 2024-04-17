import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-component',
  templateUrl: './select-component.component.html',
  styleUrls: ['./select-component.component.css'],
})
export class SelectComponentComponent {
  @Input() isVisible = false;
  @Output() cancelClicked = new EventEmitter<void>();
  listOfCurrentPageData = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
  setOfCheckedId = new Set<number>();
  isAdding = false;
  compValue = 1;
  handleCancel() {
    this.cancelClicked.emit();
  }
  handleOk() {
    this.cancelClicked.emit();
  }
  cancel() {
    this.cancelClicked.emit();
  }
  btnAdd() {
    this.isAdding = true;
  }
  btnMinus() {
    if (this.compValue > 0) {
      this.compValue--;
    }
  }
  btnPlus() {
    this.compValue++;
  }
  openComponent = false;
  openAddNewComponent() {
    this.openComponent = true;
    this.isVisible = false;
    this.cancelClicked.emit();
  }
  closeAddNewModal() {
    this.openComponent = false;
  }
}
