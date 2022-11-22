import { isWindowPresent } from "./checkDom";

const scrollToTop = ({ isFeedPage = false }) => {
  let top = 0;
  if (isWindowPresent()) {
    // Feed page
    if (isFeedPage) {
      const elem = document.querySelector("#postConfessionCont");
      top = elem.clientHeight;
    }

    window.scrollTo({
      behavior: "smooth",
      top,
    });
  }
};

const scrollDetails = {
  setScrollDetails({ scrollPosition, pageName }) {
    if (isWindowPresent())
      localStorage.setItem(
        "scrollDetails",
        JSON.stringify({
          scrollPosition: scrollPosition ?? 0,
          pageName: pageName ?? "",
        })
      );
  },
  getScrollDetails() {
    if (isWindowPresent()) {
      const scrollDetails = localStorage.getItem("scrollDetails") ?? "{}";
      return JSON.parse(scrollDetails);
    }
  },
};

export { scrollToTop, scrollDetails };
