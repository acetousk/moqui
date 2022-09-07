export type PaymentLinkResponse = {
  iframeUrl: string;
};

export type PaymentConfirmationResponse = {
  isValid: string;
  isSuccessful: string;
  isPending: string;
  isRejected: string;
};
