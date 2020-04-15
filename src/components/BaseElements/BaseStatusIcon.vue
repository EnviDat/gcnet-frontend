<template>

  <div :style="`background-color: ${color}; padding: 0px 2px; border-radius: 50%;`">
    <v-icon small >
      {{ icon }}
    </v-icon>
  </div>

</template>

<script>
  export default {
    props: {
      icon: String,
      size: {
        type: Number,
        default: () => {
          return 20;
        },
      },
      color: String,
    },
    data: () => ({
    }),
    computed: {
    },
  };
</script>

<style>
  .iconCentering {
    position: relative;
    top: 2px;
  }
</style>