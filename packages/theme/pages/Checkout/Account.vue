<template>
  <div>
    <div v-if="!isAuthenticated">
      <SfHeading
        v-e2e="'account-heading'"
        :level="3"
        :title="$t('Sign In to Continue')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <div class="account-step-header">
        <!-- Create an account subtitle -->
        <template v-if="currentAccountStep === 'login'">
          <p class="subtitle">
            {{ $t('No account') }}
            <SfButton
              class="sf-button--text"
              @click="handleAccountStep('register')"
            >
              {{ $t('Register') }}
            </SfButton>
          </p>
        </template>
        <!-- Login subtitle -->
        <template v-if="currentAccountStep === 'register'">
          <p class="subtitle">
            {{ $t('Already have an account?') }}
            <SfButton
              class="sf-button--text"
              @click="handleAccountStep('login')"
            >
              {{ $t('Sign in') }}
            </SfButton>
          </p>
        </template>
      </div>
      <div>
        <!-- Login form -->
        <template v-if="currentAccountStep === 'login'">
          <LoginForm
            :error="loginError"
            :loading="loading"
            @submit="handleLogin"
          />
        </template>
        <!-- Register form -->
        <template v-else-if="currentAccountStep === 'register'">
          <CreateAccountForm
            :error="registerError"
            :loading="loading"
            @submit="handleRegister"
          />
        </template>
      </div>
    </div>
    <div v-else>
      <div class="account-step-header">
        <SfHeading
          v-e2e="'account-heading'"
          :level="3"
          :title="$t('Select a Shipping Address')"
          class="sf-heading--left sf-heading--no-underline title"
        />
        <p class="subtitle__standout">
          {{ $t('Welcome back') }},&nbsp;{{ userFullName }}!
          <span class="subtitle">
            {{ $t('Not') }} {{ userFirstName }}?
            <SfLink @click="handleLogout"> {{ $t('Logout') }}</SfLink>
          </span>
        </p>
      </div>
      <AddressSelector>
        <template #heading> </template>
        <template #custom-action-text>
          {{ $t('Continue to shipping') }}
        </template>
      </AddressSelector>
    </div>
  </div>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfLink
} from '@storefront-ui/vue';
import { ref, computed } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useUser, userGetters } from '@vue-storefront/moqui';
import CreateAccountForm from '~/components/MyAccount/CreateAccountForm';
import AddressSelector from '~/components/Checkout/AddressSelector';
import LoginForm from '~/components/MyAccount/LoginForm';

const ACCOUNT_STEPS = {
  register: 'Register',
  login: 'Login',
  address: 'Shipping Address'
};

export default {
  name: 'Account',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfLink,
    CreateAccountForm,
    LoginForm,
    AddressSelector
  },
  setup() {
    const {
      isAuthenticated,
      load: loadUser,
      user,
      loading,
      login,
      logout,
      register,
      error: userError
    } = useUser();

    const currentAccountStep = ref('login');
    const currentAccountStepIndex = computed(() =>
      Object.keys(ACCOUNT_STEPS).findIndex(
        (s) => s === currentAccountStep.value
      )
    );
    const handleAccountStep = (step) => (currentAccountStep.value = step);

    const loginError = computed(() => userError.value.login);
    const registerError = computed(() => userError.value.register);
    const userFullName = computed(() => userGetters.getFullName(user.value));
    const userFirstName = computed(() => userGetters.getFirstName(user.value));

    onSSR(async () => {
      await loadUser();
    });

    const formHandler = async (fn, onComplete, onError) => {
      await fn();
      if (loginError.value) {
        onError(loginError.value?.message);
      } else if (registerError.value) {
        onError(registerError.value?.message);
      } else {
        onComplete();
        await loadUser();
      }
    };

    const handleRegister = ({ form, onComplete, onError }) =>
      formHandler(() => register({ user: form.value }), onComplete, onError);
    const handleLogin = ({ form, onComplete, onError }) =>
      formHandler(() => login({ user: form.value }), onComplete, onError);
    const handleLogout = ({ /* form ,*/ onComplete, onError }) =>
      formHandler(() => logout(), onComplete, onError);
    return {
      currentAccountStep,
      currentAccountStepIndex,
      isAuthenticated,
      user,
      loading,
      loginError,
      registerError,
      userGetters,
      userFullName,
      userFirstName,
      handleRegister,
      handleLogin,
      handleLogout,
      handleAccountStep
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

.subtitle {
  font-size: var(--font-size--sm);
  margin: 0;
  color: var(--c-text);
  font-family: var(--font-family--secondary);
  font-weight: var(--font-weight--light);

  &__standout {
    margin: 0;
    color: var(--c-text);
    font-family: var(--font-family--secondary);
    font-weight: var(--font-weight--light);
    font-size: var(--font-size--md);
  }
}

.title {
  margin: var(--spacer-lg) 0 var(--spacer-xs) 0;
}

.account-step-header {
  margin: 0 0 var(--spacer-lg) 0;
}
</style>
