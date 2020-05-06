<template>
  <v-card >
  
    <v-container fluid pa-3>
      <v-layout row wrap> 

        <v-flex xs12 sm6 shrink>
          <v-layout column>
            <v-flex class="title">Directly scroll to specific measurement</v-flex>

            <v-flex pt-4>
              <v-layout row wrap>

                <v-flex v-for="(paramObj, index) in paramList"
                        :key="index"
                        xs12 sm6
                        pa-0>

                  <v-btn color="primary"
                        :small="$vuetify.breakpoint.mdAndUp"
                        @click="$emit('paramClick', paramObj.fileName);">
                    {{ paramObj.paramName }}
                  </v-btn>
                </v-flex>                

              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        
        <v-flex xs12 sm6 grow>
          <v-layout column align-center fill-height>

            <v-flex shrink>
              <img :style="`height: ${ expand ? bigSize : smallSize }px; transition: all 0.3s; max-width: 100%;`"
                    :src="expand ? stationImage : stationPreloadImage" />
            </v-flex>

            <v-flex shrink
                    pa-0>
              <v-btn
                dark
                small
                color="secondary"
                @click="expand = !expand" >

                {{ expand ? 'Minimize Image' : 'Expand Image' }}

                <v-icon right >image</v-icon>
              </v-btn>
            </v-flex>
            
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>

</template>

<script>
export default {
  name: 'StationControl',
  props: {
    stationImage: String,
    stationPreloadImage: String,
    paramList: Array,
  },
  computed: {
    bigSize(){
      return this.$vuetify.breakpoint.xsOnly ? 450 : 700;
    },
  },
  data: () => ({
    expand: false,
    smallSize: 140,
  }),
};
</script>

<style>

</style>