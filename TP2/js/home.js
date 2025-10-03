let count = 1;

window.setInterval(() => {
  window.location.href = `#slide${count}`;
  count++;
  if (count > 3) count = 1;
}, 2000);
