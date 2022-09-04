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
    try {
      const response = await context.$moqui.api.loadUser();
      return response;
    } catch (error) {
      // If we run into a 401, we got to return null so that the user state is reset
      if ((error.response?.data?.code || error.code) === 401) return null;
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  logOut: async (context: Context /* , { currentUser } */) => {
    try {
      context.$moqui.config.app.$cookies.remove('vsf-auth');
      await context.$moqui.api.logoutUser();
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  updateUser: async (context: Context, { /* currentUser, */ updatedUserData }) => {
    try {
      const response = await context.$moqui.api.updateUser({
        ...updatedUserData
      });

      return response;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  register: async (context: Context, { email, password, firstName, lastName }) => {
    try {
      const response = await context.$moqui.api.registerUser({
        emailAddress: email,
        firstName,
        lastName,
        password
      });

      return response?.customerInfo;

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  logIn: async (context: Context, { username, password }) => {
    try {
      const response = await context.$moqui.api.loginUser({
        username,
        password
      });

      if (response.forcePasswordChange) {
        throw {
          message: 'Your account requires a password change before login.',
          code: '403'
        };
      }

      return response?.customerInfo;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  changePassword: async (context: Context, { currentUser, currentPassword, newPassword }) => {
    try {
      const response = await context.$moqui.api.changePassword({
        username: currentUser.emailAddress,
        oldPassword: currentPassword,
        newPassword
      });

      return response;

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
};

export const useUser = useUserFactory<User, UpdateParams, RegisterParams>(params);
