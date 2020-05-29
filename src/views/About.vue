<template>
  <v-container fluid
                grid-list-lg
                fill-height
                pa-0
                >

    <v-layout row wrap >
  
      <v-flex xs12 md8 offset-md2 >

        <v-flex pb-3>
          <title-view :title="homeInfos.title"
                      :slogan="homeInfos.startText"
                      />
        </v-flex>

        <v-flex xs12
                pt-5>
          <p v-html="homeInfos.homeText"></p>
        </v-flex>

        <v-flex xs12
                pt-3
                >
          <p v-html="homeInfos.awsInfo"></p>
        </v-flex>

        <v-flex xs12 >
          <p v-html="homeInfos.gcnetTransmissionsInfo"></p>
        </v-flex>

        <v-flex xs12 >
          <v-layout row wrap align-center>
            <v-flex xs12 >
              <h3>The GC-Net Portal is a joint project of WSL and CIRES</h3>
            </v-flex>

            <v-flex xs6 >
              <a href="https://www.wsl.ch/en/ueber-die-wsl.html" target="_blank">
                <img style="height: 100px;" src="@/assets/WSL_logo.png" alt="WSL Logo">
              </a>
              <div class="caption">Swiss Federal Institute <br />for Forest, Snow and Landscape Research WSL</div>
            </v-flex>

            <v-flex xs6 >
              <a href="https://cires.colorado.edu/about" target="_blank">
                <img style="height: 100px; background-color: gray;" src="@/assets/cireslogo_footer.png" alt="CIRES Logo" >
              </a>
              <div class="caption">Cooperative Institute for Research in Environmental Sciences <br />at the University of Colorado Boulder</div>
            </v-flex>

          </v-layout>
        </v-flex>

        <v-flex xs12 >
          <p v-html="homeInfos.additionalInfo"></p>
        </v-flex>

      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import TitleView from '@/components/TitleView.vue';
import homeInfos from '@/homeInfos';

export default {
  props: {
  },
  components: {
    TitleView,
  },
  data: () => ({
    homeInfos,
  }),
  methods: {
  },

};
</script>

<style scoped>
</style>
