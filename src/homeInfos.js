export default {
  title: 'GC Net Data Portal',
  startText: 'Select stations in the menu to the left!',
  homeText: `Prof. Dr. Konrad Steffen is the principal investigator of this project.

  GC-Net Automated Weather Stations (AWS) are collecting climate information on Greenland's ice sheet. They are equipped with communication satellite transmitters that enable near-real time monitoring of weather conditions on the Greenland ice sheet. Transmission latency is typically 1-2 hours, and occasionally as long as 48 hours. All times displayed are Zulu = UTC.
  
  Hourly average data are transmitted via a satellite link (GOES or ARGOS) throughout the year. In addition, measurements are stored in solid state memory. The system is powered with two 100 Ah batteries, charged by a 10 or 20 W solar panel. The satellite data-link is powered by two separate 100 Ah batteries connected to a 20 W solar panel. This setup guarantees continuous data recordings and storage, even in the case of satellite transmission failure. For more information on the GC-NET see: <a href="http://cires1.colorado.edu/steffen/gcnet/" target="_blank">GC-Net@CIRES.colorado.edu.</a>`,
  awsInfo: `As of the 1999 field season, 18 automatic weather stations (AWS) are collecting climate information on Greenland's ice sheet. Each AWS is equipped with a number of instruments to sample the following:

  air temperature, wind speed, wind direction, humidity, pressure
  accumulation rate at high temporal resolution to identify and resolve individual storms
  surface radiation balance in visible and infrared wavelengths
  sensible and latent heat flux fluxes
  snowpack conductive heat fluxes

  Hourly average data are transmitted via a satellite link (GOES or ARGOS) throughout the year. In addition, measurements are stored in solid state memory. The system is powered with two 100 Ah batteries, charged by a 10 or 20 W solar panel. The satellite data-link is powered by two separate 100 Ah batteries connected to a 20 W solar panel. This setup guarantees continuous data recordings and storage, even in the case of satellite transmission failure. The expected lifetime of the instrumentation is 5 years.`,
  gcnetTransmissionsInfo: `PARCA GC-Net Automated Weather Stations (AWS) are equipped with communication satellite transmitters that enable near-real time monitoring of weather conditions on the Greenland ice sheet. Transmission latency is as short as 4 minutes, typically 1-2 hours, and occasionally as long as 48 hours. See graphs of the most recent transmissions in the links listed on the right side of this page.

  For more information on the GC-NET see:
  
  Steffen, K., J. E. Box, and W. Abdalati, 1996 "Greenland Climate Network: GC-Net", in Colbeck, S. C. Ed. CRREL 96-27 Special Report on Glaciers, Ice Sheets and Volcanoes, trib. to M. Meier, pp. 98-103.
  
  You can request data via the Web or download data from Humboldt and TUNU-N sites from our FTP Server.
  
  Dr. Konrad Steffen is the principal investigator of this project.`,
  additionalInfo: `
  There is no transmission from NASA-SE, Kulu, JAR3, or KAR.
  Kar, Kulu, and Aurora stations have been removed.
  Click here to learn about the cloud amount estimates.
  Times are in UTC.
  For conversion of Julian day (Day of year) to calendar date, use ASCII data link.
  On the plots, observations are represented by square crosses.
  The plots are updated at 50 minutes into each hour.
  You may need to clear the memory cache when reloading updated files.
`,
  links: [
    { text: 'publications', url: 'http://cires1.colorado.edu/steffen/gcnet/publications.html' },
    { text: 'Greenland Weather Links', url: 'http://cires1.colorado.edu/science/groups/steffen/greenland/weatherlinks.html' },
  ],
};
