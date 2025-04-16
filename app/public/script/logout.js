// Logout User
function logoutUser() {
  document.cookie = "UserID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Lax";
  window.location.href = 'login.html';
}