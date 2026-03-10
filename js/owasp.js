document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // ACCORDION TOGGLE
  // =========================
  const cards = document.querySelectorAll(".owasp-vuln-card");

  cards.forEach(card => {
    const toggleBtn = card.querySelector(".vuln-toggle");

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCard(card);
    });

    card.addEventListener("click", (e) => {
      if (e.target.closest(".vuln-details")) return;
      if (e.target.closest("a")) return;
      if (e.target.closest(".sim-panel")) return;
      if (e.target.closest(".sim-start-btn")) return;
      toggleCard(card);
    });
  });

  function toggleCard(card) {
    const isExpanded = card.classList.contains("expanded");
    if (isExpanded) {
      card.classList.remove("expanded");
    } else {
      card.classList.add("expanded");
      setTimeout(() => {
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }

  // Keyboard
  cards.forEach(card => {
    const toggleBtn = card.querySelector(".vuln-toggle");
    toggleBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard(card);
      }
    });
  });

  // =========================
  // BROKEN ACCESS CONTROL SIMULATION
  // =========================
  const startSimBtn = document.getElementById("startSimBtn");
  const simPanel = document.getElementById("simPanel");
  const simScreen = document.getElementById("simScreen");
  const simUrlText = document.getElementById("simUrlText");
  const simLock = document.getElementById("simLock");
  const simNarration = document.getElementById("simNarration");
  const simStepLabel = document.getElementById("simStepLabel");
  const simNarratorIcon = document.getElementById("simNarratorIcon");
  const simNarrationBox = document.querySelector(".sim-narration");
  const simNextBtn = document.getElementById("simNextBtn");
  const simResetBtn = document.getElementById("simResetBtn");
  const simProgress = document.getElementById("simProgress");

  if (!startSimBtn) return;

  let simStep = 0;
  const totalSteps = 6;

  // Build progress dots
  for (let i = 0; i < totalSteps; i++) {
    const dot = document.createElement("div");
    dot.className = "sim-dot";
    simProgress.appendChild(dot);
  }

  function updateDots() {
    const dots = simProgress.querySelectorAll(".sim-dot");
    dots.forEach((dot, i) => {
      dot.classList.remove("active", "done");
      if (i === simStep) dot.classList.add("active");
      else if (i < simStep) dot.classList.add("done");
    });
  }

  function setNarration(step, text, mode) {
    simStepLabel.textContent = `Step ${step + 1} of ${totalSteps}`;
    simNarration.textContent = text;
    simNarrationBox.classList.remove("attack-mode", "fix-mode");
    if (mode === "attack") simNarrationBox.classList.add("attack-mode");
    if (mode === "fix") simNarrationBox.classList.add("fix-mode");

    const iconI = simNarratorIcon.querySelector("i");
    if (mode === "attack") {
      iconI.className = "fa-solid fa-skull-crossbones";
    } else if (mode === "fix") {
      iconI.className = "fa-solid fa-shield-halved";
    } else {
      iconI.className = "fa-solid fa-user-shield";
    }
  }

  function typeUrl(url, callback) {
    simUrlText.innerHTML = "";
    let i = 0;
    const span = document.createElement("span");
    span.className = "typing-cursor";
    simUrlText.appendChild(span);

    const interval = setInterval(() => {
      span.textContent = url.substring(0, i + 1);
      i++;
      if (i >= url.length) {
        clearInterval(interval);
        span.classList.remove("typing-cursor");
        // Apply coloring after typing
        if (callback) setTimeout(callback, 200);
      }
    }, 35);
  }

  // ---- STEP RENDERERS ----

  function renderStep0() {
    // Normal user viewing their own profile
    simLock.className = "fa-solid fa-lock";
    simLock.classList.remove("danger");
    simUrlText.innerHTML = 'https://bank.example.com/account?<span class="url-highlight">id=1001</span>';

    simScreen.innerHTML = `
      <div class="screen-dashboard">
        <div class="dash-header">
          <h4>🏦 SecureBank Dashboard</h4>
          <div class="dash-user">
            <div class="avatar blue"><i class="fa-solid fa-user"></i></div>
            Alice Johnson (You)
          </div>
        </div>
        <div class="dash-cards">
          <div class="dash-card">
            <div class="label">Checking Account</div>
            <div class="value green">$4,285.50</div>
          </div>
          <div class="dash-card">
            <div class="label">Savings Account</div>
            <div class="value blue">$12,750.00</div>
          </div>
        </div>
        <table class="dash-table">
          <tr><th>Date</th><th>Description</th><th>Amount</th></tr>
          <tr><td>Mar 5</td><td>Grocery Store</td><td>-$67.30</td></tr>
          <tr><td>Mar 3</td><td>Salary Deposit</td><td>+$3,200.00</td></tr>
          <tr><td>Mar 1</td><td>Electric Bill</td><td>-$142.00</td></tr>
        </table>
      </div>
    `;

    setNarration(0, "Alice logs into her bank account normally. Notice the URL contains her account ID: id=1001. Everything looks fine — she sees her own financial data.", "normal");
  }

  function renderStep1() {
    // Attacker notices the URL parameter
    simUrlText.innerHTML = 'https://bank.example.com/account?<span class="url-highlight" style="background:rgba(251,191,36,0.15);padding:2px 4px;border-radius:3px;">id=1001</span>';

    setNarration(1, "An attacker (or curious user) notices the 'id=1001' parameter in the URL. They wonder: what happens if I change this number? The ID is clearly predictable — it's just a sequential number.", "attack");
  }

  function renderStep2() {
    // Attacker changes URL
    simLock.className = "fa-solid fa-lock-open danger";

    typeUrl("https://bank.example.com/account?id=1002", () => {
      simUrlText.innerHTML = 'https://bank.example.com/account?<span class="url-attack">id=1002</span>';
    });

    setNarration(2, "The attacker manually changes the URL from id=1001 to id=1002 — attempting to access someone else's account. This is called an Insecure Direct Object Reference (IDOR).", "attack");
  }

  function renderStep3() {
    // Server returns another user's data — NO ACCESS CHECK!
    simUrlText.innerHTML = 'https://bank.example.com/account?<span class="url-attack">id=1002</span>';

    simScreen.innerHTML = `
      <div class="screen-dashboard">
        <div class="dash-header">
          <h4>🏦 SecureBank Dashboard</h4>
          <div class="dash-user">
            <div class="avatar red"><i class="fa-solid fa-user-secret"></i></div>
            <span style="color:#ef4444;font-weight:700;">Bob Smith's Account!</span>
          </div>
        </div>
        <div class="dash-cards">
          <div class="dash-card">
            <div class="label">Checking Account</div>
            <div class="value green">$89,420.00</div>
          </div>
          <div class="dash-card">
            <div class="label">Savings Account</div>
            <div class="value blue">$245,000.00</div>
          </div>
        </div>
        <table class="dash-table">
          <tr><th>Date</th><th>Description</th><th>Amount</th></tr>
          <tr class="highlight-row"><td><span class="sensitive">Mar 5</span></td><td><span class="sensitive">Wire Transfer — Offshore</span></td><td><span class="sensitive">-$50,000.00</span></td></tr>
          <tr><td>Mar 4</td><td>Investment Deposit</td><td>+$15,000.00</td></tr>
          <tr><td>Mar 2</td><td>Luxury Auto Payment</td><td>-$2,800.00</td></tr>
        </table>
      </div>
        <div class="attack-banner">
        <i class="fa-solid fa-triangle-exclamation"></i> UNAUTHORIZED ACCESS — Another user's data exposed!
      </div>
    `;

    setNarration(3, "The server returns Bob Smith's private financial data! Because the server didn't verify that Alice is authorized to view account 1002, the attacker now sees Bob's balances, transactions, and sensitive information.", "attack");
  }

  function renderStep4() {
    simLock.className = "fa-solid fa-lock";
    simLock.classList.remove("danger");

    typeUrl("https://bank.example.com/account?id=1002", () => {
      simUrlText.innerHTML = 'https://bank.example.com/account?<span class="url-attack">id=1002</span>';
    });

    simScreen.innerHTML = `
      <div class="screen-denied">
        <div class="denied-icon"><i class="fa-solid fa-ban"></i></div>
        <div class="denied-title">403 — Access Denied</div>
        <div class="denied-text">You do not have permission to view this account. This incident has been logged.</div>
        <div class="denied-code">
          <span style="color:#64748b;">// Server-side check:</span><br>
          <span style="color:#22c55e;">if</span> (request.user.id <span style="color:#ef4444;">!==</span> account.owner_id) {<br>
          &nbsp;&nbsp;<span style="color:#ef4444;">deny(403,</span> <span style="color:#fbbf24;">"Unauthorized"</span><span style="color:#ef4444;">);</span><br>
          &nbsp;&nbsp;<span style="color:#38bdf8;">log.warn(</span><span style="color:#fbbf24;">"IDOR attempt"</span>, request.user<span style="color:#38bdf8;">);</span><br>
          }
        </div>
      </div>
      <div class="fix-banner">
        <i class="fa-solid fa-shield-halved"></i> ACCESS BLOCKED — Server-side validation working!
      </div>
    `;

    setNarration(4, "With proper access control, the server checks: does the logged-in user OWN this account? Since Alice (id=1001) doesn't own account 1002, the server returns 403 Forbidden and logs the suspicious attempt.", "fix");
  }

  function renderStep5() {
    // Summary
    simScreen.innerHTML = `
      <div style="padding:10px 0;">
        <h4 style="font-size:16px;color:#f1f5f9;margin-bottom:16px;"><i class="fa-solid fa-graduation-cap" style="color:#fbbf24;margin-right:8px;"></i> Key Takeaways</h4>
        
        <div style="display:flex;gap:12px;margin-bottom:12px;">
          <div style="flex:1;padding:14px;border-radius:10px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);">
            <div style="font-size:12px;color:#ef4444;font-weight:700;margin-bottom:6px;"><i class="fa-solid fa-xmark"></i> Vulnerable</div>
            <div style="font-size:12px;color:#94a3b8;line-height:1.5;">Server blindly returns data based on the URL parameter without checking who's asking.</div>
          </div>
          <div style="flex:1;padding:14px;border-radius:10px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);">
            <div style="font-size:12px;color:#22c55e;font-weight:700;margin-bottom:6px;"><i class="fa-solid fa-check"></i> Secure</div>
            <div style="font-size:12px;color:#94a3b8;line-height:1.5;">Server verifies the requesting user owns the resource before returning any data.</div>
          </div>
        </div>

        <div style="padding:14px;border-radius:10px;background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.15);">
          <div style="font-size:12px;color:#fbbf24;font-weight:700;margin-bottom:6px;"><i class="fa-solid fa-lightbulb"></i> Remember</div>
          <div style="font-size:12px;color:#94a3b8;line-height:1.6;">
            Never trust client-side data. Always verify authorization server-side. Use indirect references (UUIDs) instead of sequential IDs. Implement Role-Based Access Control (RBAC). Log all access control failures.
          </div>
        </div>
      </div>
    `;

    simUrlText.innerHTML = 'https://bank.example.com/account';
    simLock.className = "fa-solid fa-lock";
    simLock.classList.remove("danger");
    simNextBtn.disabled = false;
    simNextBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Restart Simulation';
    simNextBtn.dataset.restart = "true";

    setNarration(5, "That's how Broken Access Control works — and how to prevent it. The fix is simple but critical: always verify authorization on the server side, never trust client-supplied parameters, and log all suspicious access attempts.", "fix");
  }

  // ---- STEP CONTROLLER ----

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  function goToStep(step) {
    simStep = step;
    updateDots();

    // Transition effect
    simScreen.classList.add("transitioning");
    setTimeout(() => {
      stepRenderers[step]();
      simScreen.classList.remove("transitioning");
    }, 200);
  }

  // ---- EVENT LISTENERS ----

  startSimBtn.addEventListener("click", () => {
    simPanel.classList.add("active");
    startSimBtn.style.display = "none";
    simStep = 0;
    simNextBtn.disabled = false;
    simNextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
    goToStep(0);

    setTimeout(() => {
      simPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  });

  simNextBtn.addEventListener("click", () => {
    if (simStep < totalSteps - 1) {
      goToStep(simStep + 1);
    }
  });
simNextBtn.addEventListener("click", () => {
    if (simNextBtn.dataset.restart === "true") {
      // Go back to Launch Simulation button
      simNextBtn.dataset.restart = "false";
      simNextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
      simPanel.classList.remove("active");
      startSimBtn.style.display = "";
      simStep = 0;
      updateDots();
      return;
    }
    if (simStep < totalSteps - 1) {
      goToStep(simStep + 1);
    }
  });

  simResetBtn.addEventListener("click", () => {
    simStep = 0;
    simNextBtn.disabled = false;
    simNextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
    goToStep(0);
  });

  // =========================
  // CRYPTOGRAPHIC FAILURES SIMULATION
  // =========================
  const startCryptoSim = document.getElementById("startCryptoSim");
  const cryptoSimPanel = document.getElementById("cryptoSimPanel");
  const cryptoNetwork = document.getElementById("cryptoNetwork");
  const cryptoUser = document.getElementById("cryptoUser");
  const cryptoAttacker = document.getElementById("cryptoAttacker");
  const cryptoServer = document.getElementById("cryptoServer");
  const cryptoLine = document.getElementById("cryptoLine");
  const cryptoPacket = document.getElementById("cryptoPacket");
  const cryptoProtocol = document.getElementById("cryptoProtocol");
  const cryptoDataDisplay = document.getElementById("cryptoDataDisplay");
  const dataSentBody = document.getElementById("dataSentBody");
  const dataInterceptedBody = document.getElementById("dataInterceptedBody");
  const dataSent = document.getElementById("dataSent");
  const dataIntercepted = document.getElementById("dataIntercepted");
  const cryptoNarration = document.getElementById("cryptoNarration");
  const cryptoStepLabel = document.getElementById("cryptoStepLabel");
  const cryptoNarratorIcon = document.getElementById("cryptoNarratorIcon");
  const cryptoNarrationBox = document.getElementById("cryptoNarrationBox");
  const cryptoNextBtn = document.getElementById("cryptoNextBtn");
  const cryptoResetBtn = document.getElementById("cryptoResetBtn");
  const cryptoProgress = document.getElementById("cryptoProgress");

  if (!startCryptoSim) return;

  let cryptoStep = 0;
  const cryptoTotalSteps = 7;

  // Build dots
  for (let i = 0; i < cryptoTotalSteps; i++) {
    const dot = document.createElement("div");
    dot.className = "sim-dot";
    cryptoProgress.appendChild(dot);
  }

  function updateCryptoDots() {
    const dots = cryptoProgress.querySelectorAll(".sim-dot");
    dots.forEach((dot, i) => {
      dot.classList.remove("active", "done");
      if (i === cryptoStep) dot.classList.add("active");
      else if (i < cryptoStep) dot.classList.add("done");
    });
  }

  function setCryptoNarration(step, text, mode) {
    cryptoStepLabel.textContent = `Step ${step + 1} of ${cryptoTotalSteps}`;
    cryptoNarration.textContent = text;
    cryptoNarrationBox.classList.remove("attack-mode", "fix-mode");
    if (mode === "attack") cryptoNarrationBox.classList.add("attack-mode");
    if (mode === "fix") cryptoNarrationBox.classList.add("fix-mode");

    const iconI = cryptoNarratorIcon.querySelector("i");
    if (mode === "attack") iconI.className = "fa-solid fa-skull-crossbones";
    else if (mode === "fix") iconI.className = "fa-solid fa-shield-halved";
    else iconI.className = "fa-solid fa-user-shield";
  }

  function resetCryptoNetwork() {
    cryptoNetwork.classList.remove("attack-mode", "secure-mode");
    cryptoLine.classList.remove("danger", "secure");
    cryptoPacket.className = "net-packet";
    cryptoProtocol.className = "net-protocol";
    cryptoProtocol.textContent = "HTTP";
    cryptoAttacker.classList.add("hidden");
    cryptoAttacker.classList.remove("visible");
    dataSent.className = "data-panel";
    dataIntercepted.className = "data-panel";
    dataSentBody.innerHTML = '<span class="data-placeholder">Waiting...</span>';
    dataInterceptedBody.innerHTML = '<span class="data-placeholder">Waiting...</span>';
  }

  // Scramble effect for encryption
  function scrambleText(element, finalText, duration, className) {
    const chars = "█▓▒░╔╗╚╝║═╬╣╠┃━┏┓┗┛aAbBcCdD0123456789!@#$%";
    const steps = 12;
    const interval = duration / steps;
    let count = 0;

    const timer = setInterval(() => {
      let scrambled = "";
      for (let i = 0; i < finalText.length; i++) {
        if (count > steps * (i / finalText.length)) {
          scrambled += finalText[i];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      element.innerHTML = `<span class="${className}">${scrambled}</span>`;
      count++;
      if (count > steps) {
        clearInterval(timer);
        element.innerHTML = `<span class="${className}">${finalText}</span>`;
      }
    }, interval);
  }

  // ---- STEPS ----

  function cryptoStep0() {
    resetCryptoNetwork();
    cryptoProtocol.textContent = "HTTP";
    cryptoProtocol.className = "net-protocol";

    dataSentBody.innerHTML = `
      <span class="data-field"><span class="data-label">username: </span><span class="data-value">alice@email.com</span></span>
      <span class="data-field"><span class="data-label">password: </span><span class="data-value">MyS3cur3Pass!</span></span>
      <span class="data-field"><span class="data-label">card:     </span><span class="data-value">4532-XXXX-XXXX-8901</span></span>
    `;

    dataInterceptedBody.innerHTML = '<span class="data-placeholder">No attacker yet...</span>';

    setCryptoNarration(0, "Alice is logging into her bank account. The website uses HTTP (unencrypted). Her login credentials and credit card data are about to be sent across the network in plain text.", "normal");
  }

  function cryptoStep1() {
    // Show data being sent in plain text
    cryptoPacket.className = "net-packet sending";
    cryptoLine.classList.add("danger");

    setCryptoNarration(1, "Alice clicks 'Login' and her data travels across the network. Because the connection uses HTTP (not HTTPS), the data is sent as plain, readable text — like writing your password on a postcard.", "attack");
  }

  function cryptoStep2() {
    // Attacker appears
    cryptoAttacker.classList.remove("hidden");
    cryptoAttacker.classList.add("visible");
    cryptoNetwork.classList.add("attack-mode");
    cryptoPacket.className = "net-packet intercepted";

    setCryptoNarration(2, "An attacker on the same network (like public WiFi) intercepts the traffic using a tool like Wireshark. Since the data is unencrypted, they can read EVERYTHING — this is a Man-in-the-Middle attack.", "attack");
  }

  function cryptoStep3() {
    // Show intercepted data
    dataSent.classList.add("danger");
    dataIntercepted.classList.add("danger");

    dataInterceptedBody.innerHTML = `
      <span class="data-field"><span class="data-label">username: </span><span class="data-value exposed">alice@email.com</span></span>
      <span class="data-field"><span class="data-label">password: </span><span class="data-value exposed">MyS3cur3Pass!</span></span>
      <span class="data-field"><span class="data-label">card:     </span><span class="data-value exposed">4532-7891-2345-8901</span></span>
      <span class="data-field"><span class="data-label">cvv:      </span><span class="data-value exposed">847</span></span>
    `;

    setCryptoNarration(3, "The attacker now has Alice's full credentials, credit card number, and CVV — all in plain text. They can log into her account, steal money, or sell her data on the dark web. This is exactly what Cryptographic Failure means.", "attack");
  }

  function cryptoStep4() {
    // Switch to HTTPS
    resetCryptoNetwork();
    cryptoProtocol.textContent = "HTTPS (TLS 1.3)";
    cryptoProtocol.className = "net-protocol secure";
    cryptoLine.classList.add("secure");
    cryptoNetwork.classList.remove("attack-mode");
    cryptoNetwork.classList.add("secure-mode");

    // Change user icon to secured
    cryptoUser.querySelector(".net-node-icon").classList.add("secure");
    cryptoUser.querySelector(".net-node-icon").classList.remove("attacker");

    dataSentBody.innerHTML = `
      <span class="data-field"><span class="data-label">username: </span><span class="data-value">alice@email.com</span></span>
      <span class="data-field"><span class="data-label">password: </span><span class="data-value">MyS3cur3Pass!</span></span>
      <span class="data-field"><span class="data-label">card:     </span><span class="data-value">4532-XXXX-XXXX-8901</span></span>
    `;

    dataSent.className = "data-panel safe";
    dataIntercepted.className = "data-panel";
    dataInterceptedBody.innerHTML = '<span class="data-placeholder">Waiting to intercept...</span>';

    setCryptoNarration(4, "Now the same website uses HTTPS with TLS 1.3 encryption. Alice sends the exact same data — but this time it's encrypted before leaving her browser. Let's see what happens when the attacker tries to intercept it.", "fix");
  }

  function cryptoStep5() {
    // Send encrypted packet
    cryptoPacket.className = "net-packet sending-secure";
    cryptoAttacker.classList.remove("hidden");
    cryptoAttacker.classList.add("visible");

    // Show encrypted data with scramble effect
    setTimeout(() => {
      cryptoPacket.className = "net-packet intercepted";
      dataIntercepted.className = "data-panel safe";

      scrambleText(dataInterceptedBody,
        "aGVsbG8gd29ybGQ=\nx7f2a9b3c1d4e5f6\n0x8A2B...F9E1C3D7\n[TLS_AES_256_GCM]",
        600, "data-value encrypted");
    }, 1600);

    setCryptoNarration(5, "The attacker intercepts the traffic again — but this time all they see is encrypted gibberish! TLS encryption has scrambled the data into unreadable ciphertext. Without the encryption key, the data is completely useless.", "fix");
  }

  function cryptoStep6() {
    // Summary
    cryptoNetwork.classList.remove("attack-mode");
    cryptoNetwork.classList.add("secure-mode");
    cryptoAttacker.classList.add("hidden");
    cryptoAttacker.classList.remove("visible");

    document.getElementById("cryptoDataDisplay").innerHTML = `
      <div class="crypto-summary">
        <div class="crypto-summary-card bad">
          <h5><i class="fa-solid fa-xmark"></i> Without Encryption (HTTP)</h5>
          <p>Data sent in plain text. Anyone on the network can read passwords, cards, and personal info.</p>
          <code>POST /login HTTP/1.1\nusername=alice&password=MyS3cur3Pass!</code>
        </div>
        <div class="crypto-summary-card good">
          <h5><i class="fa-solid fa-check"></i> With Encryption (HTTPS)</h5>
          <p>Data encrypted with TLS. Even if intercepted, attackers see only unreadable ciphertext.</p>
          <code>17 03 03 00 1C 0A 2B 7F\nD4 E5 91 C3 A8 B2 F6 00\n[AES-256-GCM encrypted]</code>
        </div>
      </div>
      <div class="crypto-takeaway">
        <strong><i class="fa-solid fa-lightbulb"></i> Key Takeaways</strong>
        Always use HTTPS (TLS 1.3) for all connections. Store passwords with bcrypt/Argon2, never plain text or MD5. Enforce HSTS headers to prevent protocol downgrade attacks. Encrypt sensitive data at rest AND in transit.
      </div>
    `;

    cryptoNextBtn.disabled = false;
    cryptoNextBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Restart Simulation';
    cryptoNextBtn.dataset.restart = "true";

    setCryptoNarration(6, "That's how Cryptographic Failures work. The difference between HTTP and HTTPS is the difference between shouting your password in a crowded room and whispering it through an encrypted tunnel. Always encrypt sensitive data — in transit AND at rest.", "fix");
  }

  // ---- CONTROLLER ----
  const cryptoStepRenderers = [cryptoStep0, cryptoStep1, cryptoStep2, cryptoStep3, cryptoStep4, cryptoStep5, cryptoStep6];

  function goToCryptoStep(step) {
    cryptoStep = step;
    updateCryptoDots();
    cryptoStepRenderers[step]();
  }

  // ---- EVENTS ----
  startCryptoSim.addEventListener("click", () => {
    cryptoSimPanel.classList.add("active");
    startCryptoSim.style.display = "none";
    cryptoStep = 0;
    cryptoNextBtn.disabled = false;
    cryptoNextBtn.dataset.restart = "false";
    cryptoNextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
    resetCryptoNetwork();
    goToCryptoStep(0);

    setTimeout(() => {
      cryptoSimPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  });

  cryptoNextBtn.addEventListener("click", () => {
    if (cryptoNextBtn.dataset.restart === "true") {
      cryptoNextBtn.dataset.restart = "false";
      cryptoNextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
      cryptoSimPanel.classList.remove("active");
      startCryptoSim.style.display = "";
      cryptoStep = 0;
      resetCryptoNetwork();
      updateCryptoDots();

      // Rebuild data display panels (they get replaced in step 6)
      document.getElementById("cryptoDataDisplay").innerHTML = `
        <div class="data-panel" id="dataSent">
          <div class="data-panel-header"><i class="fa-solid fa-paper-plane"></i> Data Being Sent</div>
          <div class="data-panel-body" id="dataSentBody"><span class="data-placeholder">Waiting...</span></div>
        </div>
        <div class="data-panel" id="dataIntercepted">
          <div class="data-panel-header"><i class="fa-solid fa-eye"></i> What Attacker Sees</div>
          <div class="data-panel-body" id="dataInterceptedBody"><span class="data-placeholder">Waiting...</span></div>
        </div>
      `;
      return;
    }
    if (cryptoStep < cryptoTotalSteps - 1) {
      goToCryptoStep(cryptoStep + 1);
    }
  });

  cryptoResetBtn.addEventListener("click", () => {
    cryptoStep = 0;
    cryptoNextBtn.disabled = false;
    cryptoNextBtn.dataset.restart = "false";
    cryptoNextBtn.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
    resetCryptoNetwork();

    // Rebuild data panels
    document.getElementById("cryptoDataDisplay").innerHTML = `
      <div class="data-panel" id="dataSent">
        <div class="data-panel-header"><i class="fa-solid fa-paper-plane"></i> Data Being Sent</div>
        <div class="data-panel-body" id="dataSentBody"><span class="data-placeholder">Waiting...</span></div>
      </div>
      <div class="data-panel" id="dataIntercepted">
        <div class="data-panel-header"><i class="fa-solid fa-eye"></i> What Attacker Sees</div>
        <div class="data-panel-body" id="dataInterceptedBody"><span class="data-placeholder">Waiting...</span></div>
      </div>
    `;

    goToCryptoStep(0);
  });



});