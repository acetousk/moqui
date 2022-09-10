<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }" key="log-in">
    <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
      <div v-if="error">
        <SfAlert :message="error.message" type="danger" />
      </div>
      <ValidationProvider rules="required|email" v-slot="{ errors }">
        <SfInput
          v-e2e="'login-form-email'"
          v-model="form.username"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          name="email"
          :label="$t('Your email')"
          class="form__element"
        />
      </ValidationProvider>
      <ValidationProvider rules="required" v-slot="{ errors }">
        <SfInput
          v-e2e="'login-form-password'"
          v-model="form.password"
          :valid="!errors[0]"
          :errorMessage="errors[0]"
          name="password"
          :label="$t('Password')"
          type="password"
          class="form__element"
        />
      </ValidationProvider>
      <SfButton
        v-e2e="'login-form-submit'"
        type="submit"
        class="sf-button--full-width form__button"
        :disabled="loading"
      >
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>{{ $t('Login') }}</div>
        </SfLoader>
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  SfLoader,
  SfAlert,
  SfInput,
  SfButton,
  SfModal,
  SfSelect,
  SfProductOption
} from '@storefront-ui/vue';
import { useUiNotification } from '~/composables';

export default defineComponent({
  name: 'LoginForm',
  components: {
    SfLoader,
    SfAlert,
    SfInput,
    SfButton,
    SfModal,
    SfSelect,
    SfProductOption,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    error: {
      type: Object,
      required: false,
      default: {}
    }
  },
  emits: ['submit'],
  setup(props, context) {
    const emit = context.emit;

    const resetForm = () => ({
      email: '',
      password: ''
    });
    const { send: sendNotification } = useUiNotification();
    const form = ref(resetForm());
    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        form.value = resetForm();
        resetValidationFn();
      };
      const onError = () => {
        sendNotification({
          id: Symbol('user_update_failed'),
          message: context.root.$t('Login failed'),
          type: 'danger',
          icon: 'error',
          persist: false,
          title: 'Login'
        });
      };
      emit('submit', { form, onComplete, onError });
    };
    return {
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
