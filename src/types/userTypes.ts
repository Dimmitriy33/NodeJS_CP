export enum UserRoles {
  Admin = 1,
  User = 2
}

export interface IResetPassModel {
  id: string;
  newPassword: string;
  oldPassword: string;
}
