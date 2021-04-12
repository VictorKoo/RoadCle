const initialState = {
  token: '',
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TOKEN': {
      if (action.token !== null) {
        return {
          token: action.token,
        };
      } else {
        return {
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
