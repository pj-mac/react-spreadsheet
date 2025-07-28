export interface Address {
  street1: string;
  street2?: string;
  country: string;
  city: string;
  state?: string;
  zipCode?: string;
  label?: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  age?: number;
  address: Address;
  hireDate: string;
}
