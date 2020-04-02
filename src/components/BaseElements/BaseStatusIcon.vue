<template>

  <v-layout row
            @mouseover="hoverBadge = true"
            @mouseleave="hoverBadge = false">

    <v-flex v-if="count > 0"
            pa-0
            style="z-index: 1;">
      <v-badge v-bind="{ left: !hoverBadge }"
                overlap
                secondary
                 >
        <span slot="badge"
              class="black--text"
              secondary
              style="font-size: 9px !important;">{{ count }}</span>
      </v-badge>              
    </v-flex>

    <v-flex py-0 px-1 >
      <v-btn icon small
            class="ma-0"
            :color="color"
            style="height: 20px !important; width: 20px !important;"
            @click="$emit('click')">
        <v-icon small >{{ icon }}</v-icon>
      </v-btn>
      <!-- <img class="envidatIcon" :src="iconString" />                 -->
    </v-flex>
    
  </v-layout>


</template>

<script>
  export default {
    props: {
      icon: String,
      count: Number,
      color: String,      
    },
    data: () => ({
      hoverBadge: false,
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