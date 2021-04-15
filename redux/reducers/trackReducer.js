/**
 * 当前轨迹跟踪
 */
const initialState = {
  //   track: [{latitude: 0, longitude: 0, height: 0, loc_time: 0}],
  trackPoint: [
    {
      latitude: 0.0,
      longitude: 0.0,
      // altitude: 0.0,
    },
  ],
  record_id: '',
  isTracking: false,
};
const trackReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_POINT':
      return {
        trackPoint: [...state.trackPoint, action.point],
        record_id: action.record_id,
      };
    case 'START_TRACK': {
      return {
        ...state,
        isTracking: true,
      };
    }
    case 'END_TRACK': {
      return {
        ...state,
        isTracking: false,
      };
    }
    default:
      return state;
  }
};
export default trackReducer;
