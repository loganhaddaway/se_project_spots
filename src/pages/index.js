import "./index.css";
import { enableValidation, settings } from "../scripts/validation.js";
import Api from "../utils/Api.js";
import {
  enableValidation,
  settings,
  hideInputError,
  toggleButtonState,
} from "../scripts/validation.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e28103d0-a464-4ad6-b87d-b6fdfd2fc798",
    "Content-Type": "application/json",
  },
});

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileSubmitBtn =
  editProfileForm.querySelector(".modal__submit-btn");
const editProfileSubmitBtnText = editProfileSubmitBtn.textContent;

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const addCardFormElement = newPostModal.querySelector(".modal__form");
const newPostSubmitBtn = addCardFormElement.querySelector(".modal__submit-btn");
const newPostSubmitBtnText = newPostSubmitBtn.textContent;

const imageInput = newPostModal.querySelector("#card-image-input");
const captionInput = newPostModal.querySelector("#card-caption-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = document.querySelector("#preview-modal .modal__image");
const previewCaptionEl = document.querySelector(
  "#preview-modal .modal__caption"
);

// ---------- AVATAR MODAL ELEMENTS ----------
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn"); // was ".modal__close"
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarSubmitBtnText = avatarSubmitBtn.textContent;

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteSubmitBtn = deleteForm.querySelector('button[type="submit"]');
const deleteSubmitBtnText = deleteSubmitBtn.textContent;

let selectedCardElement = null;
let selectedCardId = null;

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function renderLoading(
  isLoading,
  buttonEl,
  defaultText,
  loadingText = "Saving..."
) {
  buttonEl.textContent = isLoading ? loadingText : defaultText;
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.currentTarget);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("mousedown", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("mousedown", handleOverlayClick);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
    if (!data._id) return; // safety: local cards won't have an id yet

    const isLiked = cardLikeBtnEl.classList.contains("card__like-btn_active");

    const likeRequest = isLiked
      ? api.removeLike(data._id)
      : api.addLike(data._id);

    likeRequest
      .then((updatedCard) => {
        // keep local data in sync
        data.isLiked = updatedCard.isLiked;

        if (updatedCard.isLiked) {
          cardLikeBtnEl.classList.add("card__like-btn_active");
        } else {
          cardLikeBtnEl.classList.remove("card__like-btn_active");
        }
      })
      .catch(console.error);
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  cardDeleteBtnEl.addEventListener("click", () => {
    selectedCardElement = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

api
  .getAppInfo()
  .then(([user, cards]) => {
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileAvatarEl.src = user.avatar;
    profileAvatarEl.alt = user.name;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// ---------- EVENT HANDLERS ----------

editProfileBtn.addEventListener("click", () => {
  openModal(editProfileModal);
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  renderLoading(
    true,
    editProfileSubmitBtn,
    editProfileSubmitBtnText,
    "Saving..."
  );

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;

      evt.target.reset();

      const inputList = Array.from(
        evt.target.querySelectorAll(".modal__input")
      );
      inputList.forEach((inputEl) =>
        hideInputError(evt.target, inputEl, settings)
      );

      const submitButton = evt.target.querySelector(".modal__submit-btn");
      toggleButtonState(inputList, submitButton, settings);

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(
        false,
        editProfileSubmitBtn,
        editProfileSubmitBtnText,
        "Saving..."
      );
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  renderLoading(true, newPostSubmitBtn, newPostSubmitBtnText, "Saving...");

  const inputValues = {
    name: captionInput.value,
    link: imageInput.value,
  };

  api
    .addCard(inputValues)
    .then((createdCard) => {
      const cardElement = getCardElement(createdCard);
      cardsList.prepend(cardElement);

      evt.target.reset();

      const inputList = Array.from(
        evt.target.querySelectorAll(".modal__input")
      );
      inputList.forEach((inputEl) =>
        hideInputError(evt.target, inputEl, settings)
      );
      toggleButtonState(inputList, newPostSubmitBtn, settings);

      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, newPostSubmitBtn, newPostSubmitBtnText, "Saving...");
    });
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  renderLoading(true, avatarSubmitBtn, avatarSubmitBtnText, "Saving...");

  api
    .editAvatar({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      profileAvatarEl.alt = data.name;

      evt.target.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, avatarSubmitBtn, avatarSubmitBtnText, "Saving...");
    });
}

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteModalCloseBtn.addEventListener("click", () => {
  selectedCardElement = null;
  selectedCardId = null;
  closeModal(deleteModal);
});

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  renderLoading(true, deleteSubmitBtn, deleteSubmitBtnText, "Deleting...");

  api
    .removeCard(selectedCardId)
    .then(() => {
      if (selectedCardElement) selectedCardElement.remove();
      selectedCardElement = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, deleteSubmitBtn, deleteSubmitBtnText, "Deleting...");
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

enableValidation(settings);
