<template>
  <div id="product">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="product">
      <LazyHydrate when-idle>
        <SfGallery :images="productGallery" class="product__gallery" />
      </LazyHydrate>

      <div class="product__info">
        <div class="product__header">
          <SfHeading
            :title="productGetters.getName(product, productVariant)"
            :level="3"
            class="sf-heading--no-underline sf-heading--left"
          />
          <SfIcon
            icon="drag"
            size="xxl"
            color="var(--c-text-disabled)"
            class="product__drag-icon smartphone-only"
          />
        </div>
        <div class="product__price-and-rating">
          <SfPrice
            :regular="$n(productGetters.getPrice(product).regular, 'currency')"
            :special="
              productGetters.getPrice(product, productVariant).special &&
              $n(
                productGetters.getPrice(product, productVariant).special,
                'currency'
              )
            "
          />
          <div>
            <div class="product__rating">
              <SfRating :score="averageRating" :max="5" />
              <a v-if="!!totalReviews" href="#" class="product__count">
                ({{ totalReviews }})
              </a>
            </div>
            <SfButton class="sf-button--text" @click="scrollToReviews">{{
              $t('Read all reviews')
            }}</SfButton>
          </div>
        </div>
        <div>
          <p class="product__description desktop-only">
            {{ productGetters.getShortDescription(product, productVariant) }}
          </p>
          <!-- <SfButton class="sf-button--text desktop-only product__guide">
            {{ $t('Size guide') }}
          </SfButton> -->
          <template v-for="optionKey in Object.keys(options)">
            <SfSelect
              v-if="optionKey !== 'PftColor' && options[optionKey].length"
              v-e2e="'size-select'"
              :value="configuration[optionKey]"
              @input="(val) => updateFilter({ [optionKey]: val })"
              :label="$t(options[optionKey][0].attrName)"
              class="sf-select--underlined product__select-size"
              :required="true"
            >
              <SfSelectOption
                v-for="option in options[optionKey]"
                :key="option.value"
                :value="option.value"
              >
                {{ $t(option.label) }}
              </SfSelectOption>
            </SfSelect>
          </template>

          <div
            v-if="options.PftColor && options.PftColor.length > 1"
            class="product__colors"
          >
            <p class="product__color-label">{{ $t('Color') }}:</p>
            <SfColor
              v-for="(color, i) in options.PftColor"
              :key="i"
              :color="color.name"
              class="product__color"
              @click="updateFilter({ PftColor: color.value })"
              :selected="configuration.PftColor === color.value"
            />
          </div>

          <SfAddToCart
            v-e2e="'product_add-to-cart'"
            :stock="stock"
            v-model="qty"
            :disabled="loading"
            :canAddToCart="stock > 0"
            class="product__add-to-cart"
            @click="
              addItem({
                product: {
                  productId: productVariant
                    ? productVariant.productId
                    : product.productId
                },
                quantity: parseInt(qty)
              })
            "
          >
            <template #add-to-cart-btn>
              <SfButton class="sf-add-to-cart__button sf-button">
                {{ $t('Add to cart') }}
              </SfButton>
            </template>
          </SfAddToCart>
        </div>

        <LazyHydrate when-idle>
          <SfTabs id="ProductTabs" :open-tab="currentTab" class="product__tabs">
            <SfTab :title="$t('Description')">
              <div class="product__description">
                {{ productGetters.getDescription(product, productVariant) }}
              </div>
              <SfProperty
                v-for="(stdAttribute, i) in standardAttributes"
                :key="i"
                :name="$t(stdAttribute.name)"
                :value="$t(stdAttribute.value)"
                class="product__property"
              >
                <template v-if="stdAttribute.name === 'Category'" #value>
                  <SfButton class="product__property__button sf-button--text">
                    {{ stdAttribute.value }}
                  </SfButton>
                </template>
              </SfProperty>
            </SfTab>
            <SfTab :title="$t('Read reviews')">
              <ProductReview :product-id="activeProductId" />
            </SfTab>
            <SfTab
              :title="$t('Additional Information')"
              class="product__additional-info"
            >
              <div class="product__additional-info">
                <p class="product__additional-info__title">{{ $t('Brand') }}</p>
                <p>{{ brand }}</p>
                <p class="product__additional-info__title">
                  {{ $t('Instruction1') }}
                </p>
                <p class="product__additional-info__paragraph">
                  {{ $t('Instruction2') }}
                </p>
                <p class="product__additional-info__paragraph">
                  {{ $t('Instruction3') }}
                </p>
                <p>{{ careInstructions }}</p>
              </div>
            </SfTab>
          </SfTabs>
        </LazyHydrate>
      </div>
    </div>

    <LazyHydrate when-visible>
      <RelatedProducts
        :products="relatedProducts"
        :loading="relatedLoading"
        :title="$t('You might also like')"
      />
    </LazyHydrate>

    <!-- <LazyHydrate when-visible>
      <InstagramFeed />
    </LazyHydrate> -->
  </div>
</template>
<script>
import {
  SfProperty,
  SfHeading,
  SfPrice,
  SfRating,
  SfSelect,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfIcon,
  SfImage,
  SfBanner,
  SfAlert,
  SfSticky,
  SfBreadcrumbs,
  SfButton,
  SfColor
} from '@storefront-ui/vue';

import RelatedProducts from '~/components/RelatedProducts.vue';
import ProductReview from '~/components/ProductReview.vue';
import { ref, computed, useRoute, useRouter } from '@nuxtjs/composition-api';
import { useProduct, useCart, productGetters } from '@vue-storefront/moqui';
import { onSSR } from '@vue-storefront/core';
import LazyHydrate from 'vue-lazy-hydration';
import { addBasePath } from '@vue-storefront/core';

export default {
  name: 'Product',
  transition: 'fade',
  setup(_props, context) {
    const route = useRoute();
    const router = useRouter();
    // route pattern: /p/:id/:slug/
    // see: https://docs.vuestorefront.io/v2/getting-started/layouts-and-routing.html
    // naming is not optimal, but let's assume id=VirtualProduct and slug=ProductVariant
    const id = computed(() => route.value.params.id);
    const slug = computed(() => route.value.params.slug);

    const qty = ref(1);
    const currentTab = ref(1);
    const { products, search } = useProduct(`product-${slug.value}`);
    const {
      products: relatedProducts,
      search: searchRelatedProducts,
      loading: relatedLoading
    } = useProduct('relatedProducts');
    const { addItem, loading } = useCart();

    const options = computed(() =>
      productGetters.getAttributes(products.value, [], route.value.query)
    );
    const standardAttributes = computed(() =>
      productGetters.getStandardAttributes(products.value)
    );

    const breadcrumbs = computed(() => [
      {
        text: 'Home',
        link: '/'
      },
      ...productGetters.getBreadCrumbs(products.value)
    ]);

    const configuration = computed(() =>
      productGetters.getSelectedAttributes(
        products.value,
        slug.value,
        route.value.query
      )
    );

    const product = computed(() =>
      productGetters.getFilteredVariants(products.value, {
        master: true,
        attributes: configuration.value
      })
    );

    const productVariant = computed(() =>
      productGetters.getProductVariantFromUrlSlug(products.value, slug.value)
    );

    const categories = computed(() =>
      productGetters.getCategoryIds(product.value)
    );

    const productGallery = computed(() =>
      productGetters.getGallery(product.value).map((img) => ({
        mobile: { url: addBasePath(img.small) },
        desktop: { url: addBasePath(img.normal) },
        big: { url: addBasePath(img.big) },
        alt: product.value._name || productGetters.getName(product.value)
      }))
    );

    onSSR(async () => {
      await search({
        productId: id.value,
        variantId: slug.value,
        type: 'single'
      });
      await searchRelatedProducts({
        catId: [categories.value[0]],
        productSlug: id.value,
        limit: 8,
        type: 'related'
      });
    });

    const updateFilter = (filter) => {
      const matchedVariant = productGetters.getProductVariantFromFilters(
        products.value,
        slug.value,
        filter
      );
      // If we match a variant, change the slug, which represents the slug of product variant – see note above
      if (matchedVariant) {
        router.push({
          path:
            route.value.path.substring(0, route.value.path.lastIndexOf('/')) +
            '/' +
            matchedVariant
        });
      } else {
        // Otherwise, set the filter as an intermediate attribute in the query params
        router.push({
          path: route.value.path,
          query: {
            ...filter
          }
        });
      }
    };

    const scrollToReviews = () => {
      currentTab.value = 2;
      context.root.$scrollTo('#ProductTabs', 2000);
    };

    return {
      activeProductId: id,
      currentTab,
      updateFilter,
      configuration,
      product,
      breadcrumbs,
      productVariant,
      standardAttributes,
      averageRating: computed(() =>
        productGetters.getAverageRating(product.value)
      ),
      totalReviews: computed(() =>
        productGetters.getTotalReviews(product.value)
      ),
      relatedProducts: computed(() =>
        productGetters.getFiltered(relatedProducts.value, { master: true })
      ),
      relatedLoading,
      options,
      qty,
      addItem,
      loading,
      productGetters,
      productGallery,
      scrollToReviews
    };
  },
  components: {
    SfAlert,
    SfColor,
    SfProperty,
    SfHeading,
    SfPrice,
    SfRating,
    SfSelect,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfImage,
    SfBanner,
    SfSticky,
    SfBreadcrumbs,
    SfButton,
    // InstagramFeed,
    RelatedProducts,
    ProductReview,
    LazyHydrate
  },
  data() {
    return {
      stock: 5,
      properties: [
        {
          name: 'Product Code',
          value: '578902-00'
        },
        {
          name: 'Category',
          value: 'Pants'
        },
        {
          name: 'Material',
          value: 'Cotton'
        },
        {
          name: 'Country',
          value: 'Germany'
        }
      ],
      description:
        'Find stunning women cocktail and party dresses. Stand out in lace and metallic cocktail dresses and party dresses from all your favorite brands.',
      detailsIsActive: false,
      brand:
        'Brand name is the perfect pairing of quality and design. This label creates major everyday vibes with its collection of modern brooches, silver and gold jewellery, or clips it back with hair accessories in geo styles.',
      careInstructions: 'Do not wash!'
    };
  }
};
</script>

<style lang="scss" scoped>
#product {
  box-sizing: border-box;

  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}

.product {
  @include for-desktop {
    display: flex;
  }

  &__info {
    margin: var(--spacer-sm) auto;

    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }

  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;

    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }

  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }

  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;

    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);
  }

  &__count {
    @include font(
      --count-font,
      var(--font-weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }

  &__description {
    overflow-wrap: anywhere;
    @include font(
      --product-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }

  &__select-size {
    margin: 0 var(--spacer-sm);

    @include for-desktop {
      margin: 0;
    }
  }

  &__colors {
    @include font(
      --product-color-font,
      var(--font-weight--normal),
      var(--font-size--lg),
      1.6,
      var(--font-family--secondary)
    );
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }

  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }

  &__color {
    margin: 0 var(--spacer-2xs);
    border: 1px solid black;
  }

  &__add-to-cart {
    margin: var(--spacer-base) var(--spacer-sm) 0;

    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }

  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }

  &__compare {
    margin-top: 0;
  }

  &__tabs {
    --tabs-title-z-index: 0;
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);

    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }

  &__property {
    margin: var(--spacer-base) 0;

    &__button {
      --button-font-size: var(--font-size--base);
    }
  }

  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
  }

  &__additional-info {
    color: var(--c-link);
    @include font(
      --additional-info-font,
      var(--font-weight--light),
      var(--font-size--sm),
      1.6,
      var(--font-family--primary)
    );

    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);

      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }

    &__paragraph {
      margin: 0;
    }
  }

  &__gallery {
    flex: 1;
  }
}

.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}

@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, 30%, 0);
  }

  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
