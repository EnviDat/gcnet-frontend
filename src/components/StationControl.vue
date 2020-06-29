<template>
  <v-card >
  
    <v-container fluid pa-3>
      <v-layout row wrap> 

        <v-flex xs12
                class="display-1"
                style="text-align: center;">
          {{ `Detailed charts of ${ stationName } station` }}
        </v-flex>


        <v-flex xs12 sm6 shrink>
          <v-layout column>
            <v-flex class="title">Directly scroll to specific measurement</v-flex>

            <v-flex pt-4>
              <v-layout row wrap>

                <v-flex v-for="(paramObj, index) in paramList"
                        :key="index"
                        pa-0>

                  <v-btn color="primary"
                        :small="$vuetify.breakpoint.mdAndUp"
                        @click="$emit('paramClick', paramObj.fileName);">
                    {{ paramObj.paramName }}
                  </v-btn>
                </v-flex>                

              </v-layout>
            </v-flex>

            <v-flex pt-4>
              <v-layout row wrap align-center
                        @click="convertLocalTime = !convertLocalTime; $emit('localTimeClick', convertLocalTime)"
                        style="cursor: pointer;" >
                <v-flex shrink >
                  <v-icon :color="convertLocalTime ? 'accent' : 'primary'" >{{ convertLocalTime ? 'check_box' : 'check_box_outline_blank' }}</v-icon>
                </v-flex>                
                <v-flex shrink >
                  <v-icon >access_time</v-icon>
                </v-flex>                
                <v-flex shrink >
                  Convert to chart times to your local time
                </v-flex>                
              </v-layout>
            </v-flex>

          </v-layout>
        </v-flex>
        
        <v-flex xs12 sm6 grow>
          <v-layout column align-center fill-height>

            <v-flex shrink>
              <img style="height: 450px; max-width: 100%; "
                    :src="stationImage" />
            </v-flex>

            <!-- <v-flex shrink
                    pa-0>
              <v-btn
                dark
                small
                color="secondary"
                @click="expand = !expand" >

                {{ expand ? 'Minimize Image' : 'Expand Image' }}

                <v-icon right >image</v-icon>
              </v-btn>
            </v-flex> -->
            
          </v-layout>
        </v-flex>

      </v-layout>
    </v-container>
  </v-card>

</template>

<script>

export default {
  name: 'StationControl',
  components:{
  },
  props: {
    stationName: String,
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
    convertLocalTime: false,
    smallSize: 140,
  }),
};
</script>

<style>

</style>