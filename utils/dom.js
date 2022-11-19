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

export { scrollToTop };
