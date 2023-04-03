import axios from 'axios';

// export async function fetchPics(searchQuery) {
//   const BASE_URL = 'https://pixabay.com/api';
//   const API_KEY = '35004841-c462f882069db81ac1cfa6a88';
//   const searchParams = new URLSearchParams({
//     key: API_KEY,
//     q: searchQuery,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'true',
//     per_page: '40',
//   });

//   return await axios.get(`${BASE_URL}/?${searchParams}`);
// }

export default class PixabayApiService {
  #BASE_URL = 'https://pixabay.com/api';
  #API_KEY = '35004841-c462f882069db81ac1cfa6a88';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = null;
  }

  async fetchImages() {
    const searchParams = new URLSearchParams({
      key: this.#API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });

    return await axios.get(`${this.#BASE_URL}/?${searchParams}`);
  }

  incrementPage() {
    this.page += 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
