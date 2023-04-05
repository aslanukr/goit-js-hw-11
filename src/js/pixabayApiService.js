import axios from 'axios';

export default class PixabayApiService {
  #BASE_URL = 'https://pixabay.com/api';
  #API_KEY = '35004841-c462f882069db81ac1cfa6a88';

  constructor() {
    this.searchQuery = null;
    this.totalHits = null;
    this.page = 1;
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
    const { data } = await axios.get(`${this.#BASE_URL}/?${searchParams}`);
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPageCount() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
