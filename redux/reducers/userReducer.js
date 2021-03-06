const initialState = {
  user: {
    id: 0,
    uuid: '',
    online: 0,
    avatar: '',
    name: 'Not login',
    nickname: '',
    sex: 0,
    birthdate: '1998-04-30',
    remark: '',
    telephone: '',
    platform: 'Android',
    createdAt: '',
    updatedAt: '',
  },
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        // ...state,
        user: action.user,
      };
    case 'NEW_USER':
      return {
        ...state,
        user: action.user,
      };
    case 'INIT_USER':
      return {
        ...state,
      };
    default:
      return state;
  }
};
export default userReducer;
