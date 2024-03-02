import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderUserPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const postArr = posts.map((post) => {
    return {
      postUserId: post.user.id,
      postUserName: post.user.name,
      postUserImageUrl: post.user.imageUrl,
      postId: post.id,
      postImageUrl: post.imageUrl,
      postLikesCount: post.likes.length,
      postDescription: post.description,
      postDate: post.createdAt,
    };
  });

  const postHtml = postArr
    .map((post) => {
      return `
        <li class="post">
          <div class="post-image-container">
            <img class="post-image" src="${post.postImageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.postId}" class="like-button">
              <img src="./assets/images/like-active.svg">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.postLikesCount}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.postUserName}</span>
            ${post.postDescription}
          </p>
          <p class="post-date">
            ${post.postDate}
            <!--19 минут назад-->
          </p>
        </li>
    `;
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <div class="posts-user-header">
                    <img src="${postArr[0].postUserImageUrl}" class="posts-user-header__user-image">
                    <p class="posts-user-header__user-name">${postArr[0].postUserName}</p>
                </div>
                <ul class="posts">
                  ${postHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

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
