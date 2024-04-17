import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { UiCommonService } from 'src/app/Project/shared/services/ui-common/ui-common.service';
import { UtilityService } from 'src/app/Project/shared/services/utility-service.service';
import { regex } from 'src/environments/environment.development';
import { UserService } from '../../services/user.service';

interface FlatNode {
  id;
  name: string;
  level: number;
  disabled: boolean;
  expandable: boolean;
  highlighted: boolean;
}

interface TreeNode {
  id;
  name: string;
  disabled?: boolean;
  children?: TreeNode[];
}

@Component({
  selector: 'app-users-main-page',
  templateUrl: './users-main-page.component.html',
  styleUrls: ['./users-main-page.component.css'],
})
export class UsersMainPageComponent implements OnInit {
  locationselectedNodes: FlatNode[] = [];
  brandselectedNodes: FlatNode[] = [];
  categoryselectedNodes: FlatNode[] = [];
  isVisible = false;
  viewUser = false;
  isEdit = false;
  inputValue = 1;
  avatarUrl?: string;
  loading = false;
  tabSelected = 1;
  isGridModal = false;
  listOfCurrentPageData = [];
  checked = false;
  indeterminate = false;
  userForm: FormGroup;
  usersList;
  userById;
  setOfCheckedId = new Set<number>();
  userType = [
    { id: 'INTERNAL', name: 'INTERNAL' },
    { id: 'EXTERNAL', name: 'EXTERNAL' },
  ];
  globalCurrencyData;
  roleData;
  locationsSelect: TreeNode[];
  brandsSelect: TreeNode[];
  categorySelect: TreeNode[];
  viewUserData;
  locationFlatNodeArray: FlatNode[] = [];
  brandFlatNodeArray: FlatNode[] = [];
  categoryFlatNodeArray: FlatNode[] = [];
  editUserId;
  currentPageIndex = 1;
  pageSize = 10;
  filteredData;
  totalItems = 0;
  checkBoxValueUpdate = [];
  searchText = '';
  subscription: Subscription;
  columnStates: { [key: string]: boolean } = {};
  columns: string[] = [
    'User Name',
    'User Code',
    'Employee Id',
    'Email Id',
    'Contact',
    'User Role',
    'Reports To',
    'User Type',
    'Location',
    'Status',
  ];

  newColumns: string[];
  columnMap: Map<string, string>;
  valueArray: string[];
  filterState = new Map<string, string[]>();

  activeUserList;

  // preview dropdown values

  reportsToPreview;
  // drop down variables

  contactCode = [
    { id: '+91', value: '+91' },
    { id: '+92', value: '+92' },
  ];
  reportsTodata;
  selectedUserRole;
  getLogo: string;
  uploadFile: File;
  errorMessage = false;
  userCodeApiValue;
  inputUserCode;
  isSmallScreen = false;
  constructor(
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private userService: UserService,
    private uiService: UiCommonService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.onGetAllUsers();
    this.onGetAllActiveUsers();
    this.inititalForm();
    this.getLocations();
    this.getBrands();
    this.getCategory();
    this.getRoles();
    this.getGlobalCurrency();

    setTimeout(() => {
      this.columnMapSet();
      this.resetFilter();
    }, 200);

    this.uiService.getWindowWidth().subscribe((width) => {
      this.isSmallScreen = width < 992;
    });
  }

  columnMapSet() {
    this.columnMap = new Map();
    this.columnMap.set('userName', 'User Name');
    this.columnMap.set('name', 'User Code');
    this.columnMap.set('employeeId', 'Employee Id');
    this.columnMap.set('email', 'Email Id');
    this.columnMap.set('mobile', 'Contact');
    this.columnMap.set('roles,name', 'User Role');
    this.columnMap.set('reportsToName', 'Reports To');
    this.columnMap.set('userType', 'User Type');
    this.columnMap.set('locations.locationName', 'Location');
    this.columnMap.set('enabled', 'Status');
    this.newColumns = [...this.columnMap.values()];
  }

  filterData(): void {
    this.currentPageIndex = 1;
    this.listOfCurrentPageData = this.utilityService.filterTable(
      this.usersList,
      this.searchText
    );
  }

  getValueArray(keyName: string): string[] {
    return this.utilityService.getValueArray(this.usersList, keyName);
  }

  search(searchString: string, keyName: string) {
    this.listOfCurrentPageData = this.utilityService.search(
      this.usersList,
      searchString,
      keyName,
      this.currentPageIndex,
      this.pageSize
    );
  }

  sort(sortOrder: string, keyName: string) {
    this.listOfCurrentPageData = this.utilityService.sort(
      this.usersList,
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
      this.usersList,
      this.filterState,
      filterValue,
      columnName,
      this.currentPageIndex,
      this.pageSize
    );
  }

  // table methods

  pageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadTableData(this.currentPageIndex, size);
  }

  loadTableData(pageIndex: number, pageSize: number): void {
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = pageIndex * pageSize;
    this.listOfCurrentPageData = this.usersList?.slice(startIndex, endIndex);
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ idUser }) => {
      this.setCheckBox(idUser, checked);
    });
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData;
    this.checked = listOfEnabledData.every(({ idUser }) =>
      this.setOfCheckedId.has(idUser)
    );
    this.indeterminate =
      listOfEnabledData.some(({ idUser }) => this.setOfCheckedId.has(idUser)) &&
      !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.setCheckBox(id, checked);
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

  onStatusChange(data) {
    if (data.enabled === true) {
      const tableId = data.idUser;
      this.userService.activeToInActive(tableId).subscribe(() => {
        this.onGetAllUsers();
      });
    } else {
      const tableId = data.idUser;
      this.userService.inactiveToActive(tableId).subscribe(() => {
        this.onGetAllUsers();
      });
    }
  }

  // table methods ends

  showModal(create: number) {
    this.tabSelected = create;
    this.isVisible = true;
    this.getLogo = '';
  }
  handleCancel() {
    this.userForm.reset();
    this.userForm.patchValue({ mobileCode: this.contactCode[0].value });
    this.isVisible = false;
    this.viewUser = false;
    this.isGridModal = false;
    this.userById = null;
    this.isEdit = false;
    this.locationFlatNodeArray = [];
    this.brandFlatNodeArray = [];
    this.categoryFlatNodeArray = [];
    this.userForm.get('userCode').enable();
    this.userForm.get('email').enable();
    this.userForm.get('userType').enable();
  }
  handleOk() {
    this.isVisible = false;
    this.viewUser = false;
    this.isGridModal = false;
  }
  handleChange(info: { file: NzUploadFile }): void {
    this.uploadFile = info.file.originFileObj;

    if (info.file && info.file.originFileObj) {
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.getLogo = img;
      });
    } else {
      // Handle the case where `info.file` or `info.file.originFileObj` is null or undefined
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
  back() {
    if (this.tabSelected < 7 && this.tabSelected > 1) {
      this.tabSelected--;
    }
  }
  saveContinue() {
    if (this.tabSelected < 7 && this.tabSelected > 0) {
      // Create temporary variables to store the selected nodes
      const tempLocationNodes = this.locationselectedNodes;
      const tempBrandNodes = this.brandselectedNodes;
      const tempCategoryNodes = this.categoryselectedNodes;

      // Increment the tabSelected
      this.tabSelected++;

      // Check if tabSelected is 6, assign temporary values to locationFlatNodeArray, brandFlatNodeArray, and categoryFlatNodeArray
      if (this.tabSelected === 6) {
        this.locationFlatNodeArray = tempLocationNodes;
        this.brandFlatNodeArray = tempBrandNodes;
        this.categoryFlatNodeArray = tempCategoryNodes;
      }
    }
  }

  update() {
    this.isVisible = false;
  }
  updateTabSelected(tab: number) {
    this.tabSelected = tab;
  }
  // notification method
  createNotification(type, data, message): void {
    this.notification.create(type, data.message, message, {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }

  openViewModal(data) {
    this.getLogoApi(data);
    this.viewUser = true;
    this.onGetUserById(data);
  }
  editModal(tabNumber: number) {
    this.tabSelected = tabNumber;
    this.isEdit = true;
    this.viewUser = false;
    this.isVisible = true;
  }

  editUsers(data) {
    this.editModal(1);
    this.editUserId = data.idUser;
    this.onGetUserById(data.idUser);
  }

  updateUser() {
    if (this.userForm.valid) {
      const payload = {
        userName: this.f['userCode'].value ?? null,
        name: this.f['name'].value ?? null,
        mobile:
          (this.f['mobileCode'].value ?? null) +
          (this.f['mobile'].value ?? null),
        email: this.f['email'].value ?? null,
        enabled: true,
        userType: this.f['userType'].value ?? null,
        vendorId: null,
        employeeId: this.f['employeeId'].value ?? null,
        reportsTo: this.f['reportsTo'].value ?? null,
        department: this.f['department'].value ?? null,
        designation: this.f['designation'].value ?? null,
        credentials: [
          {
            type: 'password',
            value: '123',
            temporary: true,
          },
        ],
        roles: [
          {
            idRoles: this.f['userRole'].value ?? null,
          },
        ],
        locations: this.locationselectedNodes,
        brands: this.brandselectedNodes,
        categories: this.categoryselectedNodes,
      };
      this.userService
        .updateUserWithLogo(this.editUserId, payload, this.uploadFile)
        .subscribe((data) => {
          if (data.statuscode === 200) {
            this.createNotification(
              'success',
              data,
              'User updated successfully !'
            );
            this.clearFormData();
            this.onGetAllUsers();
          } else {
            this.createNotification('error', data, 'Error updating User !');
          }
        });
    }
  }

  openGridModal() {
    this.isGridModal = true;
  }

  // Method to handle role selection
  onRoleSelect(selectedRole) {
    this.selectedUserRole = selectedRole; // Update the selectedRole variable with the selected role object
  }

  get f() {
    return this.userForm.controls;
  }

  inititalForm() {
    this.userForm = this.fb.group({
      profilePic: [''],
      userCode: ['', Validators.required],
      employeeId: [''],
      name: ['', Validators.required],
      mobileCode: [this.contactCode[0].value, Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(regex.email)]],
      reportsTo: [''],
      userType: ['', Validators.required],
      userRole: ['', Validators.required],
      department: [''],
      designation: [''],
      globalCurrency: [''],
    });
  }

  onCreateUser() {
    if (this.userForm.valid) {
      const payload = {
        userName: this.f['userCode'].value ?? null,
        name: this.f['name'].value ?? null,
        mobile:
          (this.f['mobileCode'].value ?? null) +
          (this.f['mobile'].value ?? null),
        email: this.f['email'].value ?? null,
        enabled: true,
        userType: this.f['userType'].value ?? null,
        vendorId: null,
        employeeId: this.f['employeeId'].value ?? null,
        reportsTo: this.f['reportsTo'].value ?? null,
        department: this.f['department'].value ?? null,
        designation: this.f['designation'].value ?? null,
        credentials: [
          {
            type: 'password',
            value: '123',
            temporary: true,
          },
        ],
        roles: [
          {
            idRoles: this.f['userRole'].value ?? null,
          },
        ],
        locations: this.locationselectedNodes,
        brands: this.brandselectedNodes,
        categories: this.categoryselectedNodes,
      };
      this.userService
        .uploadLogo(payload, this.uploadFile)
        .subscribe((data) => {
          if (data.statuscode === 201) {
            this.createNotification(
              'success',
              data,
              'User created successfully !'
            );
            this.onGetAllUsers();
            this.clearFormData();
          } else {
            this.createNotification('error', data, 'Error creating user !');
          }
        });
    }
  }

  // get and post api's

  onGetAllUsers() {
    this.userService.getUsersList().subscribe((data) => {
      this.usersList = data;
      this.listOfCurrentPageData = data;
      this.totalItems = this.usersList.length;
      this.pageSizeChange(this.pageSize);
    });
  }
  onGetAllActiveUsers() {
    this.userService.getActiveUsersList().subscribe((data) => {
      this.activeUserList = data;
    });
  }

  onGetUserById(id) {
    this.userService.getUserById(id).subscribe((data) => {
      this.userById = data.data;

      const mobile = this.userById?.mobile; // Assuming data.mobile contains the full mobile number like "+91123456780"
      const mobileCode = mobile?.substring(0, 3); // Get the first three characters
      const mobileNumber = mobile?.substring(3); // Get the rest of the characters after the first three
      this.userForm.patchValue({
        profilePic: '',
        userCode: this.userById.userName,
        employeeId: this.userById.employeeId,
        name: this.userById.name,
        mobileCode: mobileCode,
        mobile: mobileNumber,
        email: this.userById.email,
        reportsTo: this.userById.reportsTo,
        userType: this.userById.userType,
        userRole: this.userById.roles[0]?.idRoles,
        department: this.userById.department,
        designation: this.userById.designation,
        globalCurrency: [],
      });
      this.userForm.get('userCode').disable();
      this.userForm.get('email').disable();
      this.userForm.get('userType').disable();
      const locationFlatNodeArrayWithDuplicates: FlatNode[] = [];
      this.userById.locations.forEach((location) => {
        const flatNode: FlatNode = {
          id: location.id, // Your ID value
          name: location.locationName,
          level: 0, // Your level value
          disabled: false, // Your disabled value
          expandable: true,
          highlighted: false,
        };
        locationFlatNodeArrayWithDuplicates.push(flatNode);
      });

      const brandFlatNodeArrayWithDuplicates: FlatNode[] = [];

      this.userById.brands.forEach((brand) => {
        const flatNode: FlatNode = {
          id: brand.id,
          name: brand.name,
          level: 0,
          disabled: false,
          expandable: true,
          highlighted: false,
        };
        brandFlatNodeArrayWithDuplicates.push(flatNode);
      });

      const categoryFlatNodeArrayWithDuplicates: FlatNode[] = [];

      this.userById.categories.forEach((category) => {
        const flatNode: FlatNode = {
          id: category.id,
          name: category.name,
          level: 0,
          disabled: false,
          expandable: true,
          highlighted: false,
        };
        categoryFlatNodeArrayWithDuplicates.push(flatNode);
      });

      this.locationFlatNodeArray = Array.from(
        new Set(locationFlatNodeArrayWithDuplicates)
      );
      this.brandFlatNodeArray = Array.from(
        new Set(brandFlatNodeArrayWithDuplicates)
      );
      this.categoryFlatNodeArray = Array.from(
        new Set(categoryFlatNodeArrayWithDuplicates)
      );

      this.locationselectedNodes = this.locationFlatNodeArray;
      this.brandselectedNodes = this.brandFlatNodeArray;
      this.categoryselectedNodes = this.categoryFlatNodeArray;
    });
  }

  getLocationNames(locations): string {
    if (!locations) {
      return '';
    }
    return locations.map((location) => location.locationName).join(', ');
  }

  getLocations() {
    this.userService.getLocations().subscribe((data) => {
      this.locationsSelect = this.convertToTreeNodeLocations(data);
    });
  }

  getBrands() {
    this.userService.getBrands().subscribe((data) => {
      this.brandsSelect = this.convertToTreeNodeBrands(data);
    });
  }

  getCategory() {
    this.userService.getCategory().subscribe((data) => {
      this.categorySelect = this.convertToTreeNodeCategory(data);
    });
  }

  getRoles() {
    this.userService.getRoles().subscribe((data) => {
      this.roleData = data;
    });
  }

  getGlobalCurrency() {
    this.userService.getGlobalCurrency().subscribe((data) => {
      this.globalCurrencyData = data;
    });
  }

  convertToTreeNodeLocations(data): TreeNode[] {
    return data.map((location) => {
      const children = location.childLocations
        ? this.convertToTreeNodeLocations(location.childLocations)
        : [];
      const treeNode: TreeNode = {
        id: location.id,
        name: `${location.locationName} `,
        children: children,
      };

      return treeNode;
    });
  }

  convertToTreeNodeBrands(data): TreeNode[] {
    return data.map((brand) => {
      const children = brand.childBrands
        ? this.convertToTreeNodeBrands(brand.childBrands)
        : [];
      const treeNode: TreeNode = {
        id: brand.id,
        name: `${brand.name}`,
        children: children,
      };
      return treeNode;
    });
  }

  convertToTreeNodeCategory(data): TreeNode[] {
    return data.map((category) => {
      const children = category.childCategories
        ? this.convertToTreeNodeCategory(category.childCategories)
        : [];
      const treeNode: TreeNode = {
        id: category.id,
        name: `${category.name} `,
        children: children,
      };

      return treeNode;
    });
  }

  onLocationSelectedNodesChange(selectedNodes: FlatNode[]): void {
    this.locationselectedNodes = selectedNodes;
  }

  onBrandSelectedNodesChange(selectedNodes: FlatNode[]): void {
    this.brandselectedNodes = selectedNodes;
  }

  onCategorySelectedNodesChange(selectedNodes: FlatNode[]): void {
    this.categoryselectedNodes = selectedNodes;
  }

  concatItems(items, propertyName: string): string {
    if (!items) {
      return ''; // or any default value you prefer
    }
    return items.map((item) => item[propertyName]).join(', ');
  }

  bulkActive() {
    this.userService
      .inactiveToActive(this.checkBoxValueUpdate?.join(','))
      .subscribe((data) => {
        if (data) {
          this.onGetAllUsers();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.refreshCheckedStatus();
          this.checkBoxValueUpdate = [];
        }
      });
  }
  bulkDeactive() {
    this.userService
      .activeToInActive(this.checkBoxValueUpdate?.join(','))
      .subscribe((data) => {
        if (data) {
          this.onGetAllUsers();
          for (const data of this.checkBoxValueUpdate) {
            this.updateCheckedSet(data, false);
          }
          this.refreshCheckedStatus();
          this.checkBoxValueUpdate = [];
        }
      });
  }
  resetFilter() {
    for (const column of this.columns) {
      this.columnStates[column] = true;
    }
    this.searchText = '';
    this.filterState = new Map<string, string[]>();
    this.loadTableData(this.currentPageIndex, this.pageSize);
  }

  onFocusOutEvent(event) {
    this.inputUserCode = event?.target?.value;
    this.userService
      .getUserCodeError(event?.target?.value)
      .subscribe((data) => {
        this.userCodeApiValue = data?.data?.userCode;
        if (data?.data?.userCode === this.inputUserCode) {
          this.errorMessage = true;
        } else {
          this.errorMessage = false;
        }
      });
    this.errorMessage = false;
  }
  onInput(ev) {
    if (
      ev.target.value.length === 0 ||
      ev.target.value != this.userCodeApiValue
    ) {
      this.errorMessage = false;
    }
  }

  cancel() {
    this.isGridModal = false;
    this.resetFilter();
  }
  downloadUserList() {
    this.userService.getBlob().subscribe((data: Blob) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  // Get Dropdown data by Id

  getLabel(id, array, value, label): string {
    const option = array.find((option) => option?.[value] === id);
    // If an option with the provided value is found, return its label; otherwise, return an empty string
    return option ? option?.[label] : '';
  }

  getLogoApi(id) {
    this.userService.getLogo(id).subscribe((data) => {
      this.getLogo = data;
    });
  }
  clearFormData() {
    this.locationFlatNodeArray = [];
    this.brandFlatNodeArray = [];
    this.categoryFlatNodeArray = [];
    this.userForm.reset();
  }
}
