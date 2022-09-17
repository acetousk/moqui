<template>
  <SfLoader :class="{ loading }" :loading="loading">
    <div>
      <div>
        <SfModal v-e2e="'add-review-modal'" :visible="isAddReviewModalOpen" class="modal" :title="$t('Add Review')"
          @close="toggleAddReviewModalOpen">
          <ReviewForm :productId="productId" @submit="handleAddReview" />
        </SfModal>
      </div>
      <div>
        <div v-if="!reviews.length" class="info-text">
          {{ $t('This product has no reviews yet') }}
        </div>
        <SfReview v-for="review in reviews" :key="reviewGetters.getReviewId(review)"
          :author="reviewGetters.getReviewAuthor(review)" :date="reviewGetters.getReviewDate(review)"
          :message="reviewGetters.getReviewMessage(review)" :max-rating="5"
          :rating="reviewGetters.getReviewRating(review)" :char-limit="250" :read-more-text="$t('Read more')"
          :hide-full-text="$t('Read less')" />
      </div>
      <div>
        <LazyHydrate on-interaction>
          <BasicPagination v-if="!loading" class="pagination desktop-only" v-show="pagination.totalPages > 1"
            :current="pagination.currentPage" :total="pagination.totalPages" :visible="5" @click="handleGetReview" />
        </LazyHydrate>
      </div>
      <div>
        <SfButton v-if="isAuthenticated" class="action-button" style="margin-top:20px"
          @click="toggleAddReviewModalOpen">
          {{ $t('Add Review') }}
        </SfButton>
        <div v-else class="info-text">
          {{ $t('Please log in to add a review') }}
        </div>
      </div>
    </div>
  </SfLoader>
</template>

<script lang="ts">
import LazyHydrate from 'vue-lazy-hydration';
import {
  SfReview,
  SfLoader,
  SfSection,
  SfPagination,
  SfModal,
  SfButton
} from '@storefront-ui/vue';
import { reviewGetters, productGetters, useReview, useUser } from '@vue-storefront/moqui';
import { computed, onMounted } from '@nuxtjs/composition-api';
import ReviewForm from '~/components/ReviewForm.vue';
import BasicPagination from '~/components/Shared/BasicPagination.vue';
import { useUiState } from '~/composables';

export default {
  name: 'ProductReview',
  components: {
    ReviewForm,
    SfLoader,
    LazyHydrate,
    SfPagination,
    SfSection,
    SfReview,
    SfModal,
    SfButton,
    BasicPagination
  },
  props: {
    productId: String
  },
  setup(props) {
    const { reviews: productReviews, loading, search, addReview, error } =
      useReview(props.productId);
    const addReviewError = computed(() => error.value.addReview);
    const productId = computed(() => props.productId);

    const { isAuthenticated } = useUser();
    const { isAddReviewModalOpen, toggleAddReviewModalOpen } = useUiState();
    const reviews = computed(() =>
      reviewGetters.getItems(productReviews.value)
    );
    const pagination = computed(() => reviewGetters.getPagination(productReviews.value));

    onMounted(async () => {
      await search({ productId: productId.value, page: 1, itemsPerPage: 2 });
    });

    const handleGetReview = async (pageNumber: number) => {
      await search({ productId: productId.value, page: pageNumber, itemsPerPage: 2 });
    };

    const handleAddReview = async ({ form, onComplete, onError }) => {
      await addReview({
        productId: productId.value,
        review: form.productReview,
        rating: form.rating
      });
      if (addReviewError.value) {
        onError(addReviewError.value);
      } else {
        onComplete(reviews.value);
        toggleAddReviewModalOpen();
      }
    };

    return {
      productGetters,
      reviewGetters,
      reviews,
      loading,
      pagination,
      isAuthenticated,
      isAddReviewModalOpen,
      toggleAddReviewModalOpen,
      handleAddReview,
      handleGetReview
    };
  }
};
</script>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
}

.sf-review {
  margin-bottom: var(--spacer-base);
  overflow-wrap: break-word;
}

.info-text {
  color: var(--c-link);
  @include font(--additional-info-font,
    var(--font-weight--light),
    var(--font-size--sm),
    1.6,
    var(--font-family--primary));
}

.action-button {
  --button-height: 2rem;
}

.pagination {
  margin-top: var(--spacer-sm)
}
</style>
