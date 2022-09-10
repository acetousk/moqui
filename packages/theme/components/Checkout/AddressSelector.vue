<template>
  <div>
    <slot name="heading"></slot>
    <SfLoader :class="{ loading }" :loading="loading">
      <SfAddressPicker v-model="selectedAddress" class="address-picker">
        <div
          v-if="!addressFormVisibility"
          v-for="address in addressesList"
          :key="userShippingGetters.getId(address)"
        >
          <sf-address
            :name="userShippingGetters.getId(address)"
            class="address-picker__item"
          >
            <UserShippingAddress
              class="address-picker__item__info"
              :address="address"
            />
            <div class="address-picker__item__actions">
              <SfLink @click.prevent="editAddress(address)">
                {{ $t('Edit') }}
              </SfLink>
              <span>&nbsp;</span>
              <SfLink @click.prevent="removeAddress(address)">
                {{ $t('Delete') }}
              </SfLink>
            </div>
          </sf-address>
        </div>
        <div
          v-if="
            !addressFormVisibility && !(addressesList && addressesList.length)
          "
        >
          <p class="address-picker__empty">
            {{ $t('No saved addresses') }}
          </p>
        </div>
      </SfAddressPicker>
    </SfLoader>
    <ShippingAddressForm
      v-if="addressFormVisibility"
      :isNew="isNew"
      :address="addressForEdit"
      @cancel="toggleAddressFormVisibility"
      @submit="handleSaveAddressSubmit"
    />
    <form
      v-if="!addressFormVisibility"
      @submit.prevent="handleSelectedAddressSubmit"
    >
      <div class="form">
        <div class="form__action">
          <slot name="add-new-address">
            <SfButton
              v-e2e="'add-new-address'"
              :disabled="loading || cartShippingLoading"
              class="form__action-button color-secondary"
              @click="addNewAddress"
            >
              {{ $t('Add new address') }}
            </SfButton>
          </slot>
          <slot name="custom-action">
            <SfButton
              v-e2e="'custom-action'"
              :disabled="loading || cartShippingLoading || !selectedAddress"
              class="form__action-button"
              type="submit"
            >
              <slot name="custom-action-text" />
            </SfButton>
          </slot>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {
  SfHeading,
  SfButton,
  SfAddressPicker,
  SfLink,
  SfLoader
} from '@storefront-ui/vue';
import {
  computed,
  ref,
  watch,
  useRouter,
  onMounted
} from '@nuxtjs/composition-api';
import {
  userShippingGetters,
  useUserShipping,
  useShipping
} from '@vue-storefront/moqui';
import UserShippingAddress from '~/components/UserShippingAddress';
import ShippingAddressForm from '~/components/MyAccount/ShippingAddressForm.vue';
import useUiNotification from '~/composables/useUiNotification';

export default {
  name: 'AddressSelector',
  components: {
    SfHeading,
    SfButton,
    SfLink,
    SfAddressPicker,
    SfLoader,
    UserShippingAddress,
    ShippingAddressForm
  },
  setup(_props, context) {
    const router = useRouter();
    const { send: sendNotification } = useUiNotification();
    const {
      shipping,
      load,
      loading,
      addAddress,
      updateAddress,
      deleteAddress,
      error
    } = useUserShipping();
    const {
      shipping: cartShipping,
      loading: cartShippingLoading,
      load: loadCartShipping,
      save: saveCartShipping,
      error: cartShippingError
    } = useShipping();

    const selectedAddress = ref(null);
    const addressFormVisibility = ref(false);
    const addressForEdit = ref({});
    const isNew = ref(false);

    const addAddressError = computed(() => error.value.addAddress);
    const updateAddressError = computed(() => error.value.updateAddress);
    const deleteAddressError = computed(() => error.value.deleteAddress);
    const saveShippingAddressError = computed(
      () => cartShippingError.value.save
    );
    const addressesList = computed(() =>
      userShippingGetters.getAddresses(shipping.value)
    );

    watch(
      cartShipping,
      (newVal) => {
        if (newVal && newVal.addressId) {
          selectedAddress.value = newVal.addressId;
        }
      },
      { immediate: true }
    );

    onMounted(async () => {
      await load();
      await loadCartShipping();
    });

    const toggleAddressFormVisibility = () =>
      (addressFormVisibility.value = !addressFormVisibility.value);

    const isSelectedAddress = (id) => {
      if (selectedAddress.value && id === selectedAddress.value) {
        return true;
      }
      return false;
    };

    const addNewAddress = () => {
      addressForEdit.value = {};
      isNew.value = true;
      toggleAddressFormVisibility();
    };

    const editAddress = (address) => {
      addressForEdit.value = address;
      isNew.value = false;
      toggleAddressFormVisibility();
    };

    const removeAddress = async (address) => {
      await deleteAddress({ address });

      if (deleteAddressError.value) {
        sendNotification({
          id: Symbol('shipping_address_update_failed'),
          message: context.root.$t('Address failed to delete'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'Shipping Address'
        });
      } else {
        sendNotification({
          id: Symbol('shipping_address_updated'),
          message: context.root.$t('Address deleted successfully'),
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'Shipping Address'
        });
      }
    };

    const handleSaveAddressSubmit = async ({ form, onComplete, onError }) => {
      const actionMethod = isNew.value ? addAddress : updateAddress;
      const actionError = isNew.value ? addAddressError : updateAddressError;
      await actionMethod({
        address: {
          ...form.value,
          phone: {
            countryCode: form.value.phone.substring(1, 2),
            areaCode: form.value.phone.substring(2, 5),
            contactNumber: form.value.phone.substring(5)
          }
        }
      });
      if (actionError.value) {
        onError(actionError.value);
      } else {
        isNew.value = false;
        addressForEdit.value = {};
        await onComplete(shipping.value);
        toggleAddressFormVisibility();
      }
    };

    const handleSelectedAddressSubmit = async () => {
      await saveCartShipping({
        shippingDetails: { addressId: selectedAddress.value }
      });
      if (!saveShippingAddressError.value) {
        sendNotification({
          id: Symbol('shipping_address_updated'),
          message: context.root.$t('Your shipping address was set'),
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'Shipping Address'
        });
        router.push(context.root.localePath({ name: 'shipping' }));
      } else {
        sendNotification({
          id: Symbol('shipping_address_update_failed'),
          message: context.root.$t('Your shipping address was not set'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'Shipping Address'
        });
      }
    };

    return {
      addressesList,
      selectedAddress,
      addressFormVisibility,
      addressForEdit,
      userShippingGetters,
      cartShipping,
      isNew,
      loading,
      cartShippingLoading,
      handleSelectedAddressSubmit,
      handleSaveAddressSubmit,
      toggleAddressFormVisibility,
      editAddress,
      removeAddress,
      addNewAddress,
      isSelectedAddress
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

.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}

.form__action > * {
  margin-right: 1rem;
}

.address-picker {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem 0;
  margin-bottom: 2rem;

  &__item {
    border: 1px solid var(--_c-gray-secondary);
    margin: 0.25rem;
    min-height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__info {
      flex-grow: 3;
    }

    &__actions {
      flex-grow: 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      border-top: 1px dotted grey;
    }
  }

  &__empty {
    min-height: 30px;
    text-align: center;
    font-size: var(--font-size--base);
    color: var(--_c-gray-secondary);
    font-family: var(--font-family--secondary);
    font-weight: var(--font-weight--light);
  }
}
</style>
