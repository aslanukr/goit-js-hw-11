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

  // =============== SEARCH HANDLING =====================

  pixabayApi.query = e.currentTarget.elements.searchQuery.value.trim();

  if (!pixabayApi.query) {
    Notiflix.Notify.info('Please enter your Search request');
    return;
  }

  try {
    const { totalHits, hits } = await pixabayApi.fetchImages();
    pixabayApi.totalHits = totalHits;

    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (pixabayApi.page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`);
    }

    pixabayApi.incrementPage();

    // =============== GALLERY MARKUP =====================

    const galleryMarkup = await makeGalleryMarkup(hits);

    markUpGallery(galleryMarkup);

    gallery.refresh();

    if (totalHits > hits.length) {
      refs.loadMoreBtn.classList.remove(`is-hidden`);
    }
  } catch (err) {
    console.log(err);
  }
}
// =============== LOAD MORE BTN FUNCTIONALITY =====================

refs.loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleLoadMore() {
  refs.spinIconEl.classList.add('animation-spin');

  try {
    const { totalHits, hits } = await pixabayApi.fetchImages();

    pixabayApi.incrementPage();

    const loadMoreMarkup = await makeGalleryMarkup(hits);
    markUpGallery(loadMoreMarkup);

    gallery.refresh();

    refs.spinIconEl.classList.remove('animation-spin');

    if ((pixabayApi.page - 1) * 40 >= pixabayApi.totalHits) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      refs.loadMoreBtn.classList.add('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
}

// =============== GALLERY MARKING UP FUNCTION =====================

function markUpGallery(markup) {
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  refs.searchForm.reset();
}
