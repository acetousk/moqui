<template>
  <div>
    <div>
      <SfHeader class="sf-header">
        <template #logo>
          <div class="sf-header__logo">
            <SfImage
              :src="addBasePath('/icons/logo.svg')"
              alt="Vue Storefront Next"
              class="sf-header__logo-image"
            />
          </div>
          <h3 class="sf-header__text">Payment</h3>
        </template>
        <template #navigation><div></div> </template>
        <template #aside>
          <div></div>
        </template>
        <template #header-icons>
          <div>
            <SfButton
              class="sf-button sf-button__action"
              link="/checkout/payment"
            >
              {{ $t('Return to Cart') }}
            </SfButton>
          </div></template
        >
        <template #search><div></div></template>
      </SfHeader>
    </div>
    <div id="layout">
      <no-ssr>
        <nuxt :key="route.fullPath" />
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { useRoute } from '@nuxtjs/composition-api';
import { SfButton, SfHeader, SfImage } from '@storefront-ui/vue';
import { addBasePath } from '@vue-storefront/core';

export default {
  name: 'GatewayLayout',
  components: {
    SfButton,
    SfImage,
    SfHeader
  },
  setup() {
    const route = useRoute();

    return {
      route,
      addBasePath
    };
  }
};
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles';

.sf-header {
  --header-padding: var(--spacer-xs);
  @include for-desktop {
    --header-padding: 0;
  }
  &__logo-image {
    height: 100%;
  }
  &__text {
    margin-left: var(--spacer-sm);
    font: var(--font-weight--bold) var(--h3-font-size)
      var(--font-family--secondary);
  }
}

#layout {
  box-sizing: border-box;

  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.no-scroll {
  overflow: hidden;
  height: 100vh;
}

// Reset CSS
html {
  width: auto;

  @include for-mobile {
    overflow-x: hidden;
  }
}

body {
  overflow-x: hidden;
  color: var(--c-text);
  font-size: var(--font-size--base);
  font-family: var(--font-family--primary);
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: var(--c-link);

  &:hover {
    color: var(--c-link-hover);
  }
}

h1 {
  font-family: var(--font-family--secondary);
  font-size: var(--h1-font-size);
  line-height: 1.6;
  margin: 0;
}

h2 {
  font-family: var(--font-family--secondary);
  font-size: var(--h2-font-size);
  line-height: 1.6;
  margin: 0;
}

h3 {
  font-family: var(--font-family--secondary);
  font-size: var(--h3-font-size);
  line-height: 1.6;
  margin: 0;
}

h4 {
  font-family: var(--font-family--secondary);
  font-size: var(--h4-font-size);
  line-height: 1.6;
  margin: 0;
}
</style>
