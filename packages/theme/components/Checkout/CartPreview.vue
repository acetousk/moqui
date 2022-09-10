<template>
  <div>
    <div class="highlighted">
      <SfHeading
        :level="3"
        :title="$t('Order summary')"
        class="sf-heading--left sf-heading--no-underline title"
      />
    </div>
    <div class="highlighted">
      <SfProperty
        :name="$t('Products')"
        :value="totalItems"
        class="sf-property--full-width sf-property--large property"
      />
      <SfProperty
        :name="$t('Subtotal')"
        :value="$n(totals.special, 'currency')"
        :class="['sf-property--full-width', 'sf-property--large property']"
      />
      <SfProperty
        v-if="hasDiscounts"
        :name="$t('Discount')"
        :value="$n(discountsAmount, 'currency')"
        class="sf-property--full-width sf-property--small property"
      />
      <SfProperty
        :name="$t('VAT (14%)')"
        :value="$n(totals.tax, 'currency')"
        class="sf-property--full-width sf-property--small property"
      />
      <SfProperty
        :name="$t('Total')"
        :value="$n(totals.total, 'currency')"
        class="sf-property--full-width sf-property--large property-total"
      />
    </div>
    <SfLoader :class="{ loading }" :loading="loading">
      <div class="highlighted sf-order-summary__promo-code">
        <SfInput
          v-model="promoCode"
          :disabled="Boolean(appliedPromoCode && appliedPromoCode.id)"
          name="promoCode"
          :label="$t('Enter promo code')"
          class="sf-input--filled sf-order-summary__promo-code-input"
          :icon="{ icon: 'check', size: 'xs', color: '#ff0000' }"
        />
        <SfButton
          class="sf-order-summary__promo-code-button"
          data-testid="apply-button"
          @click="handlePromoCodeAction"
        >
          {{ appliedPromoCode ? $t('Remove') : $t('Apply') }}
        </SfButton>
      </div>
    </SfLoader>
    <div class="highlighted">
      <SfCharacteristic
        v-for="characteristic in characteristics"
        :key="characteristic.title"
        :title="characteristic.title"
        :description="characteristic.description"
        :icon="characteristic.icon"
        class="characteristic"
      />
    </div>
  </div>
</template>
<script>
import {
  SfHeading,
  SfProperty,
  SfCharacteristic,
  SfInput,
  SfButton,
  SfLoader
} from '@storefront-ui/vue';
import { computed, ref, watch, defineComponent } from '@nuxtjs/composition-api';
import { useCart, cartGetters } from '@vue-storefront/moqui';
import useUiNotification from '~/composables/useUiNotification';

const CHARACTERISTICS = [
  {
    title: 'Safety',
    description: 'It carefully packaged with a personal touch',
    icon: 'safety'
  },
  {
    title: 'Easy shipping',
    description: 'You’ll receive dispatch confirmation and an arrival date',
    icon: 'shipping'
  },
  {
    title: 'Changed your mind?',
    description: 'Rest assured, we offer free returns within 30 days',
    icon: 'return'
  }
];

export default defineComponent({
  name: 'CartPreview',
  components: {
    SfHeading,
    SfProperty,
    SfCharacteristic,
    SfInput,
    SfButton,
    SfLoader
  },
  setup(_, context) {
    const {
      cart,
      removeItem,
      updateItemQty,
      applyCoupon,
      removeCoupon,
      error,
      loading
    } = useCart();
    const { send: sendNotification } = useUiNotification();
    const listIsHidden = ref(false);

    const promoCode = ref('');
    const products = computed(() => cartGetters.getItems(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const discounts = computed(() => cartGetters.getDiscounts(cart.value));
    const hasDiscounts = computed(() => discounts.value?.length > 0);
    const discountsAmount = computed(() =>
      discounts.value.reduce((a, el) => el.value + a, 0)
    );
    const appliedPromoCode = computed(
      () => cartGetters.getCoupons(cart.value)?.[0]
    );

    const applyCouponError = computed(() => error.value.applyCoupon);
    const removeCouponError = computed(() => error.value.removeCoupon);

    watch(
      appliedPromoCode,
      (newVal) => {
        if (newVal) {
          promoCode.value = newVal.code;
        }
      },
      { immediate: true }
    );

    const handleApplyCoupon = async () => {
      await applyCoupon({
        couponCode: promoCode.value
      });

      if (applyCouponError.value) {
        sendNotification({
          id: Symbol('coupon_apply_failed'),
          message: context.root.$t('Invalid Promo Code'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'Promotion'
        });
      } else {
        sendNotification({
          id: Symbol('coupon_apply_success'),
          message: context.root.$t('Promo Code Applied'),
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'Promotion'
        });
      }
    };

    const handleRemoveCoupon = async () => {
      await removeCoupon({
        couponCode: appliedPromoCode.value.id
      });

      if (removeCouponError.value) {
        sendNotification({
          id: Symbol('coupon_apply_failed'),
          message: context.root.$t('Invalid Promo Code'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'Promotion'
        });
      }
    };

    const handlePromoCodeAction = () => {
      if (appliedPromoCode.value) handleRemoveCoupon();
      else handleApplyCoupon();
    };
    return {
      loading,
      cart,
      discounts,
      discountsAmount,
      hasDiscounts,
      totalItems,
      listIsHidden,
      products,
      totals,
      removeItem,
      updateItemQty,
      promoCode,
      appliedPromoCode,
      handlePromoCodeAction,
      cartGetters,
      characteristics: CHARACTERISTICS
    };
  }
});
</script>

<style lang="scss" scoped>
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-xl) var(--spacer-xl) 0;

  &:last-child {
    padding-bottom: var(--spacer-xl);
  }
}

.total-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacer-xl);
}

.property {
  margin-bottom: var(--spacer-base);
}

.property-total {
  margin-top: var(--spacer-xl);
  padding-top: var(--spacer-lg);
  font-size: var(--font-size-xl);
  border-top: var(--c-white) 1px solid;
  --property-name-font-weight: var(--font-weight--semibold);
  --property-name-color: var(--c-text);
}

.characteristic {
  &:not(:last-child) {
    margin-bottom: var(--spacer-base);
  }
}

.sf-order-summary {
  &__heading {
    --heading-title-margin: 0 0 var(--spacer-xl) 0;
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    --heading-title-margin: 0 0 var(--spacer-xl) 0;
    --heading-title-font-size: var(--h3-font-size);

    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
    }
  }

  &__property {
    margin: var(--spacer-base) 0;
    --property-name-font-weight: var(--font-weight--medium);
    --property-value-font-weight: var(--font-weight--bold);

    &:last-of-type {
      margin: var(--spacer-base) 0 var(--spacer-xl);
      --property-name-color: var(--c-text);
    }
  }

  &__divider {
    --divider-border-color: var(--c-white);
    --divider-margin: var(--spacer-xl) 0 0 0;
  }

  &__promo-code {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    &-input {
      --input-background: var(--c-white);
      --input-label-font-size: var(--font-size--base);
      flex: 1;

      ::v-deep input:disabled {
        -webkit-text-fill-color: var(--c-primary-lighten);
      }
    }

    &-button {
      --button-height: 1.875rem;
    }
  }

  &__characteristics {
    &-item {
      margin: var(--spacer-base) 0;

      &:last-of-type {
        margin: 0;
      }
    }
  }
}
</style>
