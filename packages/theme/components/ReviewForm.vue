<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }" key="add-review">
    <form class="form" @submit.prevent="handleSubmit(submitForm(reset))">
      <div class="form__label">Your Rating ({{ form.rating }}/5)</div>
      <div class="form__rating">
        <SfCheckbox
          name="rating-1"
          :selected="form.rating > 0"
          @change="handleRatingChange(1)"
        >
          <template #checkmark>
            <SfIcon
              icon="star"
              :color="form.rating > 0 ? 'yellow-primary' : 'gray-secondary'"
            />
          </template>
        </SfCheckbox>
        <SfCheckbox
          name="rating-2"
          :selected="form.rating > 1"
          @change="handleRatingChange(2)"
        >
          <template #checkmark>
            <SfIcon
              icon="star"
              :color="form.rating > 1 ? 'yellow-primary' : 'gray-secondary'"
            />
          </template>
        </SfCheckbox>
        <SfCheckbox
          name="rating-3"
          :selected="form.rating > 2"
          @change="handleRatingChange(3)"
        >
          <template #checkmark>
            <SfIcon
              icon="star"
              :color="form.rating > 2 ? 'yellow-primary' : 'gray-secondary'"
            />
          </template>
        </SfCheckbox>
        <SfCheckbox
          name="rating-4"
          :selected="form.rating > 3"
          @change="handleRatingChange(4)"
        >
          <template #checkmark>
            <SfIcon
              icon="star"
              :color="form.rating > 3 ? 'yellow-primary' : 'gray-secondary'"
            />
          </template>
        </SfCheckbox>
        <SfCheckbox
          name="rating-5"
          :selected="form.rating > 4"
          @change="handleRatingChange(5)"
        >
          <template #checkmark>
            <SfIcon
              icon="star"
              :color="form.rating > 4 ? 'yellow-primary' : 'gray-secondary'"
            />
          </template>
        </SfCheckbox>
      </div>
      <div class="form__label">Your Review</div>
      <div class="form__horizontal">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required|min:5"
          class="form__element"
        >
          <SfTextarea
            v-model="form.productReview"
            name="productReview"
            placeholder="Type your review..."
            :rows="6"
            :cols="isMobile ? 60 : 40"
            required
            :valid="!errors[0]"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </div>
      <SfButton type="submit" class="form__button" :disabled="loading">
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>{{ $t('Add Review') }}</div>
        </SfLoader>
      </SfButton>
    </form>
  </ValidationObserver>
</template>
<script>
import {
  SfModal,
  SfButton,
  SfLoader,
  SfBar,
  SfRating,
  SfTextarea,
  SfSelect,
  SfRange,
  SfCheckbox,
  SfIcon
} from '@storefront-ui/vue';
import { reactive } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import useUiNotification from '~/composables/useUiNotification';

export default {
  name: 'ReviewForm',
  components: {
    ValidationProvider,
    ValidationObserver,
    SfButton,
    SfModal,
    SfLoader,
    SfBar,
    SfTextarea,
    SfRating,
    SfSelect,
    SfRange,
    SfCheckbox,
    SfIcon
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
    const form = reactive({
      productReview: '',
      rating: 5
    });
    const { send: sendNotification } = useUiNotification();

    const handleRatingChange = (rating) => {
      form.rating = rating;
    };
    const submitForm = (resetValidationFn) => () => {
      const onComplete = () => {
        sendNotification({
          id: Symbol('review_add_success'),
          message: $t('Review added successfully'),
          type: 'success',
          icon: 'check',
          persist: false,
          title: 'Review Added!'
        });
        resetValidationFn();
      };
      const onError = () => {
        sendNotification({
          id: Symbol('review_add_failed'),
          message: $t('Unable to add a review'),
          type: 'danger',
          icon: 'cross',
          persist: false,
          title: 'Review Unsuccesful'
        });
      };

      emit('submit', { form, onComplete, onError });
    };

    return {
      form,
      sendNotification,
      submitForm,
      handleRatingChange
    };
  }
};
</script>

<style lang="scss" scoped>
.form {
  &__label {
    @include font(
      --form-header-font,
      var(--font-weight--bold),
      var(--font-size--lg),
      1.6,
      var(--font-family--secondary)
    );

    margin-top: var(--spacer-sm);
  }

  &__element {
    display: block;
    margin: 0 0 var(--spacer-lg) 0;
  }

  &__button {
    display: block;
    width: 100%;
  }

  &__rating {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
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
        margin-bottom: var(--spacer-lg);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
