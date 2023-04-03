import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';

import { fetchPics } from './fetchImages';
import { makeGalleryMarkup } from './makeGalleryMarkup';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', handleSubmitBtnClick);
// refs.loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSubmitBtnClick(e) {
  e.preventDefault();
  const searchQuery = e.target.elements['searchQuery'].value.trim();
  const searchResults = await fetchPics(searchQuery);

  const imageArray = searchResults.data.hits;

  const galleryMarkup = makeGalleryMarkup(imageArray);

  refs.galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);

  let gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

// function handleLoadMore(e) {}
