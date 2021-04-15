export const addPoint = (point, id) => ({
  type: 'ADD_POINT',
  point: point,
  record_id: id,
});

export const startTrack = () => ({
  type: 'START_TRACK',
});

export const endTrack = () => ({
  type: 'END_TRACK',
});
