<template>
  <div class="MyHome">
    <TrafficRouteMap></TrafficRouteMap>
  </div>
</template>
  
  <script>
import TrafficRouteMap from "./TrafficRouteMap/index.vue";
export default {
  name: "MyHome",
  components: {
    TrafficRouteMap,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
  
  <style lang="scss" scoped></style>
  