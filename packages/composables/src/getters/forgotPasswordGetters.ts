import { ForgotPasswordGetters } from '@vue-storefront/core';
import type { ResetPasswordResponse } from '@vue-storefront/moqui-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getResetPasswordToken(result: ResetPasswordResponse): string {
  return '';
}

function isPasswordChanged(result: ResetPasswordResponse): boolean {
  return result?.updateSuccessful === true;
}

export const forgotPasswordGetters: ForgotPasswordGetters<ResetPasswordResponse> = {
  getResetPasswordToken,
  isPasswordChanged
};
