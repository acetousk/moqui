<template>
  <div>
    <SfHeading
      :level="3"
      title="Review & Pay"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <SfTable class="sf-table--bordered table desktop-only">
      <SfTableHeading class="table__row">
        <SfTableHeader class="table__header table__image">{{
          $t('Item')
        }}</SfTableHeader>
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="table__header"
          :class="{ table__description: tableHeader === 'Description' }"
        >
          {{ $t(tableHeader) }}
        </SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="(product, index) in products"
        :key="index"
        class="table__row"
      >
        <SfTableData class="table__image">
          <SfImage
            :src="addBasePath(cartGetters.getItemImage(product))"
            :alt="cartGetters.getItemName(product)"
            height="80px"
          />
        </SfTableData>
        <SfTableData class="table__data table__description table__data">
          <div class="product-title">
            {{ cartGetters.getItemName(product) }}
          </div>
          <div class="product-sku">{{ cartGetters.getItemSku(product) }}</div>
        </SfTableData>
        <SfTableData class="table__data">
          <template
            v-if="
              Object.keys(cartGetters.getItemAttributes(product, [])).length > 0
            "
          >
            <div
              class="product-feature"
              v-for="(value, key) in cartGetters.getItemAttributes(product, [])"
              :key="key"
            >
              {{ key }}: {{ value }}
            </div>
          </template>
          <template v-else>
            <div class="product-feature">{{ $t('Standard') }}</div>
          </template>
        </SfTableData>
        <SfTableData class="table__data">{{
          cartGetters.getItemQty(product)
        }}</SfTableData>
        <SfTableData class="table__data">
          <SfPrice
            :regular="$n(cartGetters.getItemPrice(product).regular, 'currency')"
            :special="
              cartGetters.getItemPrice(product).special &&
              $n(cartGetters.getItemPrice(product).special, 'currency')
            "
            class="product-price"
          />
        </SfTableData>
      </SfTableRow>
    </SfTable>
    <div class="summary">
      <div class="summary__group">
        <div class="summary__total">
          <SfProperty
            :name="$t('Subtotal')"
            :value="
              $n(
                totals.special > 0 ? totals.special : totals.subtotal,
                'currency'
              )
            "
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('Discounts')"
            :value="$n(totals.discounts, 'currency')"
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('Shipping')"
            :value="$n(totals.shipping, 'currency')"
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('VAT (14%)')"
            :value="$n(totals.tax, 'currency')"
            class="sf-property--full-width property"
          />
        </div>
        <SfProperty
          :name="$t('Total price')"
          :value="$n(totals.total, 'currency')"
          class="sf-property--full-width sf-property--large summary__property-total"
        />
        <SfDivider />

        <SfHeading
          :level="3"
          :title="$t('Payment')"
          class="sf-heading--left sf-heading--no-underline title"
        />

        <PaymentProvider
          :payment-methods="paymentMethods"
          :selected-method="selectedMethod"
          :loading="paymentsLoading"
          @save="selectMethod"
        />

        <SfCheckbox
          v-e2e="'terms'"
          v-model="terms"
          name="terms"
          class="summary__terms"
        >
          <template #label>
            <div class="sf-checkbox__label">
              {{ $t('I agree to') }}
              <SfLink href="#"> {{ $t('Terms and conditions') }}</SfLink>
            </div>
          </template>
        </SfCheckbox>

        <div v-e2e="'payment-summary-buttons'" class="summary__action">
          <SfButton
            type="button"
            class="sf-button color-secondary summary__back-button"
            @click="router.push('/checkout/shipping')"
          >
            {{ $t('Go back') }}
          </SfButton>
          <SfButton
            :disabled="loading || !isPaymentReady || !terms"
            class="summary__action-button"
            @click="processOrder"
          >
            {{ $t('Make an order') }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SfHeading,
  SfTable,
  SfCheckbox,
  SfButton,
  SfDivider,
  SfImage,
  SfIcon,
  SfPrice,
  SfProperty,
  SfAccordion,
  SfLink
} from '@storefront-ui/vue';
import { onSSR } from '@vue-storefront/core';
import { ref, computed, useRouter } from '@nuxtjs/composition-api';
import {
  useMakeOrder,
  useCart,
  usePayment,
  cartGetters,
  orderGetters
} from '@vue-storefront/moqui';
import { addBasePath } from '@vue-storefront/core';
import PaymentProvider from '~/components/Checkout/PaymentProvider';
import { useUiNotification } from '~/composables';

export default {
  name: 'ReviewOrder',
  components: {
    SfHeading,
    SfTable,
    SfCheckbox,
    SfButton,
    SfDivider,
    SfImage,
    SfIcon,
    SfPrice,
    SfProperty,
    SfAccordion,
    SfLink,
    PaymentProvider
  },
  setup(props, context) {
    const router = useRouter();
    const { send: sendNotification } = useUiNotification();
    const { cart, load, setCart, loading: cartLoading } = useCart();
    const {
      getPaymentProviderList,
      providerList,
      loading: paymentsLoading
    } = usePayment();
    const selectedMethod = ref(null);
    const { order, make, loading, error: makeOrderError } = useMakeOrder();
    const isPaymentReady = ref(false);
    const terms = ref(false);

    const selectMethod = (paymentMethodId) => {
      selectedMethod.value = paymentMethodId;
      isPaymentReady.value = true;
    };

    onSSR(async () => {
      await load();
      await getPaymentProviderList();
    });

    const processOrder = async () => {
      await make({
        customQuery: {
          paymentMethodId: selectedMethod.value
        }
      });
      if (makeOrderError.value.make) {
        sendNotification({
          id: Symbol('order_place_failed'),
          message: context.root.$t('Your order could not be processed'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'Order'
        });
        return;
      }

      if (!order.value.requiresPayment && order.value.statusChanged) {
        const thankYouPath = {
          name: 'thank-you',
          query: { order: orderGetters.getId(order.value) }
        };
        router.push(context.root.localePath(thankYouPath));
        setCart(null);
      } else if (!order.value.requiresPayment && !order.value.statusChanged) {
        sendNotification({
          id: Symbol('order_place_failed'),
          message: context.root.$t('Your order could not be processed'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'Order'
        });
      } else if (order.value.requiresPayment) {
        const paymentGatewayPath = {
          name: 'pay'
        };
        router.push(context.root.localePath(paymentGatewayPath));
      }
    };

    return {
      tableHeaders: ['Description', 'Features', 'Quantity', 'Amount'],
      paymentMethods: providerList,
      selectedMethod,
      isPaymentReady,
      terms,
      paymentsLoading,
      loading: computed(
        () => cartLoading.value || paymentsLoading.value || loading.value
      ),
      products: computed(() => cartGetters.getItems(cart.value)),
      totals: computed(() => cartGetters.getTotals(cart.value)),
      router,
      cartGetters,
      selectMethod,
      processOrder,
      addBasePath
    };
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}

.table {
  margin: 0 0 var(--spacer-base) 0;

  &__row {
    justify-content: space-between;
  }

  @include for-desktop {
    &__header {
      text-align: center;

      &:last-child {
        text-align: right;
      }
    }

    &__data {
      text-align: center;
    }

    &__description {
      text-align: left;
      flex: 0 0 12rem;
    }

    &__image {
      --image-width: 5.125rem;
      text-align: left;
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}

.product-sku {
  color: var(--c-text-muted);
  font-size: var(--font-size--sm);
}

.product-feature {
  color: var(--c-text-muted);
  font-size: var(--font-size--sm);
}

.sf-price {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.product-price {
  --price-font-size: var(--font-size--base);
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

.property {
  margin: 0 0 var(--spacer-sm) 0;

  &__name {
    color: var(--c-text-muted);
  }
}

.accordion {
  margin: 0 0 var(--spacer-xl) 0;

  &__item {
    display: flex;
    align-items: flex-start;
  }

  &__content {
    flex: 1;
  }

  &__edit {
    flex: unset;
  }
}

.content {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-text);

  &:last-child {
    margin: 0;
  }

  &__label {
    font-weight: var(--font-weight--normal);
  }
}
</style>
