<template>
  <div>
    <div>{{ address.alias }}</div>
    <div>{{ address.address1 }}</div>
    <div>{{ address.address2 }}</div>
    <div>{{ address.postcode }}</div>
    <div>{{ address.city }}</div>
    <div>{{ getProvince(address) }},&nbsp;{{ getCountry(address) }}</div>
    <div>{{ getPhone(address) }}</div>
  </div>
</template>
<script>
import { userShippingGetters } from '@vue-storefront/moqui';

export default {
  name: 'UserShippingAddress',
  props: ['address'],
  setup() {
    return {
      getCountry: userShippingGetters.getCountry,
      getProvince: userShippingGetters.getProvince,
      getPhone: userShippingGetters.getPhone
    };
  }
};
</script>
