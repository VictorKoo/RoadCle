/**设备状态 */
import uuidV4 from 'uuid/v4';
const initialState = {
  device: {
    id: 0,
    device_id: '',
    isTracking: false,
  },
};
const deviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_DEVICE': {
      return {
        device_id: uuidV4(),
      };
    }
    default:
      return state;
  }
};
export default deviceReducer;
