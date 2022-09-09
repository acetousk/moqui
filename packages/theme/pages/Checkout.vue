<template>
  <div id="checkout">
    <div class="checkout">
      <div class="checkout__main">
        <SfSteps
          v-if="!isThankYou"
          :active="currentStepIndex"
          :class="{ checkout__steps: true }"
          @change="handleStepClick"
        >
          <SfStep v-for="(step, key) in STEPS" :key="key" :name="$t(step)">
            <nuxt-child />
          </SfStep>
        </SfSteps>
        <nuxt-child v-else />
      </div>
      <div v-if="!isThankYou" class="checkout__aside desktop-only">
        <transition name="fade">
          <CartPreview key="order-summary" />
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { SfSteps, SfButton } from '@storefront-ui/vue';
import CartPreview from '~/components/Checkout/CartPreview';
import { computed, watch, useRoute, useRouter } from '@nuxtjs/composition-api';
import { useUser } from '@vue-storefront/moqui';

const STEPS = {
  account: 'Customer Info',
  shipping: 'Shipping',
  payment: 'Payment'
};

export default {
  name: 'Checkout',
  middleware: 'checkout',
  components: {
    SfButton,
    SfSteps,
    CartPreview
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { isAuthenticated } = useUser();
    const currentStep = computed(() => route.value.path.split('/').pop());
    const currentStepIndex = computed(() =>
      Object.keys(STEPS).findIndex((s) => s === currentStep.value)
    );
    const isThankYou = computed(() => currentStep.value === 'thank-you');

    // Note: the following two watches have similar logic but different triggers
    // the first is triggered by a change in authentication status,
    // the second is triggered by a change in checkout steps

    // If user is not authenticated at any point, go to account step
    // If user IS authenticated, move to the next step
    watch(
      isAuthenticated,
      (newVal) => {
        if (!newVal) router.push('/checkout/account');
        // else if (currentStepIndex.value === [0] && newVal === true) {
        //   const key = Object.keys(STEPS)[currentStepIndex.value + 1];
        //   router.push(`/checkout/${key}`);
        // }
      },
      { immediate: true }
    );

    // If user is authenticated, and is on the account page, move to the next step
    // If user is NOT authenticated, and is on any other step, go back to accounts
    watch(
      currentStepIndex,
      (newVal) => {
        // if (isAuthenticated.value && newVal === 0) {
        //   const key = Object.keys(STEPS)[currentStepIndex.value + 1];
        //   router.push(`/checkout/${key}`);
        // } else
        if (!isAuthenticated.value && newVal !== 0) {
          const key = Object.keys(STEPS)[0];
          router.push(`/checkout/${key}`);
        }
      },
      { immediate: true }
    );

    // User can click backwards only & cannot move to the next step by clicking the headers
    const handleStepClick = (stepIndex) => {
      if (stepIndex > currentStepIndex.value) return;
      const key = Object.keys(STEPS)[stepIndex];
      router.push(`/checkout/${key}`);
    };

    return {
      STEPS,
      currentStepIndex,
      isThankYou,
      currentStep,
      handleStepClick
    };
  }
};
</script>

<style lang="scss" scoped>
#checkout {
  box-sizing: border-box;

  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}

.checkout {
  @include for-desktop {
    display: flex;
  }

  &__main {
    @include for-desktop {
      flex: 1;
      padding: var(--spacer-xl) 0 0 0;
    }
  }

  &__aside {
    @include for-desktop {
      flex: 0 0 25.5rem;
      margin: 0 0 0 4.25rem;
    }
  }

  &__steps {
    --steps-content-padding: 0 var(--spacer-base);

    @include for-desktop {
      --steps-content-padding: 0;
    }

    &-auth::v-deep .sf-steps__step:first-child {
      --steps-step-color: #e8e4e4;
    }
  }
}
</style>
