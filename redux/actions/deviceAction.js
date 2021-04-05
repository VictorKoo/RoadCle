export const initDevice = (device) => ({
  type: 'INIT_DEVICE',
  device,
});
export const startTrack = (device) => ({
  type: 'START_TRACK',
  device,
});
export const endTrack = (device) => ({
  type: 'END_TRACK',
  device,
});
