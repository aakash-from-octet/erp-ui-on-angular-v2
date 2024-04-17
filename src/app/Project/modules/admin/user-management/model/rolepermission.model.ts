export interface TreeNodeInterface {
  idModule?: number;
  moduleName?: string;
  description?: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  menus?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  idAppMenu?: number;
  menuName?: string;
  parentMenu?;
  roles?;
  subMenus?: TreeNodeInterface[];
  allowedOptions?;
  hierarchy?:string;
  isCheckedCreate?:boolean;
  isCheckedEdit?:boolean;
  isCheckedView?:boolean;
  isCheckedDelete?:boolean;
}
export interface RoleMenuItem {
  idRoles;
  name: string;
  isActive: boolean;
}
