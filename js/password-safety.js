document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const passwordInput = document.getElementById("passwordInput");
  const togglePassword = document.getElementById("togglePassword");
  const checkPasswordBtn = document.getElementById("checkPasswordBtn");
  const passwordResult = document.getElementById("passwordResult");

  const strengthFill = document.getElementById("strengthFill");
  const strengthLabel = document.getElementById("strengthLabel");

  const ruleLength = document.getElementById("rule-length");
  const ruleCase = document.getElementById("rule-case");
  const ruleNumber = document.getElementById("rule-number");
  const ruleSymbol = document.getElementById("rule-symbol");

  const generatePasswordBtn = document.getElementById("generatePassword");
  const generatedValue = document.getElementById("generatedValue");
  const copyPasswordBtn = document.getElementById("copyPassword");

  // Safety check: if any critical element is missing, stop
  if (!passwordInput || !strengthFill || !strengthLabel) {
    console.log("Password Safety: missing required elements.");
    return;
  }

  // Simple common password list (demo only)
  // Add more if you want
  const commonPasswords = new Set([
    "123456", "password", "123456789", "qwerty", "111111", "12345",
    "abc123", "password1", "123123", "admin", "letmein", "iloveyou",
    "welcome", "000000", "1234", "sunshine", "dragon", "football"
  ]);

  // ---------- Strength logic ----------
  function analyzePassword(pw) {
    const hasLength = pw.length >= 8;
    const hasMixed = /[a-z]/.test(pw) && /[A-Z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);

    let score = 0;

    // Score design tuned for your UI
    if (pw.length > 0) score += 10;
    if (hasLength) score += 25;
    if (pw.length >= 12) score += 15;
    if (hasMixed) score += 20;
    if (hasNumber) score += 15;
    if (hasSymbol) score += 15;

    score = Math.min(score, 100);

    let label = "—";
    let cls = "";

    if (!pw) {
      label = "—";
      cls = "";
    } else if (score < 35) {
      label = "Weak";
      cls = "weak";
    } else if (score < 60) {
      label = "Medium";
      cls = "medium";
    } else if (score < 85) {
      label = "Strong";
      cls = "strong";
    } else {
      label = "Very Strong";
      cls = "very-strong";
    }

    return { score, label, cls, hasLength, hasMixed, hasNumber, hasSymbol };
  }

  function setRule(el, ok) {
    if (!el) return;
    el.classList.toggle("ok", ok);
  }

  function updateStrengthUI() {
    const pw = passwordInput.value;
    const res = analyzePassword(pw);

    // Update label
    strengthLabel.textContent = res.label;

    // Update rules
    setRule(ruleLength, res.hasLength);
    setRule(ruleCase, res.hasMixed);
    setRule(ruleNumber, res.hasNumber);
    setRule(ruleSymbol, res.hasSymbol);

    // Update animated bar
    strengthFill.classList.remove("weak", "medium", "strong", "very-strong");
    if (res.cls) strengthFill.classList.add(res.cls);
    strengthFill.style.width = `${res.score}%`;
  }

  // Live update while typing
  passwordInput.addEventListener("input", updateStrengthUI);

  // ---------- Toggle show/hide password ----------
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const icon = togglePassword.querySelector("i");
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";

      // swap icon
      if (icon) {
        icon.classList.toggle("fa-eye", !isHidden);
        icon.classList.toggle("fa-eye-slash", isHidden);
      }
    });
  }

  // ---------- Step 3: Check Password button ----------
  function showResult(type, title, message) {
    // type: "good" | "bad"
    passwordResult.classList.remove("hidden", "good", "bad");
    passwordResult.classList.add(type === "good" ? "good" : "bad");

    const icon = type === "good"
      ? `<i class="fa-solid fa-shield-check"></i>`
      : `<i class="fa-solid fa-triangle-exclamation"></i>`;

    passwordResult.innerHTML = `
      <div class="result-head">
        <div class="result-icon">${icon}</div>
        <div>
          <div class="result-title">${title}</div>
          <div class="result-text">${message}</div>
        </div>
      </div>
    `;
  }

  if (checkPasswordBtn) {
    checkPasswordBtn.addEventListener("click", () => {
      const pw = passwordInput.value.trim();
      if (!pw) {
        showResult("bad", "Enter a password", "Type a password first, then click check.");
        return;
      }

      const { score } = analyzePassword(pw);

      // "Pwned" simulation rule:
      // - very common passwords OR too short OR weak score
      const isCommon = commonPasswords.has(pw.toLowerCase());
      const isTooShort = pw.length < 8;
      const isWeak = score < 35;

      if (isCommon || isTooShort || isWeak) {
        showResult(
          "bad",
          "Pwned!",
          "This password is commonly used or too weak. It could be guessed quickly. Use a longer, more unique password with mixed characters."
        );
      } else {
        showResult(
          "good",
          "Not Found!",
          "This password isn’t in our common passwords list. Still, use a unique password for every account."
        );
      }
    });
  }

  // ---------- Password Generator ----------
  function generateStrongPassword(length = 14) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const syms = "!@#$%^&*()-_=+[]{};:,.?/";

    // Ensure at least one of each
    const pick = (s) => s[Math.floor(Math.random() * s.length)];
    let out = [
      pick(upper),
      pick(lower),
      pick(nums),
      pick(syms)
    ];

    const all = upper + lower + nums + syms;
    while (out.length < length) out.push(pick(all));

    // Shuffle
    out = out.sort(() => Math.random() - 0.5);
    return out.join("");
  }

  if (generatePasswordBtn) {
    generatePasswordBtn.addEventListener("click", () => {
      const pw = generateStrongPassword(14);
      generatedValue.textContent = pw;

      // Also update input + strength UI nicely
      passwordInput.value = pw;
      updateStrengthUI();

      // Hide old result box (optional)
      passwordResult.classList.add("hidden");
    });
  }

  // ---------- Copy password ----------
  if (copyPasswordBtn) {
    copyPasswordBtn.addEventListener("click", async () => {
      const text = generatedValue.textContent.trim();
      if (!text || text === "—") return;

      try {
        await navigator.clipboard.writeText(text);
        copyPasswordBtn.classList.add("copied");
        setTimeout(() => copyPasswordBtn.classList.remove("copied"), 800);
      } catch (e) {
        console.log("Copy failed:", e);
      }
    });
  }

  // Run once on load (in case browser autofills)
  updateStrengthUI();
});
