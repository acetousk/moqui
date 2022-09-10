<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }" key="profile-update">
    <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|nothavenumber"
          class="form__element"
        >
          <SfInput
            v-model="form.firstName"
            name="firstName"
            :label="$t('First Name')"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:2|nothavenumber"
          class="form__element"
        >
          <SfInput
            v-model="form.lastName"
            name="lastName"
            :label="$t('Last Name')"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          class="form__element"
        >
          <SfSelect v-model="form.gender" :label="$t('Gender')">
            <SfSelectOption
              v-for="option of genderOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|email"
          class="form__element"
        >
          <SfInput
            v-model="form.email"
            type="email"
            name="email"
            :label="$t('Your e-mail')"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
            :disabled="true"
          />
        </ValidationProvider>
      </div>
      <SfButton type="submit" class="form__button" :disabled="loading">
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>{{ $t('Update personal data') }}</div>
        </SfLoader>
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { useUser, userGetters } from '@vue-storefront/moqui';
import {
  SfInput,
  SfButton,
  SfModal,
  SfSelect,
  SfProductOption,
  SfLoader
} from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';
import LazyHydrate from 'vue-lazy-hydration';

export default defineComponent({
  name: 'ProfileUpdateForm',
  components: {
    SfInput,
    SfButton,
    SfModal,
    SfSelect,
    SfProductOption,
    SfLoader,
    ValidationProvider,
    ValidationObserver,
    LazyHydrate
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['submit'],
  setup(props, { emit, $t }) {
    // const { app: { i18n } } = useContext();
    const { user } = useUser();
    const { send: sendNotification } = useUiNotification();

    const genderOptions = [
      { value: 'M', label: 'Male' },
      { value: 'F', label: 'Female' }
    ];

    const form = computed(() => ({
      firstName: user.value ? userGetters.getFirstName(user.value) : '',
      lastName: user.value ? userGetters.getLastName(user.value) : '',
      email: user.value ? userGetters.getEmailAddress(user.value) : '',
      gender: user.value ? userGetters.getGender(user.value) : ''
    }));

    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        sendNotification({
          id: Symbol('user_updated'),
          message: $t('Your account was updated'),
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'User Profile'
        });
        resetValidationFn();
      };
      const onError = () => {
        sendNotification({
          id: Symbol('user_updated'),
          message: $t('Your account was not updated'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'User Profile'
        });
      };

      emit('submit', { form, onComplete, onError });
    };

    return {
      genderOptions,
      form,
      submitForm
    };
  }
});
</script>
<style lang="scss" scoped>
.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }
  &__button {
    display: block;
    width: 100%;
    @include for-desktop {
      width: 17.5rem;
    }
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-2xl);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
