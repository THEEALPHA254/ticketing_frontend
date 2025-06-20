<template>
  <v-breadcrumbs>
    <template v-for="(item, index) in breadCrumbs" :key="index">
      <v-breadcrumbs-item
        :to="item.to"
        :disabled="item.disabled || index === breadCrumbs.length - 1"
        class="text-subtitle-2 crumb-item"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
      <template v-if="index !== breadCrumbs.length - 1"> / </template>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  computed: {
    breadCrumbs() {
      const crumbs = [];
      const matched = this.$route.matched;
      matched.forEach((route) => {
        if (route.meta && route.meta.breadCrumb) {
          const breadCrumb = route.meta.breadCrumb;
          if (typeof breadCrumb === "function") {
            crumbs.push(...breadCrumb.call(this, route));
          } else if (Array.isArray(breadCrumb)) {
            crumbs.push(...breadCrumb);
          } else {
            crumbs.push(breadCrumb);
          }
        }
      });
      return crumbs;
    },
  },
};
</script>
