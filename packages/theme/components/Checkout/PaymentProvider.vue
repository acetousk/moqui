<template>
  <div>
    <SfLoader :class="{ loading }" :loading="loading">
      <div>
        <SfRadio
          v-e2e="'payment-method'"
          v-for="method in paymentMethods"
          :key="method.paymentMethodId"
          :label="method.description"
          :value="method.paymentMethodId"
          :description="method.description"
          :selected="selectedMethod"
          name="paymentMethod"
          class="form__radio payment"
          @input="$emit('save', method.paymentMethodId)"
        >
          <div class="payment__label">
            {{ method.label }}
          </div>
        </SfRadio>
      </div>
    </SfLoader>
  </div>
</template>

<script>
import { SfButton, SfRadio, SfLoader } from '@storefront-ui/vue';

export default {
  name: 'PaymentProvider',
  components: {
    SfButton,
    SfRadio,
    SfLoader
  },
  props: {
    paymentMethods: {
      type: Array,
      default: () => []
    },
    selectedMethod: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save']
};
</script>

<style lang="scss" scoped>
.payment {
  &__label {
    display: flex;
    justify-content: space-between;
  }

  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-xs);
  }
}
</style>
