export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export function removeFirstWord(str) {
  const index = str.indexOf(" "); // Находим индекс первого пробела
  const newStr = str.slice(index + 1); // Вырезаем начиная с индекса следующего за пробелом
  return newStr;
}

export function replaceTag(str) {
  return (str = str.replaceAll("<", "&lt;").replaceAll(">", "&gt:"));
}
