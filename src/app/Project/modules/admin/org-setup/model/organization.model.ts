export interface IoraganizationList{
  id: number,
  name: string,
  orgCode: string,
  domainName: string,
  domainUrl: string,
  serviceStartDate: string,
  status: true,
  logo: string,
  createdBy: string,
  createdOn: string,
  updatedBy: string,
  lastUpdatedDate: string,
  billingAddressInfo:IbillingAddressInfo[],
  globalCurrency:IglobalCurrencyId[],
  contactInfo:IcontactInfo[],
  addressInfo:IaddressInfo[],
  contactAddressInfo:IcontactAddressInfo[]
}

  export interface IcontactAddressInfo{
   addressLine1:string,
   addressLine2:string,
   zipCode:string,
   state:string,
   country:string
  }

  export interface IaddressInfo{
    addressLine1: string,
    addressLine2: string,
    zipCode: string,
    state: string,
    country: string
  }
  export interface IcontactInfo{
    firstName: string,
    lastName: string,
    email: string,
    mobile: number
  }

export interface IglobalCurrencyId{
  id: number,
  currencyCode: string,
  description: string,
  currencyTypes: string
}

export interface IbillingAddressInfo{
addressLine1: string,
addressLine2: string,
zipCode: string,
state: string,
country: string
}
