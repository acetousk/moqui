<template>
  <div class="sf-shipping">
    <SfHeading :title="$t('Shipping')" :level="2" class="sf-heading--left sf-heading--no-underline title" />
    <SfLoader :class="{ loading }" :loading="loading">
      <div class="form">
        <div class="form__radio-group" data-testid="shipping-method">
          <ShippingProvider :shipping-methods="shippingMethods" :selected-method="selectedMethod"
            @save="selectMethod" />
        </div>
      </div>
    </SfLoader>
    <div class="summary__action">
      <SfButton type="button" class="sf-button color-secondary summary__back-button" @click.prevent="$emit('go-back')">
        {{ $t('Go back') }}
      </SfButton>
      <SfButton v-e2e="'continue-to-payment'" :disabled="!selectedMethod" type="button" @click="saveShippingMethod">
        {{ $t('Continue to payment') }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import { SfButton, SfRadio, SfLink, SfLoader, SfHeading } from '@storefront-ui/vue';
import { onSSR } from '@vue-storefront/core';
import { ref, computed, useRouter } from '@nuxtjs/composition-api';
import { useShippingProvider, useCart } from '@vue-storefront/moqui';
import { useUiNotification } from '~/composables';
import ShippingProvider from '~/components/Checkout/ShippingProvider.vue';

export default {
  name: 'Shipping',
  components: {
    SfButton,
    SfRadio,
    SfLink,
    SfLoader,
    SfHeading,
    ShippingProvider
  },
  setup(props, context) {
    const router = useRouter();
    const { send: sendNotification } = useUiNotification();
    const { load: loadShippingProvider, state: shippingMethods, save, loading, error } = useShippingProvider();
    const { cart } = useCart();

    const shippingProviderSaveError = computed(() => error.value.save);
    const cartShipmentMethodRefId = computed(() => cart.value?.orderPart?.carrierPartyId && `${cart.value.orderPart.carrierPartyId}-${cart.value.orderPart.shipmentMethodEnumId}`);

    const selectedMethod = ref(cartShipmentMethodRefId.value || null);
    const selectMethod = async (method) => {
      selectedMethod.value = method.referenceId;
    };

    const saveShippingMethod = async () => {
      const shipmentMethod = shippingMethods.value.find(method => method.referenceId === selectedMethod.value);
      await save({ shippingMethod: { shipmentMethodId: shipmentMethod.shipmentMethodId, carrierId: shipmentMethod.carrierId } });

      if (shippingProviderSaveError.value) {
        sendNotification({
          id: Symbol('shipping_address_update_failed'),
          message: context.root.$t('Shipping method not set'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'Shipping Method'
        });
      } else {
        sendNotification({
          id: Symbol('shipping_address_updated'),
          message: context.root.$t('Shipping method set'),
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'Shipping Method'
        });
        router.push(context.root.localePath({ name: 'payment' }));
      }
    };

    onSSR(async () => {
      await loadShippingProvider();
      if (cartShipmentMethodRefId.value) {
        selectedMethod.value = cartShipmentMethodRefId.value;
      }
    });

    return {
      cartShipmentMethodRefId,
      shippingMethods,
      selectedMethod,
      selectMethod,
      saveShippingMethod,
      loading
    };
  }
};
</script>

<style lang="scss" scoped>
.sf-shipping {
  .title {
    --heading-padding: var(--spacer-xl) 0 var(--spacer-lg);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-title-font-size: var(--h3-font-size);

    &:not(:first-of-type) {
      --heading-padding: var(--spacer-base) 0;
    }

    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      --heading-padding: var(--spacer-xl) 0;
    }
  }

  .form {
    &__element {
      margin: 0 0 var(--spacer-base) 0;

      &:last-of-type {
        margin: 0;
      }
    }

    &__group {
      display: flex;
      align-items: center;
    }

    &__select {
      display: flex;
      align-items: center;
      --select-option-font-size: var(--font-size--base);
      --select-dropdown-color: blue;

      ::v-deep .sf-select__dropdown {
        margin: 0 0 2px 0;
        font-size: var(--font-size--base);
        font-family: var(--font-family--secondary);
        color: var(--c-link);
      }
    }

    &__radio {
      margin: var(--spacer-xs) 0;

      &:last-of-type {
        margin: var(--spacer-xs) 0 var(--spacer-xl);
      }

      ::v-deep .sf-radio__container {
        --radio-container-padding: var(--spacer-xs);

        @include for-desktop {
          --radio-container-padding: var(--spacer-xs) var(--spacer-xs) var(--spacer-xs) var(--spacer-sm);
        }
      }
    }

    @include for-desktop {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      &:last-of-type {
        margin: 0 calc(var(--spacer-2xl) - var(--spacer-sm)) 0 0;
      }

      &__element {
        margin: 0 0 var(--spacer-sm) 0;
        flex: 0 0 100%;

        &--half {
          flex: 1 1 50%;

          &-even {
            padding: 0 0 0 var(--spacer-base);
          }
        }
      }

      &__radio-group {
        flex: 0 0 calc(100% + var(--spacer-sm));
        margin: 0 calc(-1 * var(--spacer-sm));
      }
    }
  }

  .summary {
    &__terms {
      margin: var(--spacer-base) 0 0 0;
    }

    &__total {
      margin: 0 0 var(--spacer-sm) 0;
      flex: 0 0 16.875rem;
    }

    &__action {
      @include for-desktop {
        display: flex;
        margin: var(--spacer-xl) 0 0 0;
      }
    }

    &__action-button {
      margin: 0;
      width: 100%;
      margin: var(--spacer-sm) 0 0 0;

      @include for-desktop {
        margin: 0 var(--spacer-xl) 0 0;
        width: auto;
      }

      &--secondary {
        @include for-desktop {
          text-align: right;
        }
      }
    }

    &__back-button {
      margin: var(--spacer-xl) 0 0 0;
      width: 100%;

      @include for-desktop {
        margin: 0 var(--spacer-xl) 0 0;
        width: auto;
      }

      color: var(--c-white);

      &:hover {
        color: var(--c-white);
      }
    }

    &__property-total {
      margin: var(--spacer-xl) 0 0 0;
    }
  }
}
</style>
