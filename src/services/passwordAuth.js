import axios from 'axios';

export const authPassword = (userName, psw) => {
  axios
    .get('', {})
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
