# TODOs
- GIT repository erstellen auf http://gitlab.wsl.ch/
- Add elevation information on hover
- Refactor PHP -> Javascript
- Drop-down with list of stations
- Add all stations in JSON file -> see data from Ionut below and data from Dominik Haas 
- Test everything on IE






Number Station Name    Station nickname
------------------------------------------
0      Swiss Camp 10m    10m   
1      Swiss Camp        sc
2      Crawford Point    cp1
3      NASA-U            nasau
4      GITS              gits
5      Humboldt          hum
6      Summit Station    summit
7      Tunu North        tunu
8      DYE-II            dye
9      JAR-1             jar1
10     Saddle
11     South Dome        sdome
12     NASA East         nasae
15     NASA South-East   nasase
22     Petermann         pet
23     NEEM         
24     East GRIP         egrip
30     LAR1
31     PE Gun
32     PE Blu
33     PE Air


Hier das erwähnte JSON
Ich brauch einfach name und filename.
var DataSets = [
       { name: 'Swiss Camp', fileName: '1.csv', data : { }},
       { name: 'Swiss Camp-10m', fileName: '0.csv',  data : { }},
       { name: 'Summit', fileName: '6.csv', data : { }},
       { name: 'JAR-1', fileName: '9.csv', data : { }},
       { name: 'Saddle', fileName: '10.csv', data : { }},
       { name: 'NASA-E', fileName: '12.csv', data : { }},
       { name: 'East GRIP', fileName: '24.csv', data : { }},
       { name: 'LAR1', fileName: '30.csv', data : { }},

       { name: 'CP1', fileName: '2.csv', data : { }},
       { name: 'NASA-U', fileName: '3.csv', data : { }},
       { name: 'DYE-II', fileName: '8.csv', data : { }},
       { name: 'South Dome', fileName: '11.csv', data : { }},
       { name: 'NASA-SE', fileName: '15.csv', data : { }},
       { name: 'NEEM', fileName: '23.csv', data : { }},

       { name: 'GITS', fileName: '4.csv', data : { }},
       { name: 'Humboldt', fileName: '5.csv', data : { }},
       { name: 'Tunu-N', fileName: '7.csv', data : { }},
       { name: 'PET', fileName: '22.csv', data : { }},
       { name: 'PE_blu', fileName: '32.csv', data : { }},
       { name: 'PE_gun', fileName: '31.csv', data : { }},
       { name: 'PE_AIR', fileName: '33.csv', data : { }},

   ];