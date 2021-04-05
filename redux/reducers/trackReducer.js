/**
 * 当前轨迹跟踪
 */
const initialState = {
  //   track: [{latitude: 0, longitude: 0, height: 0, loc_time: 0}],
  track: [],
};
const trackReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_POINT':
      return {
        track: [...state.track, action.point],
      };
    default:
      return state;
  }
};
export default trackReducer;
