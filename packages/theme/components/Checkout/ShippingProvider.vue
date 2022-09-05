<template>
  <div class="sf-shipping">
    <SfRadio v-for="method in shippingMethods" :key="`${method.carrierId}-${method.shipmentMethodId}`"
      v-model="selectedMethod" :label="method.description" :value="method.referenceId" name="shippingMethod"
      :description="method.description" class="form__radio shipping" @input="$emit('save', method)">
      <template #label="{ label }">
        <div class="sf-radio__label shipping__label">
          <div>
            {{ label }}
          </div>
          <div v-if="method.shippingTotal>0" class="shipping__label-price">+{{ $n(method.shippingTotal, 'currency') }}
          </div>
          <div v-else class="shipping__label-price">FREE</div>
        </div>
      </template>
      <template #description="{ description }">
        <div class="sf-radio__description shipping__description">
          <div class="shipping__delivery">
            <!-- <span>{{ method.description }}</span> -->
            <span>Usually arrives with 3-5 business days.</span>
          </div>
        </div>
      </template>
    </SfRadio>
  </div>
</template>

<script>
import { SfRadio } from '@storefront-ui/vue';

export default {
  name: 'ShippingProvider',
  components: {
    SfRadio
  },
  props: {
    shippingMethods: {
      type: Array,
      default: () => []
    },
    selectedMethod: {
      type: String,
      default: ''
    }
  },
  emits: ['save']
};
</script>

<style lang="scss" scoped>
.sf-shipping {
  .shipping {
    --radio-container-padding: var(--spacer-sm);

    &__label {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      &-price {
        font-size: var(--font-size--lg);
        text-transform: uppercase;
      }
    }

    &__description {
      --radio-description-margin: 0;
    }

    &__delivery {
      color: var(--c-text-muted);
      font-weight: var(--font-weight--normal);
      display: flex;
      width: 10.625rem;

      @include for-desktop {
        font-weight: var(--font-weight--light);
      }
    }

    &__action {
      margin: 0 0 0 var(--spacer-xs);

      &::before {
        content: "+";
      }

      &--is-active {
        --button-color: var(--c-primary);
        --button-transition: color 150ms linear;

        &::before {
          content: "-";
        }
      }
    }

    @include for-desktop {
      &__label {
        justify-content: space-between;
      }

      &__delivery {
        width: 100%;
      }
    }
  }
}
</style>

