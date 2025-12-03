document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll("section.spot"));
  const bulges = document.querySelectorAll(".bulge");
  const labelCircle = document.getElementById("labelCircle");
  const labelText = document.getElementById("labelText");
  const barTrack = document.querySelector(".bar-track");
  const contentEl = document.querySelector(".content");
  const backToTopBtn = document.getElementById("backToTop");

  // 사이드 라벨이 이동할 위치 (각 섹션 인덱스별)
  const labelPositions = ["12%", "32%", "52%", "72%", "90%"];

  /* ================================
     1. 섹션 관찰 (색 변경 + 라벨 이동 + 원 강조)
     ================================ */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const idx = sections.indexOf(entry.target);
        if (idx === -1) return;

        const color = entry.target.dataset.color;
        const name = entry.target.dataset.name;

        // 전체 포인트 컬러 변경
        document.documentElement.style.setProperty("--accent-color", color);
        barTrack.style.background = color;
        labelCircle.style.background = color;

        // 라벨 위치 & 텍스트 변경
        labelCircle.style.top = labelPositions[idx];
        labelText.innerHTML = name;

        // 작은 원(active) 상태
        bulges.forEach((b, i) => {
          b.classList.toggle("active", i === idx);
        });

        // 섹션 등장 애니메이션
        entry.target.classList.add("visible");
      });
    },
    {
      threshold: 0.55,
      root: contentEl || null, // .content가 스크롤 컨테이너이면 root로 사용
    }
  );

  sections.forEach((sec) => observer.observe(sec));

  /* ================================
     2. 사이드 원 클릭 시 해당 섹션으로 스크롤
     ================================ */
  bulges.forEach((b) => {
    b.addEventListener("click", () => {
      const idx = parseInt(b.dataset.index, 10);
      const targetSection = sections[idx];
      if (!targetSection) return;

      if (contentEl && contentEl.scrollHeight > contentEl.clientHeight) {
        // 내부 스크롤 영역을 쓰는 경우
        const top = targetSection.offsetTop;
        contentEl.scrollTo({ top, behavior: "smooth" });
      } else {
        // 기본 윈도우 스크롤
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ================================
     3. 사진 슬라이더
     ================================ */
  const sliders = document.querySelectorAll(".photo-slider");

  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll("img");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    const dotsContainer = slider.querySelector(".slider-dots");

    if (!slides.length || !prevBtn || !nextBtn || !dotsContainer) return;

    let current = 0;

    // 점(dot) 생성
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "slider-dot" + (i === 0 ? " active" : "");
      dot.dataset.index = String(i);
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".slider-dot");

    function showSlide(n) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (n + slides.length) % slides.length;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    }

    prevBtn.addEventListener("click", () => showSlide(current - 1));
    nextBtn.addEventListener("click", () => showSlide(current + 1));

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = parseInt(dot.dataset.index, 10);
        showSlide(idx);
      });
    });
  });

  /* ================================
     4. TOP 버튼 보이기 / 숨기기
     ================================ */
  function updateTopBtn(scrollY) {
    if (!backToTopBtn) return;
    if (scrollY > 200) {
      backToTopBtn.style.display = "flex";
    } else {
      backToTopBtn.style.display = "none";
    }
  }

  if (contentEl && contentEl.scrollHeight > contentEl.clientHeight) {
    // .content가 실제로 스크롤된다면, 그 기준으로 체크
    contentEl.addEventListener("scroll", () => {
      updateTopBtn(contentEl.scrollTop);
    });
  }

  // 혹시 윈도우 자체 스크롤이 있는 경우도 함께 체크
  window.addEventListener("scroll", () => {
    updateTopBtn(window.scrollY);
  });

  /* TOP 버튼 클릭 시 맨 위로 */
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      if (contentEl && contentEl.scrollHeight > contentEl.clientHeight) {
        contentEl.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});
