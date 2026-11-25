;(function () {
  try {
    if (localStorage.getItem('p4e-theme') === 'dark') {
      document.documentElement.classList.add('dark')
    }
  } catch (_) {}
})()
