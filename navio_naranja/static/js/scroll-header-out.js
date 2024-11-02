let lastScrollY = window.scrollY;
const topBarHeight = document.querySelector('.top-bar').offsetHeight;
const messageContainer = document.getElementById('message-container');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const header = document.querySelector('header');
  const headerHeight = header.offsetHeight;

  if (currentScrollY > topBarHeight) {
    if (currentScrollY > lastScrollY) {
      header.classList.add('header-hidden');
      messageContainer.style.top = '0';
    } else {
      header.classList.remove('header-hidden');
      messageContainer.style.top = `${headerHeight}px`;
    }
  } else {
    header.classList.remove('header-hidden');
    messageContainer.style.top = `${headerHeight}px`;
  }

  lastScrollY = currentScrollY;
});
