const login = document.getElementById("signInForm");
const sign_up = document.getElementById("signUpForm");

login.classList.add("disable");

async function log_in() {
  const slideout = sign_up.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 250,
  });
  await slideout.finished;

  sign_up.classList.add("disable");
  login.classList.remove("disable");

  const slidein = login.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 250,
  });
  await slidein.finished;
}

async function signup() {
  const slideout = login.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 250,
  });
  await slideout.finished;

  login.classList.add("disable");
  sign_up.classList.remove("disable");

  const slidein = sign_up.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 250,
  });
  await slidein.finished;
}
