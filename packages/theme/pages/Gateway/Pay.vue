<template>
  <div>
    <SfLoader :class="{ loading: paymentsLoading }" :loading="paymentsLoading">
      <div class="full-height">
        <div v-if="!paymentLinkError && paymentLink && paymentLink.iframeUrl">
          <iframe :src="paymentLink.iframeUrl"></iframe>
        </div>
        <div v-else style="text-align: center">
          <div class="icon-container">
            <SfIcon
              icon="error"
              color="red-primary"
              size="xl4"
              style="margin: auto"
            />
          </div>
          {{ $t('Your payment link has expired') }}
        </div>
        <div></div>
      </div>
    </SfLoader>
  </div>
</template>
<script>
import { SfLoader, SfIcon, SfImage } from '@storefront-ui/vue';
import { computed, useRouter, onMounted } from '@nuxtjs/composition-api';
import { usePayment } from '@vue-storefront/moqui';

export default {
  name: 'GatewayPay',
  components: {
    SfLoader,
    SfIcon,
    SfImage
  },
  setup(props, context) {
    const router = useRouter();
    const {
      getPaymentLink,
      paymentLink,
      error,
      loading: paymentsLoading
    } = usePayment();

    const paymentLinkError = computed(() => error.value.getPaymentLink);

    onMounted(async () => {
      await getPaymentLink();
      if (paymentLinkError.value) {
        const paymentRoute = context.root.localeRoute({ name: 'payment' });
        router.push(paymentRoute);
      }
    });

    return {
      paymentLinkError,
      paymentLink,
      paymentsLoading
    };
  }
};
</script>

<style lang="scss" scoped>
.full-height {
  height: 85vh;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
.icon-container {
  width: 39px;
  height: 39px;
  margin: auto;
  padding: 10px;
}

iframe {
  display: block; /* iframes are inline by default */
  background: rgb(240, 240, 240);
  border: none; /* Reset default border */
  height: 80vh; /* Viewport-relative units */
  width: 95vw;
  margin: auto;
}
.sf-button {
  &__action {
    margin: auto;
    margin-top: var(--spacer-sm);
  }
}
</style>
