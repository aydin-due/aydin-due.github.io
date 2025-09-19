const tabsContainer = document.getElementById("tabsContainer");
const cardContainer = document.getElementById("cardContainer");
let items = [];

async function loadItems() {
  try {
    const response = await fetch("assets/projects.json");
    if (!response.ok) throw new Error("Failed to load items.json");
    items = await response.json();
    createTabs();
    renderCards(getCategories()[0]); // render first category by default
  } catch (err) {
    console.error("Error loading items:", err);
    cardContainer.innerHTML = `<p>Could not load projects.</p>`;
  }
}

function getCategories() {
  return [...new Set(items.map((item) => item.category))];
}

function createTabs() {
  const categories = getCategories();
  tabsContainer.innerHTML = "";

  categories.forEach((category, i) => {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    tab.dataset.category = category;

    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderCards(category);
    });

    tabsContainer.appendChild(tab);
    if (i === 0) tab.classList.add("active");
  });
}

function renderCards(filter) {
  cardContainer.innerHTML = "";

  items
    .filter((item) => item.category === filter)
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const skills = item.skills
        .map(
          (skill) =>
            `<div class="social-link"><p>${
              skill.charAt(0).toUpperCase() + skill.slice(1)
            }</p></div>`
        )
        .join("");

      let mediaHtml;

      if (item.images.length === 1) {
        const imgSrc = item.images[0].startsWith("http")
          ? item.images[0]
          : `assets/${item.images[0]}`;
        mediaHtml = `<img src="${imgSrc}" class="single-image">`;
      } else {
        const slidesHtml = item.images
          .map(
            (img, index) => `
              <div class="slide ${index === 0 ? "active" : ""}">
                <img class="single-image" src="${img.startsWith("http") ? img : `assets/${img}`}">
              </div>`
          )
          .join("");

        mediaHtml = `
          <div class="slider">
            ${slidesHtml}
            <button class="prev">&#10094;</button>
            <button class="next">&#10095;</button>
          </div>
        `;
      }

      card.innerHTML = `
        ${mediaHtml}
        <div class="card-content">
          <h2>${item.name}</h2>
          <p>${item.description}</p>
          <div class="skills">${skills}</div>
          <button class="visitBtn" onclick="window.open('${item.url}', '_blank')">
            View project
          </button>
        </div>
      `;

      cardContainer.appendChild(card);

      if (item.images.length > 1) {
        initSlider(card.querySelector(".slider"));
      }
    });
}

function initSlider(slider) {
  const slides = slider.querySelectorAll(".slide");
  let currentIndex = 0;
  let autoSlideInterval;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  slider.querySelector(".prev").addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  slider.querySelector(".next").addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  startAutoSlide();

  let startX = 0;
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      nextSlide();
      resetAutoSlide();
    } else if (endX - startX > 50) {
      prevSlide();
      resetAutoSlide();
    }
  });
}

document.addEventListener("DOMContentLoaded", loadItems);

function downloadPDF() {
  var link = document.createElement("a");
  link.setAttribute("download", "aydin_cv.pdf");
  link.setAttribute("href", "assets/aydin_cv.pdf");
  link.click();
}
