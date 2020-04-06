<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.smAndDown ? 'px-3 py-1' : 'px-2 py-1'" >


    <v-layout row wrap >

      <v-flex xs12 mx-5>


          <v-layout column >

<!--            <v-flex  v-for="fileObject in generateFileObjects" :key="fileObject.fileName">-->
<!--                <DetailChart :url="baseStationURL + fileObject" :fileObject="fileObject" :chartdivID="fileObject"/>-->
<!--            </v-flex>-->

            <v-flex  v-for="file in generateFileList" :key="file">
              <DetailChart :url="baseStationURL + file" :chartdivID="file" />
            </v-flex>

          </v-layout>

      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>

import DetailChart from "../DetailChart";


export default {
  props: {
    currentStation: Object,
  },
  components: {
    DetailChart,
   // DetailChartTest
  },
  data: () => ({
    // baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURL: './testdata/',
    loadingStation: false,
    // fileNames: ['temp.json', 'temp_v.json',  'rh.json', 'rh_v.json', 'rad.json', 'rad_v.json',  'sheight.json', 'sheight_v.json',
    //     'ws.json', 'ws_v.json', 'wd.json', 'wd_v.json', 'press.json', 'press_v.json', 'battvolt.json', 'battvolt_v.json', ]
    // fileNames: ['temp_v.json', 'rh_v.json', 'rad_v.json', 'sheight_v.json', 'ws_v.json', 'wd_v.json', 'press_v.json',
    //     'battvolt_v.json']
    //fileNames: ['temp_v.json', 'press_v.json']
   fileNames: ['temp.json', 'temp_v.json']
   // fileNames: ['press_v.json', 'rad_v.json']
//     fileObjects: [
//         { fileName: 'temp_v.json', chartTitle: 'Air temp blala', furtherInfo: 'asdlkfasdöl'},
//         { fileName: 'press_v.json', chartTitle: 'Air Pressure blah'},
// ],
  }),
  watch: {
    // currentStation: function updateStation() {
    //   if (this.currentStation) {
    //     this.loadStation(this.baseStationURL + this.currentStation.alias);
    //   }
    // },
  },
  computed: {
    // loadStation() {
    // },

      generateFileList() {
          let fileList = []

          if (!this.currentStation){
            // handle empty case, just return the empty list
            return fileList;
          }

          for (let i = 0; i < this.fileNames.length; i++) {
            fileList.push(this.currentStation.id + this.fileNames[i])
          }

          return fileList
        }
      },


  //   generateFileObjects() {
  //     let fileObjectList = {}
  //
  //     if (!this.currentStation){
  //       // handle empty case, just return the empty object
  //       return fileObjectList;
  //     }
  //
  //     for (let i = 0; i < this.fileObjects.length; i++) {
  //       fileObjectList.push({fileName: this.currentStation.id + this.fileObjects[i].fileName})
  //     }
  //
  //     return fileObjectList
  //   }
  // },

};
</script>

<style scoped>

</style>