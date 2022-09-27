<template>
  <div>
    <SfHeading
      :title="$t('Contact us')"
      :level="2"
      class="heading"
      :description="$t('Please fill the form')"
    />
    <ValidationObserver v-slot="{ handleSubmit, reset }">
      <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
        <div v-if="error">
          <SfAlert :message="error.message" type="danger" />
        </div>
        <div class="form__horizontal">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|min:2|nothavenumber"
            class="form__element"
          >
            <SfInput
              v-e2e="'contact-firstName'"
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
              v-e2e="'contact-lastName'"
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
            rules="required|email"
            class="form__element"
          >
            <SfInput
              v-e2e="'contact-email'"
              v-model="form.emailAddress"
              type="email"
              name="emailAddress"
              :label="$t('Your e-mail')"
              required
              :valid="!errors[0]"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="phone"
            rules="required|phonecountrycode|phone"
            v-slot="{ errors }"
            slim
          >
            <SfInput
              v-e2e="'contact-phone'"
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
        <div class="form__label">$t('How can we help')</div>
        <div class="form__horizontal">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|min:5"
            class="form__element"
          >
            <SfTextarea
              v-model="form.description"
              name="description"
              :placeholder="$t('Describe your issue')"
              :rows="6"
              :cols="isMobile ? 60 : 40"
              required
              :valid="!errors[0]"
              :error-message="errors[0]"
            />
          </ValidationProvider>
        </div>
        <SfButton type="submit" class="form__button">
          {{ $t('Submit') }}
        </SfButton>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  SfInput,
  SfAlert,
  SfButton,
  SfTextarea,
  SfHeading
} from '@storefront-ui/vue';
import {
  mapMobileObserver,
  unMapMobileObserver
} from '@storefront-ui/vue/src/utilities/mobile-observer.js';
import { computed, onBeforeUnmount } from '@nuxtjs/composition-api';
export default defineComponent({
  name: 'ContactForm',
  components: {
    SfInput,
    SfAlert,
    SfButton,
    SfTextarea,
    SfHeading,
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
    const isMobile = computed(() => mapMobileObserver().isMobile.get());

    const resetForm = () => ({
      firstName: '',
      lastName: '',
      emailAddress: '',
      phone: '',
      description: ''
    });
    const form = ref(resetForm());
    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        form.value = resetForm();
        resetValidationFn();
      };

      emit('submit', { form: form.value, onComplete });
    };

    onBeforeUnmount(() => {
      unMapMobileObserver();
    });
    return {
      form,
      submitForm,
      isMobile
    };
  }
});
</script>
<style lang="scss" scoped>
.heading {
  padding: 0 var(--spacer-base);
}
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
    align-items: center;

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
