let lastScrollY = window.scrollY;
const topBarHeight = document.querySelector('.top-bar').offsetHeight;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const header = document.querySelector('header');

  if (currentScrollY > topBarHeight) {
    if (currentScrollY > lastScrollY) {
  
      header.classList.add('header-hidden');
    } else {
  
      header.classList.remove('header-hidden');
    }
  } else {

    header.classList.remove('header-hidden');
  }


  lastScrollY = currentScrollY;
});
