document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.querySelector('.bg-white.p-4.rounded-t-lg button');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleMessageBox);
  }
});

function toggleMessageBox() {
  document.getElementById('messageBox').classList.toggle('hidden');
}