<template>
  <SfModal v-e2e="'post-pay-modal'" visible class="modal" :cross="false">
    <template #modal-bar>
      <SfBar class="sf-modal__bar" :title="$t('Payment Status')" />
    </template>
    <SfLoader :class="{ loading: loading }" :loading="loading">
      <div>
        <template v-if="paymentConfirmationError">
          <div class="icon-container">
            <SfIcon
              icon="error"
              color="red-primary"
              size="xl4"
              style="margin: auto"
            />
          </div>
          <div>
            {{ $t('Payment something went wrong') }}
          </div>
        </template>
        <template v-else>
          <div v-if="status == 'pending'">
            <div class="icon-container">
              <SfIcon
                icon="error"
                color="red-primary"
                size="xl4"
                style="margin: auto"
              />
            </div>
            {{ $t('Were verifying your transaction') }}
          </div>
          <div v-if="status == 'success'">
            <div class="icon-container">
              <SfIcon
                icon="check"
                color="green-primary"
                size="xl4"
                style="margin: auto"
              />
            </div>
            {{ $t('Payment accepted', transactionId) }}
            <br />
            <br />
            <div style="text-align: center">
              {{ $t('Thank you for choosing') }}
            </div>
          </div>
          <div v-if="status == 'failed'">
            <div class="icon-container">
              <SfIcon
                icon="error"
                color="red-primary"
                size="xl4"
                style="margin: auto"
              />
            </div>
            {{ $t('Thank you for using the online payment service') }}
            <div>{{ $t('You will be redirected') }}</div>
          </div>
        </template>
        <div>
          <SfButton
            class="sf-button sf-button__action"
            link="/checkout/payment"
          >
            {{ $t('Return') }}
          </SfButton>
        </div>
      </div>
    </SfLoader>
  </SfModal>
</template>
<script>
/* eslint-disable camelcase */
import {
  SfModal,
  SfButton,
  SfLoader,
  SfBar,
  SfInput,
  SfIcon
} from '@storefront-ui/vue';
import { computed, watch, useRoute, useRouter } from '@nuxtjs/composition-api';
import { usePayment } from '@vue-storefront/moqui';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'GatewayPostPay',
  components: {
    SfButton,
    SfModal,
    SfLoader,
    SfBar,
    SfInput,
    SfIcon
  },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const { getPaymentConfirmation, paymentConfirmation, error, loading } =
      usePayment();

    const paymentConfirmationError = computed(
      () => error.value.getPaymentConfirmation
    );

    const verifyPayment = async () => {
      const hmac = route.value.query.hmac;
      const amount_cents = route.value.query.amount_cents;
      const created_at = route.value.query.created_at;
      const currency = route.value.query.currency;
      const error_occured = route.value.query.error_occured;
      const has_parent_transaction = route.value.query.has_parent_transaction;
      const id = route.value.query.id;
      const integration_id = route.value.query.integration_id;
      const is_3d_secure = route.value.query.is_3d_secure;
      const is_auth = route.value.query.is_auth;
      const is_capture = route.value.query.is_capture;
      const is_refunded = route.value.query.is_refunded;
      const is_standalone_payment = route.value.query.is_standalone_payment;
      const is_voided = route.value.query.is_voided;
      const order = route.value.query.order;
      const owner = route.value.query.owner;
      const pending = route.value.query.pending;
      const sdSubType = route.value.query['source_data.sub_type'];
      const sdType = route.value.query['source_data.type'];
      const sdPan = route.value.query['source_data.pan'];
      const success = route.value.query.success;

      await getPaymentConfirmation({
        hmac,
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order,
        owner,
        pending,
        'source_data.sub_type': sdSubType,
        'source_data.type': sdType,
        'source_data.pan': sdPan,
        success
      });
    };

    const status = computed(() => {
      if (
        !paymentConfirmationError.value &&
        paymentConfirmation.value?.isValid
      ) {
        if (paymentConfirmation.value?.isPending === true) {
          return 'pending';
        } else if (paymentConfirmation.value?.isSuccessful === true) {
          return 'success';
        } else {
          return 'failed';
        }
      } else {
        return 'failed';
      }
    });

    const transactionId = computed(() => paymentConfirmation.value?.id);
    const orderId = computed(() => paymentConfirmation.value?.order);

    watch(
      status,
      (newVal) => {
        if (typeof window !== 'undefined') {
          const thankYouPage = context.root.localeRoute({
            name: 'thank-you'
          });
          const paymentPage = context.root.localeRoute({ name: 'payment' });

          if (newVal === 'success') {
            setTimeout(() => {
              router.push({
                ...thankYouPage,
                query: {
                  order: route.value.query.merchant_order_id
                }
              });
            }, 5000);
          } else if (newVal === 'failed') {
            setTimeout(() => {
              router.push(paymentPage);
            }, 5000);
          }
        }
      },
      { immediate: true }
    );

    onSSR(async () => {
      await verifyPayment();
    });

    return {
      loading,
      status,
      orderId,
      transactionId,
      paymentConfirmation,
      paymentConfirmationError
    };
  }
};
</script>

<style lang="scss" scoped>
body {
  margin: 0; /* Reset default margin */
}
.sf-modal {
  --modal-index: 3;
  --overlay-z-index: 3;
}

.sf-button {
  &__action {
    margin: auto;
    margin-top: var(--spacer-sm);
  }
}
.icon-container {
  width: 39px;
  height: 39px;
  margin: auto;
  padding: 10px;
}
</style>
