<template>
  <transition name="fade">
    <SfTabs
      v-if="editingAddress"
      key="edit-address"
      :open-tab="1"
      class="tab-orphan"
    >
      <SfTab :title="isNewAddress ? $t('Add address') : $t('Edit address')">
        <p class="message">
          {{ $t('Contact details updated') }}
        </p>
        <ShippingAddressForm
          :address="activeAddress"
          :isNew="isNewAddress"
          @cancel="cancelEditAddress"
          @submit="saveAddress"
        />
      </SfTab>
    </SfTabs>

    <SfTabs v-else :open-tab="1" key="address-list" class="tab-orphan">
      <SfTab :title="$t('Shipping details')">
        <p class="message">
          {{ $t('Manage shipping addresses') }}
        </p>
        <transition-group tag="div" name="fade" class="shipping-list">
          <div
            v-for="address in addresses"
            :key="userShippingGetters.getId(address)"
            class="shipping"
          >
            <div class="shipping__content">
              <div class="shipping__address">
                <UserShippingAddress :address="address" />
              </div>
            </div>
            <div class="shipping__actions">
              <SfIcon
                icon="cross"
                color="gray"
                size="14px"
                role="button"
                class="smartphone-only"
                @click="removeAddress(address)"
              />
              <SfButton @click="changeAddress(address)">
                {{ $t('Change') }}
              </SfButton>

              <SfButton
                class="color-light shipping__button-delete desktop-only"
                @click="removeAddress(address)"
              >
                {{ $t('Delete') }}
              </SfButton>
            </div>
          </div>
        </transition-group>
        <SfButton class="action-button" @click="changeAddress()">
          {{ $t('Add new address') }}
        </SfButton>
      </SfTab>
    </SfTabs>
  </transition>
</template>
<script>
import { SfTabs, SfButton, SfIcon } from '@storefront-ui/vue';
import UserShippingAddress from '~/components/UserShippingAddress';
import ShippingAddressForm from '~/components/MyAccount/ShippingAddressForm';
import {
  useUserShipping,
  userShippingGetters,
  useUser
} from '@vue-storefront/moqui';
import { ref, computed, useRouter } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useUiNotification } from '~/composables';

export default {
  name: 'ShippingDetails',
  components: {
    SfTabs,
    SfButton,
    SfIcon,
    UserShippingAddress,
    ShippingAddressForm
  },
  setup(_props, context) {
    const { send: sendNotification } = useUiNotification();
    const router = useRouter();
    const { setUser } = useUser();

    const {
      shipping,
      load: loadUserShipping,
      addAddress,
      deleteAddress,
      updateAddress,
      error
    } = useUserShipping();

    const addresses = computed(() =>
      userShippingGetters.getAddresses(shipping.value)
    );
    const editingAddress = ref(false);
    const activeAddress = ref(undefined);
    const isNewAddress = computed(() => !activeAddress.value);

    const changeAddress = (address = undefined) => {
      activeAddress.value = address;
      editingAddress.value = true;
    };

    const addAddressError = computed(() => error.value.addAddress);
    const deleteAddressError = computed(() => error.value.deleteAddress);
    const updateAddressError = computed(() => error.value.updateAddress);

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

    const cancelEditAddress = () => {
      editingAddress.value = false;
      activeAddress.value = null;
    };

    const saveAddress = async ({ form, onComplete, onError }) => {
      const actionMethod = isNewAddress.value ? addAddress : updateAddress;
      const actionError = isNewAddress.value
        ? addAddressError
        : updateAddressError;
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
        if (actionError.value.code === 401) {
          router.push(context.root.localePath({ name: 'home' }));
          setUser(null);
        }
      } else {
        editingAddress.value = false;
        activeAddress.value = undefined;
        await onComplete(shipping.value);
      }
    };

    onSSR(async () => {
      await loadUserShipping();
    });

    return {
      changeAddress,
      updateAddress,
      removeAddress,
      saveAddress,
      cancelEditAddress,
      userShippingGetters,
      addresses,
      editingAddress,
      activeAddress,
      isNewAddress
    };
  }
};
</script>

<style lang="scss" scoped>
.message {
  font-family: var(--font-family--primary);
  line-height: 1.6;
  font-size: var(--font-size--base);
  margin: 0 0 var(--spacer-base);
}

.shipping-list {
  margin-bottom: var(--spacer-base);
}

.shipping {
  display: flex;
  padding: var(--spacer-xl) 0;
  border-top: 1px solid var(--c-light);

  &:last-child {
    border-bottom: 1px solid var(--c-light);
  }

  &__content {
    flex: 1;
    color: var(--c-text);
    font-size: var(--font-size--base);
    font-weight: 300;
    line-height: 1.6;
  }

  &__actions {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;

    @include for-desktop {
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }

  &__button-delete {
    color: var(--c-link);

    @include for-desktop {
      margin-left: var(--spacer-base);
    }
  }

  &__address {
    margin: 0;

    p {
      margin: 0;
    }
  }

  &__client-name {
    font-size: var(--font-size--base);
    font-weight: 500;
  }
}

.action-button {
  width: 100%;

  @include for-desktop {
    width: auto;
  }
}

.tab-orphan {
  @include for-mobile {
    ::v-deep .sf-tabs {
      &__title {
        display: none;
      }

      &__content {
        border: 0;
        padding: 0;
      }
    }
  }
}
</style>
