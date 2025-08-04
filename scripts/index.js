const editProfileBtn = document.querySelector(".profile__edit-btn");

const editProfileModal = document.querySelector("#edit-profile-modal");

const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const editProfileForm = editProfileModal.querySelector(".modal__form");

const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);

const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");

const newPostModal = document.querySelector("#new-post-modal");

const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const profileNameEl = document.querySelector(".profile__name");

const profileDescriptionEl = document.querySelector(".profile__description");

const addCardFormElement = newPostModal.querySelector(".modal__form");

const imageInput = newPostModal.querySelector("#card-image-input");

const captionInput = newPostModal.querySelector("#card-caption-input");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  openModal(editProfileModal);
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  console.log("submitting");
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  evt.target.reset();
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  console.log(imageInput.value);
  console.log(captionInput.value);
  evt.target.reset();
  closeModal(newPostModal);
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);
