import type { ContactInfo } from '@store/types/ContactInfo';

class ContactInfoService {
  public static getContactInfo(): Promise<ContactInfo[]> {
    return new Promise((resolve) => {
      resolve([
        {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          hireDate: '2022-01-15T00:00:00Z',
          address: {
            street1: '100 Elm St.',
            street2: 'Apt 1200',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'USA',
          },
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          age: undefined,
          hireDate: '2020-04-20T00:00:00Z',
          address: {
            street1: '200 Oak St.',
            street2: undefined,
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
        },
        {
          firstName: 'Alice',
          lastName: 'Johnson',
          age: 40,
          hireDate: '2024-02-14T00:00:00Z',
          address: {
            street1: '300 Maple Ave.',
            street2: 'Suite 500',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101',
            country: 'USA',
          },
        },
        {
          firstName: 'Bob',
          lastName: 'Brown',
          age: undefined,
          hireDate: '2005-07-28T00:00:00Z',
          address: {
            street1: '400 Pine St.',
            street2: undefined,
            city: 'Detroit',
            state: 'MI',
            zipCode: '48201',
            country: 'USA',
          },
        },
        {
          firstName: 'Charlie',
          lastName: 'Davis',
          age: 50,
          hireDate: '2009-06-14T00:00:00Z',
          address: {
            street1: '500 Cedar Blvd.',
            street2: undefined,
            city: 'Nashville',
            state: 'TN',
            zipCode: '37011',
            country: 'USA',
          },
        },
      ]);
    });
  }
}

export default ContactInfoService;
