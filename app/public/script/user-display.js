export function updateUserInfo(userData) {
  document.querySelectorAll(".userNameAff").forEach((element) => {
    element.innerHTML = userData.username || "";
  });
  document.querySelectorAll(".displayNameAff").forEach((element) => {
    element.innerHTML = userData.display_name || "";
  });
  document.querySelector("#logOutAff").innerHTML =
    "Se déconnecter de @" + userData.username || "";
}