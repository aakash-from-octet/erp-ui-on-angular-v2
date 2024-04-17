import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TreeNodeInterface } from '../../model/rolepermission.model';

@Component({
  selector: 'app-rolepermission-table',
  templateUrl: './rolepermission-table.component.html',
  styleUrls: ['./rolepermission-table.component.css'],
})
export class RolepermissionTableComponent implements OnInit, OnChanges {
  @Input() listOfMapData: TreeNodeInterface[] = [];
  @Input() mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  @Output() checkboxChanged = new EventEmitter<void>();
  @Output() outputListOfData = new EventEmitter<TreeNodeInterface[]>();
  expandSet = new Set<string>();

  collapse(
    array: TreeNodeInterface[],
    data: TreeNodeInterface,
    $event: boolean
  ): void {
    if (!$event) {
      if (data.menus) {
        data.menus.forEach((d) => {
          const target = array.find((a) => a.hierarchy === d.hierarchy);
          if (target !== null && target !== undefined) {
            target.expand = false;
            this.collapse(array, target, false);
          }
        });
      } else if (data.subMenus) {
        data.subMenus.forEach((d) => {
          const target = array.find((a) => a.hierarchy === d.hierarchy);
          if (target !== null && target !== undefined) {
            target.expand = false;
            this.collapse(array, target, false);
          }
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop();
      if (node !== null && node !== undefined) {
        this.visitNode(node, hashMap, array);
        if (node.menus) {
          for (let i = node.menus.length - 1; i >= 0; i--) {
            if (node.level !== null && node.level !== undefined) {
              stack.push({
                ...node.menus[i],
                level: node.level + 1,
                expand: true,
                parent: node,
              });
            }
          }
        }
        if (node.subMenus) {
          for (let i = node.subMenus.length - 1; i >= 0; i--) {
            if (node.level !== null && node.level !== undefined) {
              stack.push({
                ...node.subMenus[i],
                level: node.level + 1,
                expand: true,
                parent: node,
              });
            }
          }
        }
      }
    }

    return array;
  }

  visitNode(
    node: TreeNodeInterface,
    hashMap: { [key: string]: boolean },
    array: TreeNodeInterface[]
  ): void {
    if (!hashMap[node.hierarchy]) {
      hashMap[node.hierarchy] = true;
      array.push(node);
    }
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listOfMapData']) {
      this.initializeComponent();
    }
  }

  initializeComponent() {
    setTimeout(() => {
      this.listOfMapData.forEach((item) => {
        this.mapOfExpandedData[item.idModule] = this.convertTreeToList(item);
      });

      this.setCheckBoxes(this.listOfMapData, this.mapOfExpandedData);
    }, 1000);
  }

  setCheckBoxes(listOfMapData, mapOfExpandedData) {
    for (const data of listOfMapData) {
      for (const item of mapOfExpandedData[data.idModule]) {
        item.isCheckedCreate = this.initializeCheckBox(item, 'CREATE');
        item.isCheckedEdit = this.initializeCheckBox(item, 'EDIT');
        item.isCheckedView = this.initializeCheckBox(item, 'VIEW');
        item.isCheckedDelete = this.initializeCheckBox(item, 'DELETE');
      }
    }
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  handleCheckboxChange(event, item: TreeNodeInterface, column: string) {
    const isChecked = event.target.checked;

    const localListOfMapData = JSON.parse(JSON.stringify(this.listOfMapData));
    for (let data of localListOfMapData) {
      if (item.moduleName) {
        if (data.idModule === item.idModule) {
          data = this.setAllowedOptions(data, isChecked, column);
          if (data.menus) {
            data.menus.map((menu) => {
              menu = this.setAllowedOptions(menu, isChecked, column);
              if (menu.subMenus) {
                menu.subMenus.map((submenu) => {
                  this.setAllowedOptions(submenu, isChecked, column);
                });
              }
            });
          }
        }
      } else {
        if (data.idModule === item.idModule) {
          if (data.menus) {
            data.menus.map((menu) => {
              if (menu.idAppMenu === item.idAppMenu) {
                menu.isCheckedCreate = isChecked;
                menu = this.setAllowedOptions(menu, isChecked, column);
                if (menu.subMenus) {
                  menu.subMenus.map(
                    (submenu) =>
                      (submenu = this.setAllowedOptions(
                        submenu,
                        isChecked,
                        column
                      ))
                  );
                }
                if (!isChecked) {
                  if (data.idModule === menu.idModule) {
                    data = this.setAllowedOptions(data, isChecked, column);
                  }
                } else {
                  if (this.checkStringInArraysModule(data.menus, column)) {
                    if (data.idModule === menu.idModule) {
                      data = this.setAllowedOptions(data, isChecked, column);
                    }
                  }
                }
              } else {
                if (menu.subMenus) {
                  menu.subMenus.map((submenu) => {
                    if (submenu.idAppMenu === item.idAppMenu) {
                      submenu = this.setAllowedOptions(
                        submenu,
                        isChecked,
                        column
                      );

                      if (!isChecked) {
                        if (menu.idAppMenu === submenu.parentMenu) {
                          menu = this.setAllowedOptions(
                            menu,
                            isChecked,
                            column
                          );
                        }
                        if (data.idModule === submenu.idModule) {
                          data = this.setAllowedOptions(
                            data,
                            isChecked,
                            column
                          );
                        }
                      } else {
                        if (
                          this.checkStringInArraysMenu(
                            menu.subMenus,
                            column,
                            item.idAppMenu
                          )
                        ) {
                          if (menu.idAppMenu === submenu.parentMenu) {
                            menu = this.setAllowedOptions(
                              menu,
                              isChecked,
                              column
                            );
                          }
                        }
                        if (
                          this.checkStringInArraysModule(data.menus, column)
                        ) {
                          if (data.idModule === submenu.idModule) {
                            data = this.setAllowedOptions(
                              data,
                              isChecked,
                              column
                            );
                          }
                        }
                      }
                    }
                  });
                }
              }
            });
          }
        }
      }
    }

    this.listOfMapData = localListOfMapData;
    this.initializeComponent();
    this.outputListOfData.emit(this.listOfMapData);
  }

  checkStringInArraysMenu(
    arrayOfObjects,
    searchString: string,
    excludedId
  ): boolean {
    return arrayOfObjects
      .filter((obj) => obj.idAppMenu !== excludedId) // Exclude the object with the excludedId
      .every((obj) => obj.allowedOptions.includes(searchString));
  }
  checkStringInArraysModule(arrayOfObjects, searchString: string): boolean {
    return arrayOfObjects.every((obj) =>
      obj.allowedOptions.includes(searchString)
    );
  }

  setAllowedOptions(item, isChecked: boolean, mode: string) {
    item.isCheckedCreate = isChecked;
    if (isChecked) {
      item.allowedOptions.push(mode);
      item.allowedOptions = Array.from(new Set(item.allowedOptions));
    } else {
      item.allowedOptions = Array.from(new Set(item.allowedOptions));
      const index = item.allowedOptions.indexOf(mode);
      if (index !== -1) {
        item.allowedOptions.splice(index, 1);
      }
    }
    return item;
  }

  initializeCheckBox(item: TreeNodeInterface, mode: string): boolean {
    return item.allowedOptions.some((s) => s.includes(mode));
  }
}
