import {
  Context,
  useForgotPasswordFactory,
  UseForgotPasswordFactoryParams
} from '@vue-storefront/core';

const factoryParams: UseForgotPasswordFactoryParams<any> = {
  resetPassword: async (context: Context, { email /* , customQuery */ }) => {
    try {
      const { data } = await context.$moqui.api.resetPassword({
        email
      });

      return data;

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  },

  setNewPassword: async (context: Context, { tokenValue, newPassword, customQuery }) => {
    try {
      const { data } = await context.$moqui.api.setNewPassword({
        token: tokenValue,
        email: customQuery.email,
        newPassword: newPassword
      });

      return data;

    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        code: error.response?.data?.code || error.code
      };
    }
  }
};

export const useForgotPassword = useForgotPasswordFactory<any>(factoryParams);
