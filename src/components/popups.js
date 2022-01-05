import Swal from "sweetalert2";
/**
 *
 * @param {string} type - the type of a message
 * @param {string} htmlType -a small message
 * @returns a popup notification
 */
const selectType = (type, htmlType) => {
  if (type === "success") {
    const html = `You can get your ${htmlType} in <b></b> milliseconds.`;
    return pop("Say Cheese!", "#32BA7C", html, `rgba(50, 186, 124,0.4)`);
  } else if (type === "message") {
    const html = ` ${htmlType} in <b></b> milliseconds.`;
    // return pop("Bye Bye!", "#32BA7C", html, `rgba(50, 186, 124,0.4)`);
    return pop("Say Cheese!", "#32BA7C", html, `rgba(50, 186, 124,0.4)`);
  } else if (type === "waiting") {
    const html = `Putting your ${htmlType} in <b></b> milliseconds.`;
    return pop(
      "Cooking your cookies...",
      "#F9D10B",
      html,
      `rgba(249, 209, 11,0.4)`
    );
  } else if (type === "invalid") {
    const html = `Error! ${htmlType}. Please try again in <b></b> milliseconds.`;
    return pop("There was an error.", "#FF0000", html, `rgba(255, 0, 0,0.4)`);
  } else if (type === "small") {
    const html = `Getting it done in <b></b> milliseconds.`;
    return pop1("Yay!", "#32BA7C", html, `rgba(50, 186, 124,0.4)`);
  } else {
    const html = `Please try again to get your ${htmlType} in <b></b> milliseconds.`;
    return pop("There was an error.", "#FF0000", html, `rgba(255, 0, 0,0.4)`);
  }
};
const pop1 = (title, textColor, html, backColor) => {
  let timerInterval;
  Swal.fire({
    title: title,
    width: 400,
    padding: "3em",
    color: textColor,
    backdrop: `
    ${backColor}
    left top
    no-repeat
    `,
    html: html,
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });
};
const pop = (title, textColor, html, backColor) => {
  let timerInterval;
  Swal.fire({
    title: title,
    width: 400,
    padding: "3em",
    color: textColor,
    backdrop: `
    ${backColor}
    left top
    no-repeat
    `,
    html: html,
    timer: 1000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });
};
export default selectType;
