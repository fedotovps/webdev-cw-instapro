import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const postHtml = posts
    .map((post) => {
      let likeImg;
      post.isLiked
        ? (likeImg = `like-active.svg`)
        : (likeImg = `like-not-active.svg`);

      return `
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="./assets/images/${likeImg}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes.length}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>
          <p class="post-date">
            ${post.createdAt}
            <!--19 минут назад-->
          </p>
        </li>
    `;
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      const arrId = likeEl.dataset.postId;
      const postId = postArr[arrId].postId;
      let action;
      const likeCount = document.getElementById("like-count" + arrId);

      postArr[arrId].isLiked ? (action = "dislike") : (action = "like");

      clickLikes({
        token: getToken(),
        postId,
        action,
      }).then((data) => {
        if (postArr[arrId].isLiked) {
          postArr[arrId].isLiked = false;
          likeEl.innerHTML = `<img src="./assets/images/like-not-active.svg">`;
          likeCount.innerHTML = data.post.likes.length;
        } else {
          postArr[arrId].isLiked = true;
          likeEl.innerHTML = `<img src="./assets/images/like-active.svg">`;
          likeCount.innerHTML = data.post.likes.length;
        }
      });
    });
  }

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
