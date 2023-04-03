import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';

import PixabayApiService from './js/pixabayApiService';
import { makeGalleryMarkup } from './js/makeGalleryMarkup';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', handleSubmitBtnClick);

async function handleSubmitBtnClick(e) {
  e.preventDefault();

  refs.loadMoreBtn.classList.add(`is-hidden`);
  refs.galleryEl.innerHTML = '';

  const pixabayApi = new PixabayApiService();

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
    pixabayApi.totalHits = totalHits;
  }
  pixabayApi.incrementPage();

  const galleryMarkup = makeGalleryMarkup(hits);

  markUpGallery(galleryMarkup);

  refs.loadMoreBtn.classList.remove(`is-hidden`);

  // refs.loadMoreBtn.addEventListener('click', handleLoadMore);

  // async function handleLoadMore() {
  //   console.log(pixabayApi.fetchImages.searchParams);
  // }

  const gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  gallery.refresh();
}

function markUpGallery(galleryMarkup) {
  refs.galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);
  refs.searchForm.reset();
}
// function handleLoadMore(e) {}
