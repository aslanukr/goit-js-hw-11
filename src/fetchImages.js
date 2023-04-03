import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '35004841-c462f882069db81ac1cfa6a88';

// export const fetchPics = searchQuery =>
//   fetch(
//     `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&image_type=photo$orientation=horizontal&safesearch=true`
//   ).then(res => {
//     if (!res.ok) {
//       Notiflix.Notify.failure('Oops, there is no country with that name');
//     }

//     return res.json();
//   });

export async function fetchPics(searchQuery) {
  return await axios.get(
    `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&image_type=photo$orientation=horizontal&safesearch=true`
  );
}
