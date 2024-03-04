import { renderHeaderComponent } from "./header-component.js";
import { posts, getToken, setPost } from "../index.js";
import { clickLikes } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { removeFirstWord } from "../helpers.js";

export function renderUserPageComponent({ appEl }) {
  const postArr = posts.map((post) => {
    return {
      postUserId: post.user.id,
      postUserName: post.user.name,
      postUserImageUrl: post.user.imageUrl,
      postId: post.id,
      postImageUrl: post.imageUrl,
      postLikesCount: post.likes.length,
      postDescription: post.description,
      postDate: removeFirstWord(
        formatDistanceToNow(new Date(post.createdAt), { locale: ru }) + " назад"
      ),
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

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      const arrId = likeEl.dataset.postId;
      const postId = postArr[arrId].postId;
      let action;

      postArr[arrId].isLiked ? (action = "dislike") : (action = "like");

      clickLikes({
        token: getToken(),
        postId,
        action,
      })
        .then((response) => {
          posts[arrId] = response.post;
          setPost(posts);
          renderUserPageComponent({ appEl });
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
}
