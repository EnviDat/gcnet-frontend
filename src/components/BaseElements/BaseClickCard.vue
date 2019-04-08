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
                :style="`height: ${$vuetify.breakpoint.smAndDown ? '45px' : '60px'}`"
                >
          <img v-if="img"
                ref="card_image"
                v-on:load="setRandomPosition()"
                :src="img" />                        
        </v-flex>

        <v-flex xs9 md7 mx-1 mt-1>
            <div class="title"
                :class="{ 'compactTitle' : this.$vuetify.breakpoint.smAndDown }"
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
    randomImgPosition: Boolean,
  },
  // mounted() {
  //   if (!this.$props.randomImgPosition) {
  //     return;
  //   }

  //   this.$nextTick(()=> {
  //     this.setRandomPosition();
  //   })
  // },
  methods: {
    clicked() {
      if (!this.href) {
        this.$emit('clicked', this.title.toLowerCase());
      }
    },
    setRandomPosition() {
      if (!this.randomImgPosition){
        return;
      }

      if (!this.$refs.card_image_parent){
        return;
      }

      if (!this.$refs.card_image){
        return;
      }

      let styles = 'position: relative; '
      let rPos = 0;
      let tPos = 0;
      const margin = 100;
      const height = this.$refs.card_image.clientHeight - margin;
      const width = this.$refs.card_image.clientWidth - margin;

      if (height > 0){
        // tPos = this.randomIntFromInterval(0, height);
        tPos = this.randomIntFromSeed(0, height, this.title);
      }

      if (width > 0){
        // rPos = this.randomIntFromInterval(0, width);
        rPos = this.randomIntFromSeed(0, width, this.title);
      }

      styles += `right: ${rPos}px; bottom: ${tPos}px;`;

      this.$refs.card_image.style = styles;
    }
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