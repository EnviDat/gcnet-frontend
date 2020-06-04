<template>
  <v-card :ripple="!disabled"
          :hover="!disabled"
          :href="href"
          target="_blank"
          v-on:click.native="clicked"
          :disabled="disabled">
          
    <v-container grid-list-md pa-0>
      <v-layout row align-center>

        <v-flex xs3 md5 py-0
                ref="card_image_parent"
                style="overflow: hidden;"
                :style="`height: ${$vuetify.breakpoint.smAndDown ? '45px' : '100px'}`"
                >
          <img v-if="img"
                ref="card_image"
                style="height: 100%;"
                :src="img" />                        
        </v-flex>

        <v-flex xs9 md7 mx-1 mt-1>
            <div class="title"
                :class="{ 'compactTitle' : this.$vuetify.breakpoint.mdAndDown }"
            >
              {{ title }}
            </div>
        </v-flex>

      </v-layout>
    </v-container>

  </v-card>
</template>


<script>
export default {

  props: {
    title: String,
    disabled: Boolean,
    img: String,
    href: String,
  },
  methods: {
    clicked() {
      if (!this.href) {
        this.$emit('clicked', this.title.toLowerCase());
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .card .headline {
    font-size: 1.45em !important;
    overflow: inherit !important;
    text-overflow: inherit !important;
    max-height: inherit !important;
    line-height: inherit !important;
  }

  .compactTitle { 
    font-size: 15px !important; 
    line-height: 1.3em !important; 
  } 

  .v-card__media img {
    width: inherit !important;
  }
</style>