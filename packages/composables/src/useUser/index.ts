import {
  Context,
  useUserFactory,
  UseUserFactoryParams
} from '@vue-storefront/core';
import type { User } from '@vue-storefront/moqui-api';
import type {
  UseUserUpdateParams as UpdateParams,
  UseUserRegisterParams as RegisterParams
} from '../types';

const params: UseUserFactoryParams<User, UpdateParams, RegisterParams> = {
  load: async (context: Context) => {
    console.log('###Run: useUser.load');
    try {
      const response = await context.$moqui.api.loadUser();
      return response;
    } catch (error) {
      throw { message: error.response?.data?.message || error };
    }
  },

  logOut: async (context: Context) => {
    console.log('###Run: useUser.logOut');
    try {
      const response = await context.$moqui.api.logoutUser();
      return response;
    } catch (error) {
      throw { message: error.response?.data?.message || error };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser: async (context: Context, { currentUser, updatedUserData }) => {
    console.log('###Run: useUser.updateUser');
    const response = await context.$moqui.api.updateUser({
      ...updatedUserData
    });

    return response;
  },

  register: async (context: Context, { emailAddress, password, firstName, lastName }) => {
    console.log('###Run: useUser.register');
    try {
      const response = await context.$moqui.api.registerUser({
        emailAddress,
        firstName,
        lastName,
        password
      });

      return response;

    } catch (error) {
      throw { message: error.response?.data?.message || error };
    }
  },

  logIn: async (context: Context, { username, password }) => {
    console.log('###Run: useUser.logIn');
    try {
      const response = await context.$moqui.api.loginUser({
        username,
        password
      });

      return response;

    } catch (error) {
      throw { message: error.response?.data?.message || error };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async (context: Context, { currentUser, currentPassword, newPassword }) => {
    console.log('Mocked: useUser.changePassword');
    try {
      const response = await context.$moqui.api.changePassword({
        currentPassword,
        newPassword
      });

      return response;

    } catch (error) {
      throw { message: error.response?.data?.message || error };
    }
  }
};

export const useUser = useUserFactory<User, UpdateParams, RegisterParams>(params);
