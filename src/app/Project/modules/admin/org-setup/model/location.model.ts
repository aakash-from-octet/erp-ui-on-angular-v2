export interface IlocationList {
  location: string;
  description: string;
  locationType: IlocationType[];
}

export interface IlocationType {
  id: number;
  name: string;
  parentLocationId: string;
  localCurrency: string;
  active;
}
