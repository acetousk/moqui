<template>
  <div>
    <div>{{  address.alias  }}</div>
    <div>{{  address.address1  }}</div>
    <div>{{  address.address2  }}</div>
    <div>{{  getPostCode(address.postcode)  }}</div>
    <div>{{  getCity(address)  }}</div>
    <div>{{  getProvince(address)  }},&nbsp;{{  getCountry(address)  }}</div>
    <div>{{  getPhone(address)  }}</div>
  </div>
</template>
<script>
import { userShippingGetters } from '@vue-storefront/moqui';

export default {
  name: 'UserShippingAddress',
  props: ['address'],
  setup() {
    return {
      getCity: userShippingGetters.getCity,
      getPostCode: userShippingGetters.getPostCode,
      getCountry: userShippingGetters.getCountry,
      getProvince: userShippingGetters.getProvince,
      getPhone: userShippingGetters.getPhone
    };
  }
};
</script>
