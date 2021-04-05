const initialState = {
  user: {
    id: 0,
    uuid: '',
    online: 0,
    avatar: '',
    name: '未登录',
    nickname: '',
    sex: 0,
    birthdate: '1998-04-30',
    remark: null,
    telephone: null,
    platform: 'Android',
    createdAt: '',
    updatedAt: '',
  },
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};
export default userReducer;
