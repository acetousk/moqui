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
    // const apiState = context.$moqui.config.state;
    // if (!apiState.getCustomerLoggedIn()) {
    //   return null;
    // }
    console.log('###Run: useUser.load');
    try {
      const response = await context.$moqui.api.loadUser();
      return response;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logOut: async (context: Context, { currentUser }) => {
    // const apiState = context.$moqui.config.state;

    console.log('###Run: useUser.logOut');
    try {
      // TODO
      // console.log('context.$moqui.config.state.setCustomerLoggedIn')
      // console.log(context.$moqui.config)
      const response = await context.$moqui.api.logoutUser();

      // context.$moqui.config.state.setCustomerLoggedIn(false);
      // currentUser = null;
      return response;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser: async (context: Context, { currentUser, updatedUserData }) => {
    console.log('###Run: useUser.updateUser');
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
    console.log('###Run: useUser.register');
    try {
      const response = await context.$moqui.api.registerUser({
        email,
        firstName,
        lastName,
        password
      });

      return response;

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
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
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async (context: Context, { currentUser, currentPassword, newPassword }) => {
    console.log('Run: useUser.changePassword');
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
