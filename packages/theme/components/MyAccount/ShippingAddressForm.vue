<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <SfLoader :class="{ loading }" :loading="loading || loadingStore">
      <form @submit.prevent="handleSubmit(submitForm(reset))">
        <div class="form">
          <ValidationProvider
            name="country"
            rules="required"
            v-slot="{ errors }"
            slim
          >
            <SfSelect
              v-e2e="'shipping-country'"
              v-model="form.countryId"
              :label="$t('Country')"
              name="country"
              :disabled="loadingStore"
              class="form__element form__element--half form__select sf-select--underlined"
              required
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            >
              <SfSelectOption
                v-for="countryOption in countriesList"
                :key="countryOption.id"
                :value="countryOption.id"
              >
                {{ countryOption.name }}
              </SfSelectOption>
            </SfSelect>
          </ValidationProvider>
          <ValidationProvider
            name="state"
            :rules="isStatesRequired ? 'required' : ''"
            v-slot="{ errors }"
            slim
          >
            <SfSelect
              v-e2e="'shipping-state'"
              v-model="form.stateId"
              :label="$t('Area')"
              name="state"
              :disabled="loadingStore || !isStatesRequired"
              class="form__element form__element--half form__element--half-even form__select form__select--even sf-select--underlined"
              required
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            >
              <SfSelectOption
                v-for="stateOption in statesList"
                :key="stateOption.id"
                :value="stateOption.id"
              >
                {{ stateOption.name }}
              </SfSelectOption>
            </SfSelect>
          </ValidationProvider>
          <ValidationProvider
            name="city"
            rules="required"
            v-slot="{ errors }"
            slim
          >
            <SfInput
              v-e2e="'shipping-city'"
              v-model="form.city"
              :label="$t('City')"
              name="city"
              class="form__element form__element--half"
              required
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="zipCode"
            :rules="`${needZipCode ? 'required|zipcode:' + zipCodeFormat : ''}`"
            v-slot="{ errors }"
            slim
          >
            <SfInput
              v-e2e="'shipping-zipcode'"
              v-model.trim="form.postalCode"
              :label="$t('Postal Code')"
              name="zipCode"
              class="form__element form__element--half form__element--half-even"
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="address"
            rules="required"
            v-slot="{ errors }"
            slim
          >
            <SfInput
              v-e2e="'shipping-address'"
              v-model="form.address1"
              :label="$t('Address')"
              name="address"
              class="form__element form__element--half"
              required
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider name="address2" v-slot="{ errors }" slim>
            <SfInput
              v-e2e="'shipping-address2'"
              v-model="form.address2"
              :label="$t('Address 2 (Building, Apt)')"
              name="address2"
              class="form__element form__element--half form__element--half-even"
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="phone"
            rules="required|phonecountrycode|phone"
            v-slot="{ errors }"
            slim
          >
            <SfInput
              v-e2e="'shipping-phone'"
              v-model.trim="form.phone"
              :label="$t('Phone Number')"
              name="phone"
              type="tel"
              class="form__element form__element--half"
              placeholder="+2 01XXXXXXXXX"
              required
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            />
          </ValidationProvider>
        </div>
        <div class="form">
          <div class="form__action" v-if="!isFormSubmitted" :disabled="loading">
            <div class="summary__action">
              <SfButton
                type="button"
                class="sf-button color-secondary summary__back-button"
                @click="toggleAddNewAddressForm"
              >
                {{ $t('Go back') }}
              </SfButton>
              <SfButton
                v-if="!$props.isNew"
                v-e2e="'select-shipping'"
                class="form__action-button"
                :loading="loading"
                type="submit"
              >
                {{ $t('Save') }}
              </SfButton>
              <SfButton
                v-else
                v-e2e="'select-shipping'"
                class="form__action-button"
                :loading="loading"
                type="submit"
              >
                {{ $t('Add address') }}
              </SfButton>
            </div>
          </div>
        </div>
      </form>
    </SfLoader>
  </ValidationObserver>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfAddressPicker,
  SfLink,
  SfLoader
} from '@storefront-ui/vue';
import { computed, ref } from '@nuxtjs/composition-api';
import {
  useUserShipping,
  useStore,
  storeGetters,
  userShippingGetters
} from '@vue-storefront/moqui';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { useUiNotification } from '~/composables';

export default {
  name: 'ShippingAddressForm',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfAddressPicker,
    SfLink,
    SfLoader,
    ValidationProvider,
    ValidationObserver
  },
  emits: ['cancel'],
  props: {
    isNew: {
      type: Boolean,
      required: false,
      default: false
    },
    address: {
      type: Object,
      required: false,
      default: () => {
        return {
          addressId: null,
          alias: '',
          address1: '',
          address2: '',
          city: '',
          stateId: null,
          countryId: null,
          postalCode: '',
          phone: null
        };
      }
    }
  },
  setup(props, context) {
    const { send: sendNotification } = useUiNotification();
    const { loading } = useUserShipping();
    const { response: store, loading: loadingStore } = useStore();
    const isFormSubmitted = ref(false);

    const form = ref({
      addressId: props.address.addressId,
      alias: props.address.alias,
      address1: props.address.address1,
      address2: props.address.address2,
      city: props.address.city,
      stateId: props.address.stateId,
      countryId: props.address.countryId,
      postalCode: props.address.postalCode,
      phone: '+' + userShippingGetters.getPhone(props.address) || '2'
    });

    const countriesList = computed(() =>
      storeGetters.getCountryList(store.value)
    );

    const statesList = computed(() => {
      if (form.value.countryId)
        return (
          countriesList.value?.find((el) => el.id === form.value.countryId)
            ?.regions || []
        );
    });
    const isStatesRequired = computed(() => statesList.value?.length);

    const zipCodeFormat = computed(() => '');
    //   selectedCountry.value && countriesList.value.length >= 1
    //     ? countriesList.value.find((el) => el.id === selectedCountry.value)
    //         .zipCodeFormat
    //     : []
    // );

    const needZipCode = computed(() => false);
    //   selectedCountry.value && countriesList.value.length >= 1
    //     ? countriesList.value.find((el) => el.id === selectedCountry.value)
    //         .needZipCode
    //     : []
    // );

    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        sendNotification({
          id: Symbol('shipping_address_updated'),
          message: context.root.$t('Your address was updated'),
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'Shipping Address'
        });
        resetValidationFn();
      };
      const onError = () => {
        sendNotification({
          id: Symbol('shipping_address_update_failed'),
          message: context.root.$t('Your address was not updated'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'Shipping Address'
        });
      };

      context.emit('submit', { form, onComplete, onError });
    };
    const toggleAddNewAddressForm = () => {
      context.emit('cancel');
    };

    return {
      loading,
      loadingStore,
      isFormSubmitted,
      form,
      countriesList,
      statesList,
      submitForm,
      isStatesRequired,
      toggleAddNewAddressForm,
      zipCodeFormat,
      needZipCode
    };
  }
};
</script>

<style lang="scss" scoped>
.form {
  --button-width: 100%;

  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);

    &--even {
      ::v-deep .sf-select__label {
        margin: 0 0 0 var(--spacer-xl);
      }
    }

    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }

  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    --button-width: auto;
  }

  &__element {
    margin: 0 0 var(--spacer-xl) 0;

    @include for-desktop {
      flex: 0 0 100%;
    }

    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }

      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }

  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }

  &__action-button {
    &--secondary {
      @include for-desktop {
        order: -1;
        text-align: left;
      }
    }

    &--add-address {
      width: 100%;
      margin: 0;

      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }

  &__back-button {
    margin: var(--spacer-xl) 0 var(--spacer-sm);

    &:hover {
      color: var(--c-white);
    }

    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}

.shipping {
  &__label {
    display: flex;
    justify-content: space-between;
  }

  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-xs);
  }
}

.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-top: 1px dotted grey;
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
</style>
