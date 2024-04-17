export interface IvendorList {
  id: number;
  name: string;
  vendorCode: 123;
  vendorType: string;
  logo: string;
  isActive: boolean;
  createdDate: string;
  createdBy: string;
  updatedAt: string;
  deactivationDate: null;
  addressInfo?: IaddressInfo[];
  contactInfo?: IcontactInfo[];
}

export interface IcontactInfo {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
}

export interface IaddressInfo {
  id: number;
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  state: string;
  country: string;
}

