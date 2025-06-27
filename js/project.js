const projects = [
  {
    title: "He He",
    image: "images/avatar.jpg",
    link: "https://example.com/project1",
  },
  {
    title: "Ho Ho",
    image: "images/bg.jpg",
    link: "https://example.com/project2",
  },
  {
    title: "Hi Hi",
    image: "images/profile.jpg",
    link: "https://example.com/project3",
  },
];

let currentSlide = 0;

function showSlide(index) {
  const projectImage = document.getElementById("project-image");
  const projectTitle = document.getElementById("project-title");
  const projectLink = document.getElementById("project-link");

  if (!projectImage || !projectTitle || !projectLink) return; // Nếu chưa load xong HTML

  const project = projects[index];
  projectImage.src = project.image;
  projectImage.alt = project.title;
  projectTitle.textContent = project.title;
  projectLink.href = project.link;
}

function changeSlide(direction) {
  currentSlide += direction;
  if (currentSlide >= projects.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = projects.length - 1;
  showSlide(currentSlide);
}

// Gọi lại khi section projects được load
document.addEventListener("DOMContentLoaded", () => {
  // Đợi DOM nội dung được thay đổi
  const observer = new MutationObserver(() => {
    const isProjectVisible = document.getElementById("project-image");
    if (isProjectVisible) {
      showSlide(currentSlide); // chỉ chạy nếu project đã hiện ra
      observer.disconnect();   // ngưng theo dõi
    }
  });

  observer.observe(document.getElementById("content"), {
    childList: true,
    subtree: true,
  });
});
