<template>
  <SfModal
    v-e2e="'login-modal'"
    :visible="isLoginModalOpen"
    class="modal"
    @close="closeModal"
  >
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="$t(barTitle)"
        @click:close="closeModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <div v-if="currentScreen === SCREEN_LOGIN">
        <div class="form-title">{{ $t('Log into your account') }}</div>
        <div class="form-subtile">
          {{ $t('View orders and update your details') }}
        </div>
        <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
          <form class="form" @submit.prevent="handleSubmit(handleLogin)">
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-email'"
                v-model="form.username"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                :label="$t('Your e-mail')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-password'"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="password"
                :label="$t('Password')"
                class="form__element"
                type:icon="text"
                :icon="{ icon: 'show_password' }"
                @click:icon="
                  {
                    showPassword = !showPassword;
                  }
                "
                :type="showPassword ? 'text' : 'password'"
              />
            </ValidationProvider>
            <!--
              <SfCheckbox v-e2e="'login-modal-remember-me'" v-model="rememberMe" name="remember-me" label="Remember me"
              class="form__element checkbox" />
            -->
            <div v-if="error.login">
              <SfAlert :message="error.login" type="danger" />
            </div>
            <SfButton
              v-e2e="'login-modal-submit'"
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
        <div class="forgot-password-action">
          <SfButton
            class="sf-button--text"
            @click="setCurrentScreen(SCREEN_FORGOTTEN)"
          >
            {{ $t('I forgot my password...') }}
          </SfButton>
        </div>
        <div class="action">
          <p class="action__paragraph">{{ $t('No account') }}</p>
          <SfButton
            class="sf-button--full-width sf-button--outline sf-button--se form__button mt-4"
            @click="setCurrentScreen(SCREEN_REGISTER)"
          >
            {{ $t('Register today') }}
          </SfButton>
        </div>
      </div>
      <div v-else-if="currentScreen === SCREEN_FORGOTTEN">
        <div class="form-title">{{ $t('Reset your password') }}.</div>
        <div class="form-subtile">
          {{ $t('forgotPasswordExplainer') }}
        </div>
        <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
          <form class="form" @submit.prevent="handleSubmit(handleForgotten)">
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-e2e="'forgot-modal-email'"
                v-model="form.username"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                :label="$t('Forgot Password Modal Email')"
                class="form__element"
              />
            </ValidationProvider>
            <div v-if="forgotPasswordError.request">
              <SfAlert
                :message="forgotPasswordError.request.message"
                type="danger"
              />
            </div>
            <SfButton
              v-e2e="'forgot-modal-submit'"
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="forgotPasswordLoading"
            >
              <SfLoader
                :class="{ loader: forgotPasswordLoading }"
                :loading="forgotPasswordLoading"
              >
                <div>{{ $t('Reset Password') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="action">
          <p class="action__paragraph">{{ $t('or') }}</p>
          <SfButton
            data-cy="login-btn_submit"
            class="sf-button--full-width sf-button--outline sf-button--se form__button mt-4"
            @click="setCurrentScreen(SCREEN_REGISTER)"
          >
            <div>
              {{ $t('Create an account') }}
            </div>
          </SfButton>
        </div>
      </div>
      <div v-else-if="currentScreen === SCREEN_THANK_YOU" class="thank-you">
        <i18n
          tag="p"
          class="thank-you__paragraph"
          path="forgotPasswordConfirmation"
        >
          <span class="thank-you__paragraph--bold">{{ userEmail }}</span>
        </i18n>
        <p class="thank-you__paragraph">{{ $t('Thank You Inbox') }}</p>
      </div>
      <div v-else class="form">
        <div class="form-title">{{ $t('Create your new account') }}!</div>
        <div class="form-subtile">
          {{ $t('Find your favorite products') }}
        </div>
        <ValidationObserver v-slot="{ handleSubmit }" key="sign-up">
          <form
            class="form"
            @submit.prevent="handleSubmit(handleRegister)"
            autocomplete="off"
          >
            <ValidationProvider rules="required|min:2|nothavenumber" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-firstName'"
                v-model="form.firstName"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="first-name"
                :label="$t('First Name')"
                class="form__element form__element--half"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|min:2|nothavenumber" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-lastName'"
                v-model="form.lastName"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="last-name"
                :label="$t('Last Name')"
                class="form__element form__element--half form__element--half-even"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-email'"
                v-model="form.email"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="email"
                :label="$t('Your e-mail')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|password" v-slot="{ errors }">
              <SfInput
                v-e2e="'login-modal-password'"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="errors[0]"
                name="password"
                :label="$t('Password')"
                type="password"
                class="form__element"
              />
            </ValidationProvider>
            <!-- <ValidationProvider :rules="{ required: { allowFalse: false } }" v-slot="{ errors }">
              <SfCheckbox v-e2e="'login-modal-create-account'" v-model="createAccount" :valid="!errors[0]"
                :errorMessage="errors[0]" name="create-account" label="I want to create an account"
                class="form__element" />
            </ValidationProvider> -->
            <div v-if="error.register">
              <SfAlert :message="error.register" type="danger" />
            </div>
            <SfButton
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="loading"
            >
              <SfLoader :class="{ loader: loading }" :loading="loading">
                <div>{{ $t('Create an account') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="action">
          <p class="action__paragraph">{{ $t('or') }}</p>
          <SfButton
            class="sf-button--full-width sf-button--outline sf-button--se form__button mt-4"
            @click="setCurrentScreen(SCREEN_LOGIN)"
          >
            {{ $t('login in to your account') }}
          </SfButton>
        </div>
        <div class="bottom">
          <p class="bottom__enjoy">
            {{ $t('Enjoy these perks with your free account') }}!
          </p>
          <div class="bottom__items">
            <div class="bottom__items--item">
              <SfIcon
                icon="clock"
                size="sm"
                viewBox="0 0 12 12"
                :coverage="1"
              />
              <p>{{ $t('Faster checkout') }}</p>
            </div>
            <div class="bottom__items--item">
              <SfIcon
                icon="shipping"
                size="sm"
                viewBox="0 0 12 12"
                :coverage="1"
              />
              <p>{{ $t('Track your orders') }}</p>
            </div>
            <!-- <div class="bottom__items--item">
              <SfIcon icon="return" size="sm" viewBox="0 0 12 12" :coverage="1" />
              <p>{{ $t('Manage your returns') }}</p>
            </div> -->
          </div>
        </div>
      </div>
    </transition>
  </SfModal>
</template>
<script>
import { ref, watch, reactive, computed } from '@nuxtjs/composition-api';
import {
  SfModal,
  SfInput,
  SfButton,
  SfCheckbox,
  SfLoader,
  SfAlert,
  SfBar,
  SfIcon
} from '@storefront-ui/vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { useUser, useForgotPassword } from '@vue-storefront/moqui';
import { useUiState } from '~/composables';

export default {
  name: 'LoginModal',
  components: {
    SfModal,
    SfInput,
    SfButton,
    SfCheckbox,
    SfLoader,
    SfAlert,
    ValidationProvider,
    ValidationObserver,
    SfBar,
    SfIcon
  },
  setup() {
    const SCREEN_LOGIN = 'login';
    const SCREEN_REGISTER = 'register';
    const SCREEN_THANK_YOU = 'thankYouAfterForgotten';
    const SCREEN_FORGOTTEN = 'forgottenPassword';

    const { isLoginModalOpen, toggleLoginModal } = useUiState();
    const form = ref({});
    const userEmail = ref('');
    const createAccount = ref(false);
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const { register, login, loading, error: userError } = useUser();
    const {
      request,
      error: forgotPasswordError,
      loading: forgotPasswordLoading
    } = useForgotPassword();
    const currentScreen = ref(SCREEN_LOGIN);

    const error = reactive({
      login: null,
      register: null
    });

    const resetErrorValues = () => {
      error.login = null;
      error.register = null;
    };

    const barTitle = computed(() => {
      switch (currentScreen.value) {
        case SCREEN_LOGIN:
          return 'Sign in';
        case SCREEN_REGISTER:
          return 'Register';
        default:
          return 'Reset Password';
      }
    });

    watch(isLoginModalOpen, () => {
      if (isLoginModalOpen) {
        form.value = {};
        resetErrorValues();
      }
    });

    const setCurrentScreen = (screenName) => {
      resetErrorValues();
      currentScreen.value = screenName;
    };

    const handleForm = (fn) => async () => {
      resetErrorValues();
      await fn({ user: form.value });

      const hasUserErrors = userError.value.register || userError.value.login;

      if (hasUserErrors) {
        error.login = userError.value.login?.message;
        error.register = userError.value.register?.message;
        return;
      }
      toggleLoginModal();
    };

    const closeModal = () => {
      resetErrorValues();
      setCurrentScreen(SCREEN_LOGIN);
      toggleLoginModal();
    };

    const handleRegister = async () => handleForm(register)();

    const handleLogin = async () => handleForm(login)();

    const handleForgotten = async () => {
      userEmail.value = form.value.username;
      await request({ email: userEmail.value });

      if (!forgotPasswordError.value.request) {
        setCurrentScreen(SCREEN_THANK_YOU);
      }
    };

    return {
      form,
      error,
      userError,
      loading,
      createAccount,
      rememberMe,
      showPassword,
      isLoginModalOpen,
      toggleLoginModal,
      handleLogin,
      handleRegister,
      forgotPasswordError,
      forgotPasswordLoading,
      handleForgotten,
      closeModal,
      userEmail,
      barTitle,
      currentScreen,
      setCurrentScreen,
      SCREEN_LOGIN,
      SCREEN_REGISTER,
      SCREEN_THANK_YOU,
      SCREEN_FORGOTTEN
    };
  }
};
</script>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
}

.sf-modal__bar {
  font-size: 16px;
  font-weight: 500;
}

.modal::v-deep .sf-modal {
  &__container {
    @include for-desktop {
      width: 610px !important;
    }

    .sf-modal__content {
      padding: 40px 79px;

      @include for-mobile {
        padding: 40px 16px;
      }
    }
  }
}

.form-title {
  font-size: 36px;
  font-weight: 600;
  text-align: center;

  @include for-mobile {
    font-size: 24px;
    text-align: left;
  }
}

.form-subtile {
  margin-bottom: var(--spacer-xl);
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-top: 10px;

  @include for-mobile {
    text-align: left;
  }
}

.form {
  margin-top: var(--spacer-sm);

  &__element {
    margin: 0 0 var(--spacer-md) 0;

    @include for-desktop {
      flex: 0 0 100%;
    }

    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }

      &-even {
        @include for-desktop {
          // padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }
}

.forgot-password-action {
  margin-top: var(--spacer-xs);
  margin-bottom: var(--spacer-sm);
  text-align: right;
}

.checkbox {
  margin-bottom: var(--spacer-2xl);
}

// .bottom {
//   text-align: center;
//   margin-bottom: var(--spacer-lg);
//   font-size: var(--h3-font-size);
//   font-weight: var(--font-weight--semibold);
//   font-family: var(--font-family--secondary);

//   &__paragraph {
//     color: var(--c-primary);
//     margin: 0 0 var(--spacer-base) 0;

//     @include for-desktop {
//       margin: 0;
//     }
//   }
// }

.thank-you {
  &__paragraph {
    &--bold {
      font-weight: var(--font-weight--semibold);
    }
  }
}

.action {
  text-align: center;

  &__paragraph {
    color: var(--c-primary);
    margin: var(--spacer-xs) 0 var(--spacer-xs) 0;

    @include for-desktop {
      margin: 0;
    }
  }
}

.bottom {
  @include for-desktop {
    text-align: center;
  }

  &__items {
    display: flex;
    justify-content: space-around;
    text-align: center;

    &--item {
      display: flex;
      align-items: center;

      @include for-mobile {
        margin-top: 24px;
      }

      p {
        font-size: 16px;
        font-weight: 400;
        margin-left: 12px;
        margin-top: 3px;
      }
    }
  }

  &__enjoy {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    margin-top: 24px;
    color: #43464e;
  }
}
</style>
