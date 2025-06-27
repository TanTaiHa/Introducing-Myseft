const sections = ["home", "about", "skills", "projects", "contact"];
let currentIndex = 0;
let isScrolling = false;
const scrollCooldown = 800;
const scrollThreshold = 50;

// Toggle popup menu
function toggleMenu() {
  const menu = document.getElementById("popup-menu");
  const icon = document.getElementById("menu-icon");
  const isActive = menu.classList.contains("active");

  if (isActive) {
    menu.classList.remove("active");
    icon.textContent = "☰";
    document.body.classList.remove("menu-open"); // remove class khi đóng
  } else {
    menu.classList.add("active");
    icon.textContent = "✕";
    document.body.classList.add("menu-open"); //  add class khi mở
  }
}


// Load section with slide animation
function loadSection(sectionName, direction = "down") {
  const content = document.getElementById("content");

  // Slide-out effect
  content.classList.add(direction === "down" ? "slide-out-up" : "slide-out-down");

  setTimeout(() => {
    fetch(`pages/${sectionName}.html`)
      .then((res) => {
        if (!res.ok) throw new Error("Page not found");
        return res.text();
      })
      .then((data) => {
        content.innerHTML = data;

        // Update currentIndex to ensure sync
        const index = sections.indexOf(sectionName);
        if (index !== -1) currentIndex = index;

        // Container logic
        // 👇 Thêm hoặc xóa class container tùy trang
        if (sectionName === "home" || sectionName === "projects") {
  content.classList.remove("container");
} else {
  content.classList.add("container");
}

        const sectionElement = content.querySelector("section");
        if (sectionElement) {
          sectionElement.classList.add("active");
        }

        // Close popup menu if open
        const menu = document.getElementById("popup-menu");
        if (menu.classList.contains("active")) toggleMenu();

        // Setup Explore More button
        setupExploreButton();

        // Show/hide Explore More button
        const exploreBtn = document.getElementById("explore-btn");
        if (exploreBtn) {
          exploreBtn.style.display = sectionName === "contact" ? "none" : "flex";
        }
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        content.innerHTML = "<p>Failed to load section.</p>";
      })
      .finally(() => {
        content.classList.remove("slide-out-up", "slide-out-down");
        content.classList.add(direction === "down" ? "slide-in-up" : "slide-in-down");
        setTimeout(() => {
          content.classList.remove("slide-in-up", "slide-in-down");
        }, 300);
      });
  }, 300);
}

// Scroll handling
function handleScroll(e) {
  if (isScrolling || Math.abs(e.deltaY) < scrollThreshold) return;

  const direction = e.deltaY > 0 ? "down" : "up";
  const nextIndex = currentIndex + (direction === "down" ? 1 : -1);

  if (nextIndex < 0 || nextIndex >= sections.length) return;

  isScrolling = true;
  currentIndex = nextIndex;
  loadSection(sections[currentIndex], direction);

  setTimeout(() => {
    isScrolling = false;
  }, scrollCooldown);
}

// Explore More button
function setupExploreButton() {
  const exploreBtn = document.getElementById("explore-btn");
  if (exploreBtn) {
    const newBtn = exploreBtn.cloneNode(true);
    exploreBtn.parentNode.replaceChild(newBtn, exploreBtn);

    newBtn.addEventListener("click", () => {
      if (currentIndex < sections.length - 1) {
        currentIndex++;
        loadSection(sections[currentIndex], "down");
      }
    });
  }
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  loadSection(sections[currentIndex]);

  const toggleBtn = document.getElementById("menu-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleMenu);
  }

  document.querySelectorAll("[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = e.currentTarget.getAttribute("data-section");
      const index = sections.indexOf(section);
      if (index !== -1 && index !== currentIndex) {
        const direction = index > currentIndex ? "down" : "up";
        currentIndex = index;
        loadSection(section, direction);
      }
    });
  });

  window.addEventListener("wheel", handleScroll, { passive: false });
});
