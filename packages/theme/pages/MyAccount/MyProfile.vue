<template>
  <SfTabs :open-tab="openTab" @click:tab="(t) => (openTab = t)">
    <!-- Personal data update -->
    <SfTab :title="$t('Personal data')">
      <p class="message">
        {{ $t('Feel free to edit') }}
      </p>

      <ProfileUpdateForm :loading="loading" @submit="updatePersonalData" />

      <p class="notice">
        {{ $t('Use your personal data') }}
        <a href="">{{ $t('Privacy Policy') }}</a>
      </p>
    </SfTab>

    <!-- Password reset -->
    <SfTab :title="$t('Password change')">
      <p class="message">
        {{ $t('Change password your account') }}:<br />
        {{ $t('Your current email address is') }}
        <span class="message__label">{{ userGetters.getEmailAddress(user) }}</span>
      </p>

      <PasswordResetForm :loading="loading" @submit="updatePassword" />
    </SfTab>
  </SfTabs>
</template>

<script>
import { extend } from 'vee-validate';
import { email, required, min, confirmed } from 'vee-validate/dist/rules';
import ProfileUpdateForm from '~/components/MyAccount/ProfileUpdateForm';
import PasswordResetForm from '~/components/MyAccount/PasswordResetForm';
import { SfTabs, SfInput, SfButton } from '@storefront-ui/vue';
import { useUser, userGetters } from '@vue-storefront/moqui';
import { onMounted, computed, ref, useRouter } from '@nuxtjs/composition-api';

extend('email', {
  ...email,
  message: 'Invalid email'
});

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('password', {
  validate: (value) =>
    String(value).length >= 8 &&
    String(value).match(/[A-Za-z]/gi) &&
    String(value).match(/[0-9]/gi) &&
    String(value).match(/[#?!@$%^&*-]/gi),
  message:
    'Password must have at least 8 characters including one letter, a number and a special character'
});

extend('confirmed', {
  ...confirmed,
  message: 'Passwords don\'t match'
});

extend('nothavenumber', {
  validate: (value) => String(value).match(/^([^0-9]*)$/),
  message: 'This field should not have a number'
});
export default {
  name: 'PersonalDetails',

  components: {
    SfTabs,
    SfInput,
    SfButton,
    ProfileUpdateForm,
    PasswordResetForm
  },

  setup(_props, context) {
    const router = useRouter();
    const { user, load, updateUser, changePassword, error, loading, setUser } = useUser();
    const openTab = ref(1);
    onMounted(() => {
      load();
    });

    const changePasswordError = computed(() => error.value.changePassword);
    const updateUserError = computed(() => error.value.updateUser);
    const formHandler = async (fn, errorVar, onComplete, onError) => {
      await fn();
      if (errorVar.value) {
        onError(errorVar.value);
        if (errorVar.value.code === 401) {
          setUser(null);
          router.push(context.root.localePath({ name: 'home' }));
        }
      } else {
        onComplete();
      }
    };

    const updatePersonalData = ({ form, onComplete, onError }) =>
      formHandler(
        () => updateUser({ user: form.value }),
        updateUserError,
        onComplete,
        onError
      );
    const updatePassword = ({ form, onComplete, onError }) =>
      formHandler(
        () =>
          changePassword({
            current: form.value.currentPassword,
            new: form.value.newPassword
          }),
        changePasswordError,
        onComplete,
        onError
      );

    return {
      updatePersonalData,
      updatePassword,
      loading,
      openTab,
      user,
      userGetters
    };
  }
};
</script>

<style lang="scss" scoped>
.message,
.notice {
  font-family: var(--font-family--primary);
  line-height: 1.6;
}

.message {
  margin: 0 0 var(--spacer-xl) 0;
  font-size: var(--font-size--base);

  &__label {
    font-weight: 400;
  }
}

.notice {
  margin: var(--spacer-lg) 0 0 0;
  font-size: var(--font-size--sm);
}
</style>
