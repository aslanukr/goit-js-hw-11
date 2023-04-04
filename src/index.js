import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import PixabayApiService from './js/pixabayApiService';
import { makeGalleryMarkup } from './js/makeGalleryMarkup';

// =============== REFS =====================

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
  spinIconEl: document.querySelector('.spinner-icon'),
};

const pixabayApi = new PixabayApiService();

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
// =============== ON SUBMIT =====================

refs.searchForm.addEventListener('submit', handleSubmitBtnClick);

async function handleSubmitBtnClick(e) {
  e.preventDefault();

  // =============== SEARCH RESET =====================

  refs.loadMoreBtn.classList.add(`is-hidden`);

  refs.galleryEl.innerHTML = '';
  pixabayApi.resetPageCount();
  pixabayApi.query = null;

  // =============== SEARCH HANDLING =====================

  pixabayApi.query = e.currentTarget.elements.searchQuery.value.trim();

  if (!pixabayApi.query) {
    Notiflix.Notify.info('Please enter your Search request');
    return;
  }

  const searchResults = await pixabayApi
    .fetchImages()
    .then(res => {
      return res;
    })
    .catch(console.log);

  const {
    data: { totalHits, hits },
  } = searchResults;

  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (pixabayApi.page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`);
  }

  pixabayApi.totalHits = totalHits;

  // =============== GALLERY MARKUP =====================

  const galleryMarkup = makeGalleryMarkup(hits);

  markUpGallery(galleryMarkup);

  pixabayApi.incrementPage();
  gallery.refresh();

  // =============== LOAD MORE BTN FUNCTIONALITY =====================

  if (totalHits > hits.length) {
    refs.loadMoreBtn.classList.remove(`is-hidden`);
  }

  refs.loadMoreBtn.addEventListener('click', handleLoadMore);

  async function handleLoadMore() {
    refs.spinIconEl.classList.add('animation-spin');
    const loadMoreResults = await pixabayApi
      .fetchImages()
      .then(res => {
        return res;
      })
      .catch(console.log);

    const {
      data: { totalHits, hits },
    } = loadMoreResults;

    const loadMoreMarkup = makeGalleryMarkup(hits);
    markUpGallery(loadMoreMarkup);

    pixabayApi.incrementPage();

    gallery.refresh();

    refs.spinIconEl.classList.remove('animation-spin');

    if ((pixabayApi.page - 1) * 40 >= pixabayApi.totalHits) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      refs.loadMoreBtn.classList.add('is-hidden');
    }
  }
}

// =============== GALLERY MARKING UP FUNCTION =====================

function markUpGallery(galleryMarkup) {
  refs.galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);
  refs.searchForm.reset();
}
