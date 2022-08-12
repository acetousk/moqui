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
              label="Country"
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
              label="Area"
              name="state"
              :disabled="loadingStore || !isStatesRequired"
              class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
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
              label="City"
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
              label="Postal Code"
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
              label="Address"
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
              label="Address 2 (Building, Apt)"
              name="address2"
              class="form__element form__element--half form__element--half-even"
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="phone"
            rules="required|phone"
            v-slot="{ errors }"
            slim
          >
            <SfInput
              v-e2e="'shipping-phone'"
              v-model.trim="form.phone"
              label="Phone Number"
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
                type="submit"
              >
                {{ $t('Edit address') }}
              </SfButton>
              <SfButton
                v-else
                v-e2e="'select-shipping'"
                class="form__action-button"
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
import { required, min } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { useUiNotification } from '~/composables';

extend('required', {
  ...required,
  message: 'This field is required'
});
extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('phone', (data) => {
  const regexStr =
    /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/;

  const re = new RegExp(regexStr);
  if (re.test(`${data}`)) {
    return true;
  } else if (data.substring(0, 1) !== '+') {
    return 'Phone number must start with a country code (Ex: +2 for Egypt)';
  } else {
    return 'Invalid phone number: ' + data;
  }
});

extend('zipcode', (data, input) => {
  let format = input[0];
  format = format.replace(/N/g, '\\d');
  format = format.replace(/L/g, '[a-zA-Z]');

  const regexStr = '^' + format + '$';

  const re = new RegExp(regexStr);
  if (re.test(data)) {
    return true;
  } else {
    return 'Zip Code format: ' + input[0];
  }
});

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
    ValidationObserver,
    VsfShippingProvider: () =>
      import('~/components/Checkout/VsfShippingProvider')
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
      const onComplete = (data) => {
        sendNotification({
          id: Symbol('shipping_address_updated'),
          message:
            data?.message || 'Your shipping address was successfully updated!',
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'Shipping Address'
        });
        resetValidationFn();
      };
      const onError = (error) => {
        sendNotification({
          id: Symbol('shipping_address_update_failed'),
          message: error?.message || 'Your shipping address failed to update.',
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
