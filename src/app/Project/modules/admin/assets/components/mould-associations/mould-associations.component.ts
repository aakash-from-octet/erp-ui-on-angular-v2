import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { FilterSearchComponent } from '../filter-search/filter-search.component';

interface FlatNode {
  id;
  name: string;
  level: number;
  disabled: boolean;
  expandable: boolean;
  highlighted: boolean;
}

// interface TreeNode {
//   id;
//   name: string;
//   disabled?: boolean;
//   children?: TreeNode[];
// }

@Component({
  selector: 'app-mould-associations',
  templateUrl: './mould-associations.component.html',
  styleUrls: ['./mould-associations.component.css'],
})
export class MouldAssociationsComponent {
  selectedValue = '';
  var_spares = false;
  var_sensor = false;
  var_addnewSpares = false;
  var_addnewSensors = false;
  var_tree = false;
  selectedLocation = '';

  setOfCheckedId = new Set<number>();
  listOfCurrentPageData = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
  listOfCurrentSensorData = [{ id: 0 }];
  radioValue;
  openSpares() {
    this.var_spares = true;
  }
  openSensors() {
    this.var_sensor = true;
  }
  closeModal() {
    this.var_spares = false;
    this.var_addnewSpares = false;
    this.var_sensor = false;
    this.var_addnewSensors = false;
  }

  openAddNewSpare() {
    this.var_addnewSpares = true;
    this.var_spares = false;
  }
  openAddNewSensor() {
    this.var_addnewSensors = true;
    this.var_sensor = false;
  }
  constructor(
    private msg: NzMessageService,
    private modalService: NzModalService
  ) {}
  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  openTreeModal() {
    this.var_tree = true;
  }
  closeTreeModal() {
    this.var_tree = false;
  }
  handleSelectedLocation(location: string) {
    this.selectedLocation = location;
  }
  filteredItemsSelected: string[] = [];

  openSearchFilterModal(
    modalName: string,
    onSave: (selectedItems: string[]) => void
  ): void {
    const modalRef = this.modalService.create({
      nzTitle: `Search ${modalName}`,
      nzContent: FilterSearchComponent,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => modalRef.destroy(),
        },
        {
          label: 'Save',
          type: 'primary',
          onClick: () => {
            const data = ['Product 1', 'Mould 1'];
            onSave(data);
            modalRef.destroy();
          },
        },
      ],
      nzWidth: '700px',
      nzCentered: true,
    });
  }

  handleSaveClicked = (selectedItems: string[]) => {
    this.filteredItemsSelected = selectedItems;
    console.log(selectedItems);
  };

  onLocationSelectedNodesChange(selectedNodes: FlatNode[]): void {
    //this.locationselectedNodes = selectedNodes;
    console.log(selectedNodes);
    
  }
}
