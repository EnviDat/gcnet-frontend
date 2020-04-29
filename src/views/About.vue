<template>
  <v-container fluid
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
