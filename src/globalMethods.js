import seedrandom from 'seedrandom';

export default {
  methods: {
    randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    randomIntFromSeed(min, max, seed = 'For the Horde!') {
      const rng = seedrandom(seed);
      let multiplier = 10;
      if (max > multiplier) {
        multiplier = max;
      }
      const r = Math.floor(rng() * multiplier);
  
      if (r > max) {
        return max;
      }
      if (r < min) {
        return min;
      }
  
      return r;
    },
  },
};
