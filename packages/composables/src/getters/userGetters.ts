import { UserGetters } from '@vue-storefront/core';
import type { User } from '@vue-storefront/moqui-api';

function getFirstName(user: User): string {
  return user.firstName || '';
}

function getLastName(user: User): string {
  return user.lastName || '';
}

function getFullName(user: User): string {
  return `${getFirstName(user)} ${getLastName(user)}`;
}

function getEmailAddress(user: User): string {
  return user?.emailAddress || '';
}

function getGender(user: User): string {
  return user?.gender || '';
}

export const userGetters: UserGetters<User> = {
  getFirstName,
  getLastName,
  getFullName,
  getEmailAddress,
  getGender
};
