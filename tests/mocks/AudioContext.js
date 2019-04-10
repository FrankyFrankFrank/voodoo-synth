export default {
  createOscillator: () => {
    return {
      connect: () => {},
      start: () => {},
      frequency: {
        value: null,
        setTargetAtTime: () => {},
      }
    }
  },
  createGain: () => {
    return {
      gain: {
        value: 0,
        setTargetAtTime: () => {},
      },
      connect: () => {},
    }
  },
}
