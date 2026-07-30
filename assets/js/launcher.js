function scalePreviews() {
  document.querySelectorAll(".menu__card-preview").forEach((container) => {
    const iframe = container.querySelector("iframe");
    const scale = container.clientWidth / 1920;
    iframe.style.transform = `scale(${scale})`;
  });
}

window.addEventListener("resize", scalePreviews);
window.addEventListener("load", scalePreviews);
scalePreviews();
