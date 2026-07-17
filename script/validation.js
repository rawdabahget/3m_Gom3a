document.addEventListener("DOMContentLoaded", () => {
  // --- Helper Functions ---
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function clearErrors(container) {
    if (!container) return;
    const errorMsgs = container.querySelectorAll(".input-error-msg");
    errorMsgs.forEach((el) => el.remove());

    const errorInputs = container.querySelectorAll(".input-error");
    errorInputs.forEach((el) => el.classList.remove("input-error"));

    const statusMsg = container.querySelector(".form-status-msg");
    if (statusMsg) statusMsg.remove();
  }

  function showFieldError(inputEl, message) {
    if (!inputEl) return;
    inputEl.classList.add("input-error");

    const errDiv = document.createElement("div");
    errDiv.className = "input-error-msg";
    errDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${message}</span>`;

    if (inputEl.parentNode) {
      inputEl.parentNode.insertBefore(errDiv, inputEl.nextSibling);
    }
  }

  function showFormStatus(container, message, isSuccess) {
    if (!container) return;
    let statusDiv = container.querySelector(".form-status-msg");
    if (!statusDiv) {
      statusDiv = document.createElement("div");
      const submitBtn =
        container.querySelector("#signin-btn") ||
        container.querySelector("#signup-btn") ||
        container.querySelector("button");
      if (submitBtn && submitBtn.parentNode) {
        submitBtn.parentNode.insertBefore(statusDiv, submitBtn.nextSibling);
      } else {
        container.appendChild(statusDiv);
      }
    }
    statusDiv.className = `form-status-msg ${isSuccess ? "success" : "error"}`;
    const icon = isSuccess ? "fa-circle-check" : "fa-triangle-exclamation";
    statusDiv.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  }

  // --- Sign In Validation ---
  const signInBtn = document.getElementById("signin-btn");
  const signInForm = document.getElementById("signInForm");

  if (signInBtn && signInForm) {
    signInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearErrors(signInForm);

      const emailInput = document.getElementById("signin-email");
      const passwordInput = document.getElementById("signin-password");

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      let hasError = false;

      if (!email) {
        showFieldError(emailInput, "Please enter your email address.");
        hasError = true;
      } else if (!validateEmail(email)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        hasError = true;
      }

      if (!password) {
        showFieldError(passwordInput, "Please enter your password.");
        hasError = true;
      }

      if (hasError) {
        showFormStatus(
          signInForm,
          "Please correct the errors above to sign in.",
          false
        );
        return;
      }

      let users = [];
      try {
        users = JSON.parse(localStorage.getItem("fridayUsers")) || [];
      } catch (err) {
        users = [];
      }

      const matchedEmailUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!matchedEmailUser) {
        showFieldError(
          emailInput,
          users.length === 0
            ? "No account registered yet. Please click 'Sign up' to create an account first."
            : "No account found with this email address."
        );
        showFormStatus(
          signInForm,
          "Sign In failed: account not found.",
          false
        );
        return;
      }

      if (matchedEmailUser.password !== password) {
        showFieldError(passwordInput, "Incorrect password. Please try again.");
        showFormStatus(
          signInForm,
          "Sign In failed: incorrect password.",
          false
        );
        return;
      }

      showFormStatus(
        signInForm,
        `Sign In Successful! Welcome back, ${matchedEmailUser.name || "friend"}.`,
        true
      );

      setTimeout(() => {
        window.location.href = "Friday.html";
      }, 1100);
    });
  }

  // --- Sign Up Validation ---
  const signUpBtn = document.getElementById("signup-btn");
  const signUpForm = document.getElementById("signUpForm");

  if (signUpBtn && signUpForm) {
    signUpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearErrors(signUpForm);

      const nameInput = document.getElementById("signup-name");
      const emailInput = document.getElementById("signup-email");
      const passwordInput = document.getElementById("signup-password");
      const confirmInput = document.getElementById("signup-confirm");
      const termsInput = document.getElementById("signup-terms");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";
      const confirmPassword = confirmInput ? confirmInput.value.trim() : "";
      const termsChecked = termsInput ? termsInput.checked : false;

      let hasError = false;

      if (!name) {
        showFieldError(nameInput, "Please enter your full name.");
        hasError = true;
      }

      if (!email) {
        showFieldError(emailInput, "Please enter your email address.");
        hasError = true;
      } else if (!validateEmail(email)) {
        showFieldError(emailInput, "Please enter a valid email address.");
        hasError = true;
      }

      if (!password) {
        showFieldError(passwordInput, "Please enter a password.");
        hasError = true;
      } else if (password.length < 6) {
        showFieldError(passwordInput, "Password must be at least 6 characters.");
        hasError = true;
      }

      if (!confirmPassword) {
        showFieldError(confirmInput, "Please confirm your password.");
        hasError = true;
      } else if (password !== confirmPassword) {
        showFieldError(confirmInput, "Passwords do not match.");
        hasError = true;
      }

      if (!termsChecked) {
        const checkboxContainer = termsInput ? termsInput.closest(".checkbox") : null;
        showFieldError(
          checkboxContainer || termsInput,
          "You must agree to the Terms & Conditions."
        );
        hasError = true;
      }

      if (hasError) {
        showFormStatus(
          signUpForm,
          "Please fix the errors above to create your account.",
          false
        );
        return;
      }

      // Save registered account to localStorage
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem("fridayUsers")) || [];
      } catch (err) {
        users = [];
      }

      const existingIndex = users.findIndex(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existingIndex >= 0) {
        users[existingIndex] = { name, email, password };
      } else {
        users.push({ name, email, password });
      }
      localStorage.setItem("fridayUsers", JSON.stringify(users));

      // Auto-populate email on Sign In form for convenience
      const signinEmailInput = document.getElementById("signin-email");
      if (signinEmailInput) {
        signinEmailInput.value = email;
      }

      showFormStatus(
        signUpForm,
        "Sign Up Successful! Account created. Switching to Sign In...",
        true
      );

      setTimeout(() => {
        if (typeof log_in === "function") {
          log_in();
        }
      }, 1200);
    });
  }
});
