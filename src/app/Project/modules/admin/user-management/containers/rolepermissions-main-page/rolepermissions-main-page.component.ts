import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  RoleMenuItem,
  TreeNodeInterface,
} from '../../model/rolepermission.model';
import { RolePermissionsService } from '../../services/role-permissions.service';

@Component({
  selector: 'app-rolepermissions-main-page',
  templateUrl: './rolepermissions-main-page.component.html',
  styleUrls: ['./rolepermissions-main-page.component.css'],
})
export class RolepermissionsMainPageComponent implements OnInit {
  @ViewChild('saveButton') saveButton;

  saveButtonText = 'Save';

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  activeRole: string;
  roleList;
  getRolesId: number;
  filteredList;
  listOfMapData: TreeNodeInterface[] = [];

  updatedListOfMapData: TreeNodeInterface[] = [];

  constructor(
    private service: RolePermissionsService,
    private notification: NzNotificationService,
    private msg: NzMessageService
  ) {}

  ngOnInit() {
    this.getRolesApi();
  }

  receiveDataFromChild(e: TreeNodeInterface[]) {
    this.updatedListOfMapData = e;
  }

  createNotification(type, data): void {
    this.notification.create(type, data.message, '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
  }

  getRolesApi() {
    this.service.getRole().subscribe((data) => {
      if (data) {
        this.roleList = data.data;
        this.setActiveRole(this.roleList[0]);
      }
    });
  }

  getListofData(id) {
    this.service.getRoleMenuLevel(id).subscribe((data) => {
      if (data) {
        this.listOfMapData = data.data;
      }
    });
  }

  saveListofData(id, postData) {
    this.service.saveRoleMenuLevel(id, postData).subscribe((data) => {
      if (data) {
        this.createNotification('success', data);
      }
    });
  }

  setActiveRole(role: RoleMenuItem) {
    this.getRolesId = role?.idRoles;
    const listofData = this.roleList?.map((item) => {
      return item?.idRoles;
    });
    this.filteredList = listofData?.filter((item) => {
      return item === this.getRolesId;
    });
    this.activeRole = this.filteredList;
    this.getListofData(role?.idRoles);
  }

  onSave() {
    this.saveListofData(this.activeRole[0], this.updatedListOfMapData);
  }
}
