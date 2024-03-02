import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { clickLikes } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
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
      isLiked: post.isLiked,
      postLikes: post.likes,
    };
  });

  const postHtml = postArr
    .map((post, index) => {
      let likeImg;
      let likeCount;
      post.isLiked
        ? (likeImg = `like-active.svg`)
        : (likeImg = `like-not-active.svg`);

      if (post.postLikesCount === 1) {
        likeCount = post.postLikes[0].name;
      } else if (post.postLikesCount > 1) {
        likeCount = `${post.postLikes[0].name} и ещё ${
          post.postLikesCount - 1
        }`;
      } else if (post.postLikesCount < 1) {
        likeCount = "0";
      }

      return `
          <li class="post">
          <div class="post-header" data-user-id="${post.postUserId}">
              <img src="${post.postUserImageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.postUserName}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.postImageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${index}" class="like-button">
              <img src="./assets/images/${likeImg}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong id="like-count${index}">${likeCount}</strong>
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
      })
        .then((data) => {
          if (postArr[arrId].isLiked) {
            postArr[arrId].isLiked = false;
            likeEl.innerHTML = `<img src="./assets/images/like-not-active.svg">`;
            if (data.post.likes.length === 1) {
              likeCount.innerHTML = data.post.likes[0].name;
            } else if (data.post.likes.length > 1) {
              likeCount.innerHTML = `${data.post.likes[0].name} и ещё ${
                data.post.likes.length + 1
              }`;
            } else if (data.post.likes.length < 1) {
              likeCount.innerHTML = "0";
            }
          } else {
            postArr[arrId].isLiked = true;
            likeEl.innerHTML = `<img src="./assets/images/like-active.svg">`;
            if (data.post.likes.length === 1) {
              likeCount.innerHTML = data.post.likes[0].name;
            } else if (data.post.likes.length > 1) {
              likeCount.innerHTML = `${data.post.likes[0].name} и ещё ${
                data.post.likes.length - 1
              }`;
            } else if (data.post.likes.length < 1) {
              likeCount.innerHTML = "0";
            }
          }
        })
        .catch((error) => {
          if (error.message === "Нет авторизации") {
            alert("Лайкать посты могут только автризованные пользователи");
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
