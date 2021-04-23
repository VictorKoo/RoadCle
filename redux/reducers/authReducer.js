const initialState = {
  token: '',
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TOKEN': {
      if (action.token !== null) {
        return {
          ...state,
          token: action.token,
        };
      } else {
        return {
          ...state,
          token: '',
        };
      }
    }
    default: {
      return state;
    }
  }
};
export default userReducer;
