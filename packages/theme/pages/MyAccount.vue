<template>
  <div id="my-account">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <SfContentPages
      v-e2e="'my-account-content-pages'"
      :title="$t('My Account')"
      :active="activePage"
      class="my-account"
      @click:change="changeActivePage"
    >
      <SfContentCategory :title="$t('Personal details')">
        <SfContentPage :title="$t('My profile')">
          <MyProfile />
        </SfContentPage>

        <SfContentPage :title="$t('Shipping details')">
          <ShippingDetails />
        </SfContentPage>

        <!--
          <SfContentPage :title="$t('Billing details')">
          <BillingDetails />
        </SfContentPage>

        <SfContentPage :title="$t('My newsletter')">
          <MyNewsletter />
        </SfContentPage>
        -->
      </SfContentCategory>

      <SfContentCategory :title="$t('Order details')">
        <SfContentPage :title="$t('Order history')">
          <OrderHistory />
        </SfContentPage>
      </SfContentCategory>

      <SfContentPage :title="$t('Logout')" />
    </SfContentPages>
  </div>
</template>
<script>
import { SfBreadcrumbs, SfContentPages } from '@storefront-ui/vue';
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api';
import { useUser } from '@vue-storefront/moqui';
import MyProfile from './MyAccount/MyProfile';
import ShippingDetails from './MyAccount/ShippingDetails';
import MyNewsletter from './MyAccount/MyNewsletter';
import OrderHistory from './MyAccount/OrderHistory';
import {
  mapMobileObserver,
  unMapMobileObserver
} from '@storefront-ui/vue/src/utilities/mobile-observer.js';

export default {
  name: 'MyAccount',
  components: {
    SfBreadcrumbs,
    SfContentPages,
    MyProfile,
    ShippingDetails,
    MyNewsletter,
    OrderHistory
  },
  middleware: ['is-authenticated'],
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const breadcrumbs = ref([]);

    const { logout } = useUser();
    const isMobile = computed(() => mapMobileObserver().isMobile.get());
    const activePage = computed(() => {
      const { pageName } = route.value.params;

      if (pageName) {
        return (pageName.charAt(0).toUpperCase() + pageName.slice(1)).replace(
          '-',
          ' '
        );
      } else if (!isMobile.value) {
        return context.root.$t('My profile');
      } else {
        return '';
      }
    });

    const changeActivePage = async (title) => {
      if (title === context.root.$t('Logout')) {
        await logout();
        router.push(context.root.localePath({ name: 'home' }));
        return;
      }

      const slugifiedTitle = (title || '').toLowerCase().replace(' ', '-');
      const transformedPath = `/my-account/${slugifiedTitle}`;
      const localeTransformedPath = context.root.localePath(transformedPath);

      router.push(localeTransformedPath);
    };

    onMounted(() => {
      breadcrumbs.value = [
        {
          text: context.root.$t('Home'),
          route: { link: context.root.localePath({ name: 'home' }) }
        },
        {
          text: context.root.$t('My Account'),
          route: { link: '#' }
        }
      ];
    });

    onBeforeUnmount(() => {
      unMapMobileObserver();
    });

    return { breadcrumbs, changeActivePage, activePage };
  }
};
</script>

<style lang="scss" scoped>
#my-account {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.my-account {
  @include for-mobile {
    --content-pages-sidebar-category-title-font-weight: var(
      --font-weight--normal
    );
    --content-pages-sidebar-category-title-margin: var(--spacer-sm)
      var(--spacer-sm) var(--spacer-sm) var(--spacer-base);
  }
  @include for-desktop {
    --content-pages-sidebar-category-title-margin: var(--spacer-xl) 0 0 0;
  }
}
.breadcrumbs {
  margin: var(--spacer-base) 0 var(--spacer-lg);
}
</style>
