export class userInfo {
  user_owner_info: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  address?: string;
}
export class userAddress {
  userId: string; // ID del usuario al que se le asignará la dirección
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
