const initialState = {
  record: [
    {
      id: 0,
      user_uuid: '',
      device_id: '',
      createdAt: '', //起点时间
      updatedAt: '', //终点时间
    },
  ],
};
const recordReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_RECORD':
      return {
        record: [...state.record, action.record],
      };
    default:
      return state;
  }
};
export default recordReducer;
