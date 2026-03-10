document.addEventListener("DOMContentLoaded", () => {

    // ============================================
    // 30 QUIZ QUESTIONS (same as before)
    // ============================================
    const allQuestions = [
        { question: "What should you do if you receive an email asking for your password?", options: ["Reply with your password", "Ignore and delete it", "Click the link to verify", "Forward it to friends"], correct: 1, feedback: "Legitimate companies never ask for your password via email. Always delete such emails — they are phishing attempts." },
        { question: "What is the minimum recommended length for a strong password?", options: ["4 characters", "6 characters", "8 characters", "12 characters"], correct: 3, feedback: "Security experts recommend at least 12 characters. Longer passwords are exponentially harder to crack." },
        { question: "What does the 'S' in HTTPS stand for?", options: ["Speed", "Secure", "Server", "Standard"], correct: 1, feedback: "HTTPS stands for HyperText Transfer Protocol Secure. It encrypts data between your browser and the website." },
        { question: "Which of these is a common sign of a phishing email?", options: ["Personalized greeting", "Correct company logo", "Urgent action required", "Sent during business hours"], correct: 2, feedback: "Phishing emails often create urgency to pressure you into acting without thinking." },
        { question: "What is malware?", options: ["A type of hardware", "Malicious software designed to harm", "A secure email protocol", "A firewall setting"], correct: 1, feedback: "Malware is any software intentionally designed to cause damage, steal data, or gain unauthorized access." },
        { question: "Why should you not use the same password for multiple accounts?", options: ["It's hard to remember", "If one is hacked, all are compromised", "Websites don't allow it", "It slows down your computer"], correct: 1, feedback: "If one account is breached, attackers will try your password on other services." },
        { question: "What is two-factor authentication (2FA)?", options: ["Using two passwords", "Logging in from two devices", "A second verification step beyond password", "Encrypting files twice"], correct: 2, feedback: "2FA adds an extra layer by requiring something you know (password) plus something you have (phone, key)." },
        { question: "What should you do before clicking a link in an email?", options: ["Click it quickly", "Hover over it to check the URL", "Forward it to check", "Download the attachment first"], correct: 1, feedback: "Hovering over a link reveals the actual URL. If it doesn't match, it's likely malicious." },
        { question: "Which is the safest way to connect to the internet in public?", options: ["Free open WiFi", "Using a VPN on public WiFi", "Bluetooth tethering to strangers", "Any WiFi with a name you recognize"], correct: 1, feedback: "A VPN encrypts your traffic, making it much harder for attackers to intercept your data." },
        { question: "What is a firewall?", options: ["An antivirus program", "A network security system that monitors traffic", "A type of malware", "A backup tool"], correct: 1, feedback: "A firewall filters incoming and outgoing traffic based on security rules." },
        { question: "What type of attack floods a server with traffic?", options: ["Phishing", "Man-in-the-Middle", "DDoS", "SQL Injection"], correct: 2, feedback: "DDoS attacks overwhelm servers with massive traffic from multiple sources." },
        { question: "What is ransomware?", options: ["Software that speeds up your PC", "Malware that encrypts files and demands payment", "A secure file sharing tool", "An antivirus program"], correct: 1, feedback: "Ransomware locks your files and demands payment for the decryption key." },
        { question: "What is social engineering in cybersecurity?", options: ["Building social networks", "Manipulating people to reveal information", "Engineering social media platforms", "A type of encryption"], correct: 1, feedback: "Social engineering exploits human psychology rather than technical vulnerabilities." },
        { question: "What is a Man-in-the-Middle (MitM) attack?", options: ["Physical theft of a computer", "Intercepting communication between two parties", "Installing malware via USB", "Brute forcing a password"], correct: 1, feedback: "In MitM attacks, the attacker secretly relays communication between two parties." },
        { question: "Which of these passwords is the strongest?", options: ["password123", "MyDog'sName", "Tr0ub4dor&3", "j7$kL9!mNp2@xQ"], correct: 3, feedback: "Long, random passwords with mixed characters are strongest." },
        { question: "What is a zero-day vulnerability?", options: ["A bug fixed on day one", "A flaw unknown to the software vendor", "A virus that activates at midnight", "An expired security certificate"], correct: 1, feedback: "Zero-day vulnerabilities are unknown to the vendor, so no patch exists." },
        { question: "What does a VPN do?", options: ["Speeds up your internet", "Creates an encrypted tunnel for your data", "Blocks all advertisements", "Replaces your antivirus"], correct: 1, feedback: "A VPN encrypts your internet traffic and masks your IP address." },
        { question: "What is the purpose of encryption?", options: ["Making files smaller", "Converting data into unreadable code", "Deleting sensitive files", "Speeding up data transfer"], correct: 1, feedback: "Encryption converts readable data into ciphertext that needs a key to decode." },
        { question: "What is a Trojan Horse in cybersecurity?", options: ["A strong firewall", "Malware disguised as legitimate software", "A type of encryption", "A network monitoring tool"], correct: 1, feedback: "Trojans appear harmless but carry hidden malicious code." },
        { question: "Why are software updates important for security?", options: ["They add new features only", "They patch known vulnerabilities", "They make software look better", "They are not important"], correct: 1, feedback: "Updates include security patches that fix known vulnerabilities." },
        { question: "What is SQL injection?", options: ["A database backup method", "Inserting malicious SQL code into input fields", "A type of firewall", "Secure Query Language"], correct: 1, feedback: "SQL injection exploits poorly validated input to execute malicious database commands." },
        { question: "What does OWASP stand for?", options: ["Open Web Application Security Project", "Online Web Attack Safety Protocol", "Open Wireless Access Security Platform", "Official Web Application Standard Practice"], correct: 0, feedback: "OWASP produces guides and tools for web application security." },
        { question: "What is Cross-Site Scripting (XSS)?", options: ["Copying a website's design", "Injecting malicious scripts into web pages", "Sharing login credentials between sites", "A secure authentication method"], correct: 1, feedback: "XSS attacks inject scripts that execute in victims' browsers." },
        { question: "What is the CIA triad in information security?", options: ["Central Intelligence Agency principles", "Confidentiality, Integrity, Availability", "Computers, Internet, Applications", "Cybersecurity Investigation Alliance"], correct: 1, feedback: "The CIA triad: Confidentiality, Integrity, and Availability." },
        { question: "What is a honeypot in cybersecurity?", options: ["A type of malware", "A decoy system to attract attackers", "An encrypted storage device", "A social media scam"], correct: 1, feedback: "Honeypots are intentionally vulnerable systems designed to study attackers." },
        { question: "What is the principle of least privilege?", options: ["Giving everyone admin access", "Users get only the minimum access needed", "Removing all user permissions", "Sharing passwords with colleagues"], correct: 1, feedback: "Least privilege limits access to the bare minimum needed for a task." },
        { question: "What is a supply chain attack?", options: ["Attacking delivery trucks", "Compromising software through third-party vendors", "Stealing physical goods", "Blocking internet access"], correct: 1, feedback: "Supply chain attacks target third-party vendors to access the final target." },
        { question: "What is SSRF (Server-Side Request Forgery)?", options: ["A client-side cookie attack", "Tricking a server into making unintended requests", "A password cracking technique", "A type of spam filter"], correct: 1, feedback: "SSRF tricks servers into accessing internal resources." },
        { question: "What is certificate pinning?", options: ["Physically pinning a certificate", "Associating a host with its expected certificate", "Creating a new SSL certificate", "Deleting expired certificates"], correct: 1, feedback: "Certificate pinning prevents MitM attacks using forged certificates." },
        { question: "What is the purpose of a SIEM system?", options: ["Blocking all network traffic", "Real-time analysis of security alerts", "Encrypting all company data", "Managing employee passwords"], correct: 1, feedback: "SIEM aggregates logs for real-time threat detection and incident response." }
    ];

    // ============================================
    // 15 SPOT THE RISK SCENARIOS
    // ============================================
    const allScenarios = [
        {
            type: "email",
            render: () => `
        <div class="email-mock">
          <div class="email-header">
            <div class="email-field"><span class="label">From:</span><span class="value suspicious">security@paypa1-verify.com</span></div>
            <div class="email-field"><span class="label">Subject:</span><span class="value">⚠️ Your account has been limited!</span></div>
            <div class="email-field"><span class="label">To:</span><span class="value">you@email.com</span></div>
          </div>
          <div class="email-body">
            <p>Dear Valued Customer,</p>
            <p>We've detected <span class="urgency">unusual activity</span> on your account. Your account access has been limited until you verify your identity.</p>
            <p><span class="urgency">You must act within 24 hours</span> or your account will be permanently suspended.</p>
            <p>Click here to verify: <span class="phish-link">http://paypa1-verify.com/login</span></p>
            <p>Thank you,<br>PayPal Security Team</p>
          </div>
        </div>`,
            prompt: "What is the biggest red flag in this email?",
            options: ["The email mentions unusual activity", "The sender domain is 'paypa1-verify.com' (uses '1' instead of 'l')", "It was sent to your email address", "It mentions a 24-hour deadline"],
            correct: 1,
            feedback: "The sender domain 'paypa1-verify.com' uses the number '1' instead of 'l' to impersonate PayPal. Always check sender addresses carefully — this is a classic phishing technique."
        },
        {
            type: "website",
            render: () => `
        <div class="url-bar">
          <i class="fa-solid fa-lock-open" style="color:#ef4444"></i>
          <span class="url-text">http://<span class="url-suspicious">amaz0n-deals</span>.shop/signin</span>
        </div>
        <div class="website-content">
          <h4>Sign in to your account</h4>
          <p>Enter your Amazon credentials to access exclusive deals up to 90% off. Limited time only!</p>
          <div style="margin-top:14px; padding:10px; background:rgba(255,255,255,0.03); border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:12px; color:#64748b; margin-bottom:6px;">Email or phone</div>
            <div style="height:32px; background:rgba(255,255,255,0.04); border-radius:6px; border:1px solid rgba(255,255,255,0.08);"></div>
            <div style="font-size:12px; color:#64748b; margin:10px 0 6px;">Password</div>
            <div style="height:32px; background:rgba(255,255,255,0.04); border-radius:6px; border:1px solid rgba(255,255,255,0.08);"></div>
          </div>
        </div>`,
            prompt: "What makes this website dangerous?",
            options: ["It's offering deals", "It has a sign-in form", "The URL uses 'amaz0n' (zero) and isn't HTTPS", "It asks for an email"],
            correct: 2,
            feedback: "The URL uses 'amaz0n' (with a zero) and the '.shop' domain on plain HTTP — not the real Amazon. Fake login pages steal your credentials. Always check the URL and look for HTTPS."
        },
        {
            type: "message",
            render: () => `
        <div class="message-sender"><i class="fa-solid fa-user-circle"></i> Unknown Number (+1-555-0199)</div>
        <div class="message-bubble">Hey! I found your photos online 😱 Check them out before they go viral!</div>
        <div class="message-bubble">Click here: bit.ly/ur-ph0tos-leaked</div>`,
            prompt: "What should you do with this text message?",
            options: ["Click the link to check your photos", "Reply asking who they are", "Delete it — it's a smishing attack", "Forward it to your contacts to warn them"],
            correct: 2,
            feedback: "This is smishing (SMS phishing). The message creates panic about leaked photos to trick you into clicking a malicious link. Never click suspicious links from unknown numbers."
        },
        {
            type: "social",
            render: () => `
        <div class="social-post">
          <div class="social-header">
            <div class="social-avatar"><i class="fa-solid fa-user"></i></div>
            <div>
              <div class="social-name">TechGiveawayOfficial</div>
              <div class="social-handle">@tech_giveaway_2025 · Promoted</div>
            </div>
          </div>
          <div class="social-text">
            <p>🎉 HUGE GIVEAWAY! Win a MacBook Pro + $5,000 cash!</p>
            <p>All you need to do:</p>
            <p>1. Follow this account<br>2. Retweet this post<br>3. Click the link and enter your credit card for verification: <span style="color:#38bdf8">bit.ly/free-macbook</span></p>
            <p style="color:#ef4444; font-weight:600;">Only 50 spots left! 🔥</p>
          </div>
        </div>`,
            prompt: "What is the risk in this social media post?",
            options: ["It asks you to follow and retweet", "It says it's promoted content", "It requires your credit card for a 'free' giveaway", "It mentions a MacBook"],
            correct: 2,
            feedback: "Legitimate giveaways never ask for credit card details. This is a scam designed to steal your financial information. The urgency ('only 50 spots') is a manipulation tactic."
        },
        {
            type: "wifi",
            render: () => `
        <div class="wifi-icon-big"><i class="fa-solid fa-wifi"></i></div>
        <p style="color:#94a3b8; margin-bottom:4px;">You're at a coffee shop. Available networks:</p>
        <div class="wifi-list">
          <div class="wifi-item"><span class="wifi-name">☕ CoffeeShop_FreeWiFi</span><span class="wifi-security open">🔓 Open</span></div>
          <div class="wifi-item"><span class="wifi-name">CoffeeShop_Guest</span><span class="wifi-security secured">🔒 WPA2</span></div>
          <div class="wifi-item"><span class="wifi-name">FREE_INTERNET_FAST</span><span class="wifi-security open">🔓 Open</span></div>
          <div class="wifi-item"><span class="wifi-name">AndroidAP_Jake</span><span class="wifi-security secured">🔒 WPA2</span></div>
        </div>`,
            prompt: "Which network is safest to connect to?",
            options: ["CoffeeShop_FreeWiFi — it's the shop's WiFi", "FREE_INTERNET_FAST — fastest name", "CoffeeShop_Guest (WPA2) — ask staff for password", "AndroidAP_Jake — personal hotspot"],
            correct: 2,
            feedback: "The password-protected 'CoffeeShop_Guest' is safest. Open networks can be set up by anyone (including attackers). Always ask staff for the official network and use a VPN."
        },
        {
            type: "email",
            render: () => `
        <div class="email-mock">
          <div class="email-header">
            <div class="email-field"><span class="label">From:</span><span class="value suspicious">hr-department@company-benefits.xyz</span></div>
            <div class="email-field"><span class="label">Subject:</span><span class="value">ACTION REQUIRED: Update your direct deposit info</span></div>
          </div>
          <div class="email-body">
            <p>Hi Team,</p>
            <p>Due to a system upgrade, all employees must re-enter their bank account details for payroll processing.</p>
            <p><span class="urgency">Deadline: End of today</span></p>
            <p>Please fill out this form: <span class="phish-link">company-benefits.xyz/payroll-update</span></p>
            <p>— HR Department</p>
          </div>
        </div>`,
            prompt: "What makes this email suspicious?",
            options: ["It mentions a system upgrade", "It's from HR department", "The domain '.xyz' is unusual and it creates urgency to collect bank info", "It has a deadline"],
            correct: 2,
            feedback: "The '.xyz' domain is not your company's domain, and requesting bank details via email with extreme urgency is a classic spear-phishing tactic targeting employees."
        },
        {
            type: "website",
            render: () => `
        <div class="url-bar">
          <i class="fa-solid fa-lock" style="color:#22c55e"></i>
          <span class="url-text">https://www.dropbox.com/shared/document-invoice.pdf</span>
        </div>
        <div class="website-content">
          <h4>📄 SharedDocument_Invoice.pdf</h4>
          <p>This document was shared with you via Dropbox. Click "Download" to view the invoice.</p>
          <p style="font-size:12px; color:#64748b; margin-top:12px;">File size: 2.1 MB · Uploaded 2 hours ago</p>
        </div>`,
            prompt: "Your coworker didn't mention sending you an invoice. What should you do?",
            options: ["Download it — Dropbox is safe", "Click download since it has HTTPS", "Verify with your coworker before downloading", "Share it with your team"],
            correct: 2,
            feedback: "Even legitimate-looking links can be weaponized. Always verify unexpected file shares with the sender through a different channel before downloading."
        },
        {
            type: "message",
            render: () => `
        <div class="message-sender"><i class="fa-solid fa-user-circle"></i> +977-XXX-XXXX (Unknown)</div>
        <div class="message-bubble">HMRC: You are owed a tax refund of Rs50000.20. To claim, visit: hmrc-refund-claim.co.np and enter your details. Ref: TX8839201</div>`,
            prompt: "Is this text message legitimate?",
            options: ["Yes — it has a reference number", "Yes — HMRC does send texts", "No — HMRC won't ask you to enter details via a text link", "Not sure — better to click and check"],
            correct: 2,
            feedback: "Government agencies don't send refund links via text. The domain 'hmrc-refund-claim.co.np' is fake. Always go directly to the official website if you want to check."
        },
        {
            type: "social",
            render: () => `
        <div class="social-post">
          <div class="social-header">
            <div class="social-avatar"><i class="fa-solid fa-user"></i></div>
            <div>
              <div class="social-name">Jessica Miller</div>
              <div class="social-handle">@jessicam_real · 2h ago</div>
            </div>
          </div>
          <div class="social-text">
            <p>OMG just got back from the best vacation ever! 🌴✈️</p>
            <p>Was away for 2 weeks, house was empty but nothing happened thankfully 😅</p>
            <p>📍 Shared location: 742 Evergreen Terrace, Springfield</p>
            <p>#vacation #backHome #blessed</p>
          </div>
        </div>`,
            prompt: "What cyber risk does this social media post create?",
            options: ["Using hashtags", "Posting about vacation after returning", "Sharing home address and advertising that the house was empty", "Using emojis in a post"],
            correct: 2,
            feedback: "Sharing your home address and announcing your house was empty for 2 weeks is extremely dangerous. Criminals monitor social media for such information."
        },
        {
            type: "email",
            render: () => `
        <div class="email-mock">
          <div class="email-header">
            <div class="email-field"><span class="label">From:</span><span class="value">boss@yourcompany.com</span></div>
            <div class="email-field"><span class="label">Subject:</span><span class="value">Urgent — need a favor</span></div>
          </div>
          <div class="email-body">
            <p>Hey,</p>
            <p>I'm stuck in a meeting and can't talk. Can you quickly buy 5 Google Play gift cards ($100 each) and send me the codes? <span class="urgency">I'll reimburse you today.</span></p>
            <p>This is urgent, please don't tell anyone else — it's a surprise for the team.</p>
            <p>Thanks,<br>— Your Boss</p>
          </div>
        </div>`,
            prompt: "What type of attack is this?",
            options: ["A legitimate request from your boss", "A DDoS attack", "A Business Email Compromise (gift card scam)", "A ransomware attack"],
            correct: 2,
            feedback: "This is a classic Business Email Compromise. Scammers impersonate executives and request gift cards. Real bosses won't ask you to buy gift cards secretly via email."
        },
        {
            type: "website",
            render: () => `
        <div class="url-bar">
          <i class="fa-solid fa-lock" style="color:#22c55e"></i>
          <span class="url-text">https://www.<span class="url-suspicious">gooogle</span>.com/account/security</span>
        </div>
        <div class="website-content">
          <h4>⚠️ Security Alert</h4>
          <p>Someone from Russia tried to sign in to your Google account. If this wasn't you, verify your identity immediately.</p>
          <div style="margin-top:12px; padding:12px; text-align:center; background:rgba(239,68,68,0.1); border-radius:8px; border:1px solid rgba(239,68,68,0.3); color:#ef4444; font-weight:600;">Verify My Identity Now</div>
        </div>`,
            prompt: "Why should you NOT click 'Verify My Identity Now'?",
            options: ["Because Google never sends alerts", "Because the URL has 'gooogle' with three o's", "Because it mentions Russia", "Because it has HTTPS so it must be safe"],
            correct: 1,
            feedback: "The URL contains 'gooogle' (three o's) — a typosquatting attack. HTTPS doesn't guarantee a site is legitimate. Always check the exact domain spelling."
        },
        {
            type: "message",
            render: () => `
        <div class="message-sender"><i class="fa-brands fa-whatsapp" style="color:#25D366"></i> WhatsApp — Mom</div>
        <div class="message-bubble">Hi sweetheart, I lost my phone and this is my new number. Can you save it?</div>
        <div class="message-bubble">I'm in trouble and need you to send $500 to this account urgently: IBAN GB29NWBK60161331926819</div>
        <div class="message-bubble">Please don't call my old number, it's been stolen 😢</div>`,
            prompt: "What should you do?",
            options: ["Send the money — Mom needs help", "Save the new number and ask for more details", "Call your mom's original number to verify", "Block the number immediately"],
            correct: 2,
            feedback: "This is a common impersonation scam. Always verify by calling the person's known number. The scammer specifically tells you NOT to call the old number because it would expose them."
        },
        {
            type: "email",
            render: () => `
        <div class="email-mock">
          <div class="email-header">
            <div class="email-field"><span class="label">From:</span><span class="value">no-reply@linkedin.com</span></div>
            <div class="email-field"><span class="label">Subject:</span><span class="value">You appeared in 15 searches this week</span></div>
          </div>
          <div class="email-body">
            <p>Hi Professional,</p>
            <p>Your profile has been viewed by recruiters from top companies. See who's looking at your profile.</p>
            <p>Attachment: <span style="color:#38bdf8;">📎 ProfileViewers_Report.exe</span></p>
            <p>Best,<br>LinkedIn Team</p>
          </div>
        </div>`,
            prompt: "What is suspicious about this LinkedIn email?",
            options: ["LinkedIn notifies about profile views", "The email says 'Hi Professional' instead of your name", "The attachment is an .exe file (executable)", "It claims 15 searches"],
            correct: 2,
            feedback: "The .exe attachment is a huge red flag — it's an executable file that could install malware. Legitimate LinkedIn notifications link to the website, they never send .exe files."
        },
        {
            type: "wifi",
            render: () => `
        <div class="wifi-icon-big"><i class="fa-solid fa-plane"></i></div>
        <p style="color:#94a3b8; margin-bottom:4px;">You're at the airport. A pop-up appears:</p>
        <div style="margin-top:16px; padding:20px; background:rgba(255,255,255,0.04); border-radius:12px; border:1px solid rgba(255,255,255,0.08); text-align:center;">
          <p style="font-size:16px; font-weight:700; margin-bottom:8px;">🛜 Free Airport Premium WiFi</p>
          <p style="font-size:13px; color:#94a3b8; margin-bottom:14px;">To connect, please install our WiFi Helper app for the best experience.</p>
          <div style="padding:10px; background:rgba(34,197,94,0.15); border-radius:8px; color:#22c55e; font-weight:600; font-size:14px;">Download WiFi Helper.apk</div>
        </div>`,
            prompt: "Should you download the 'WiFi Helper' app?",
            options: ["Yes — airports provide helper apps", "Yes — it will improve your connection", "No — legitimate WiFi never requires app downloads", "Only if it's on the App Store"],
            correct: 2,
            feedback: "Legitimate WiFi networks use a browser captive portal, not app downloads. An .apk download is almost certainly malware. Never install apps to connect to WiFi."
        },
        {
            type: "social",
            render: () => `
        <div class="social-post">
          <div class="social-header">
            <div class="social-avatar"><i class="fa-solid fa-user"></i></div>
            <div>
              <div class="social-name">CryptoKing_Official</div>
              <div class="social-handle">@crypto_profits · Sponsored</div>
            </div>
          </div>
          <div class="social-text">
            <p>🚀 I turned $100 into $50,000 in just ONE WEEK!</p>
            <p>Want to know my secret? Join my exclusive Telegram group and I'll share my strategy for FREE!</p>
            <p>But first, send 0.01 BTC to this wallet to verify you're serious:</p>
            <p style="font-family:monospace; color:#fbbf24; font-size:12px;">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
            <p style="color:#ef4444; font-weight:600;">Only accepting 100 more members! ⏰</p>
          </div>
        </div>`,
            prompt: "What type of scam is this?",
            options: ["A real crypto investment opportunity", "A phishing email", "A cryptocurrency advance-fee scam", "A legitimate sponsored post"],
            correct: 2,
            feedback: "This is a classic advance-fee scam. Asking you to send cryptocurrency to 'verify' yourself is theft. Legitimate investments never require upfront crypto payments."
        }
    ];

    // ============================================
    // QUIZ STATE & ELEMENTS
    // ============================================
    let currentQuestion = 0, score = 0, answered = false, shuffledQuestions = [];

    const quizHub = document.getElementById("quizHub");
    const badgeInfo = document.getElementById("badgeInfo");
    const quizContainer = document.getElementById("quizContainer");
    const quizResults = document.getElementById("quizResults");
    const questionCount = document.getElementById("questionCount");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const progressFill = document.getElementById("progressFill");
    const questionText = document.getElementById("questionText");
    const optionsContainer = document.getElementById("optionsContainer");
    const quizFeedback = document.getElementById("quizFeedback");
    const nextBtn = document.getElementById("nextBtn");
    const resultsCard = document.getElementById("resultsCard");
    const resultBadgeIconI = document.getElementById("resultBadgeIconI");
    const resultBadgeTitle = document.getElementById("resultBadgeTitle");
    const resultBadgeSubtitle = document.getElementById("resultBadgeSubtitle");
    const resultScoreNum = document.getElementById("resultScoreNum");
    const ringFill = document.getElementById("ringFill");
    const statCorrect = document.getElementById("statCorrect");
    const statWrong = document.getElementById("statWrong");
    const statPercent = document.getElementById("statPercent");
    const startQuizCard = document.getElementById("startQuizCard");
    const retryBtn = document.getElementById("retryBtn");
    const backHomeBtn = document.getElementById("backHomeBtn");

    // GAME STATE & ELEMENTS
    let gameCurrentScenario = 0, gameScore = 0, gameAnswered = false;
    let gameStreak = 0, gameBestStreak = 0, shuffledScenarios = [];

    const gameContainer = document.getElementById("gameContainer");
    const gameResults = document.getElementById("gameResults");
    const scenarioCount = document.getElementById("scenarioCount");
    const streakDisplay = document.getElementById("streakDisplay");
    const streakBadge = document.getElementById("streakBadge");
    const gameScoreDisplay = document.getElementById("gameScoreDisplay");
    const gameProgressFill = document.getElementById("gameProgressFill");
    const scenarioBox = document.getElementById("scenarioBox");
    const gamePrompt = document.getElementById("gamePrompt");
    const gameOptionsContainer = document.getElementById("gameOptionsContainer");
    const gameFeedback = document.getElementById("gameFeedback");
    const gameNextBtn = document.getElementById("gameNextBtn");

    const gameResultsCard = document.getElementById("gameResultsCard");
    const gameResultBadgeIconI = document.getElementById("gameResultBadgeIconI");
    const gameResultBadgeTitle = document.getElementById("gameResultBadgeTitle");
    const gameResultBadgeSubtitle = document.getElementById("gameResultBadgeSubtitle");
    const gameResultScoreNum = document.getElementById("gameResultScoreNum");
    const gameRingFill = document.getElementById("gameRingFill");
    const gameStatCorrect = document.getElementById("gameStatCorrect");
    const gameStatWrong = document.getElementById("gameStatWrong");
    const gameStatStreak = document.getElementById("gameStatStreak");

    const startGameCard = document.getElementById("startGameCard");
    const gameRetryBtn = document.getElementById("gameRetryBtn");
    const gameBackBtn = document.getElementById("gameBackBtn");

    // ============================================
    // HELPERS
    // ============================================
    const letters = ["A", "B", "C", "D"];
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function hideAll() {
        quizHub.style.display = "none";
        badgeInfo.style.display = "none";
        quizContainer.classList.remove("active");
        quizResults.classList.remove("active");
        gameContainer.classList.remove("active");
        gameResults.classList.remove("active");
    }

    function showHub() {
        hideAll();
        quizHub.style.display = "";
        badgeInfo.style.display = "";
    }

    // ============================================
    // QUIZ LOGIC (same as before)
    // ============================================
    function showQuiz() { hideAll(); quizContainer.classList.add("active"); window.scrollTo({ top: 0, behavior: "smooth" }); }
    function showQuizResults() { hideAll(); quizResults.classList.add("active"); window.scrollTo({ top: 0, behavior: "smooth" }); }

    function renderQuestion() {
        answered = false;
        const q = shuffledQuestions[currentQuestion];
        const total = shuffledQuestions.length;
        questionCount.textContent = `Question ${currentQuestion + 1} of ${total}`;
        scoreDisplay.textContent = score;
        progressFill.style.width = `${(currentQuestion / total) * 100}%`;
        questionText.textContent = q.question;
        optionsContainer.innerHTML = "";
        quizFeedback.className = "quiz-feedback"; quizFeedback.style.display = "none";
        nextBtn.classList.remove("show");

        q.options.forEach((opt, i) => {
            const div = document.createElement("div");
            div.className = "quiz-option";
            div.innerHTML = `<span class="option-letter">${letters[i]}</span><span class="option-text">${opt}</span>`;
            div.addEventListener("click", () => selectQuizAnswer(i, div));
            optionsContainer.appendChild(div);
        });
    }

    function selectQuizAnswer(index, el) {
        if (answered) return;
        answered = true;
        const q = shuffledQuestions[currentQuestion];
        const allOpts = optionsContainer.querySelectorAll(".quiz-option");
        allOpts.forEach(o => o.classList.add("disabled"));

        if (index === q.correct) {
            score++; scoreDisplay.textContent = score;
            el.classList.add("correct");
            quizFeedback.className = "quiz-feedback correct show";
            quizFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Correct! ${q.feedback}`;
        } else {
            el.classList.add("wrong"); allOpts[q.correct].classList.add("correct");
            quizFeedback.className = "quiz-feedback wrong show";
            quizFeedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Wrong! ${q.feedback}`;
        }
        nextBtn.textContent = currentQuestion < shuffledQuestions.length - 1 ? "Next Question →" : "See Results →";
        nextBtn.classList.add("show");
    }

    nextBtn.addEventListener("click", () => {
        currentQuestion++;
        if (currentQuestion < shuffledQuestions.length) renderQuestion();
        else finishQuiz();
    });

    function finishQuiz() {
        const total = shuffledQuestions.length;
        const pct = Math.round((score / total) * 100);
        let badge, icon, subtitle;
        if (score <= 10) { badge = "beginner"; icon = "fa-solid fa-seedling"; subtitle = "You're just getting started — keep learning!"; }
        else if (score <= 20) { badge = "intermediate"; icon = "fa-solid fa-fire"; subtitle = "Solid knowledge! You're building strong cyber habits."; }
        else { badge = "expert"; icon = "fa-solid fa-crown"; subtitle = "Outstanding! You have expert-level cyber awareness."; }

        resultsCard.className = `results-card ${badge}`;
        resultBadgeIconI.className = icon;
        resultBadgeTitle.textContent = { beginner: "Beginner Badge", intermediate: "Intermediate Badge", expert: "Expert Badge" }[badge];
        resultBadgeSubtitle.textContent = subtitle;

        const circ = 2 * Math.PI * 52;
        const offset = circ - (score / total) * circ;
        ringFill.style.strokeDasharray = circ;
        ringFill.style.strokeDashoffset = circ;
        resultScoreNum.textContent = score;
        statCorrect.textContent = score;
        statWrong.textContent = total - score;
        statPercent.textContent = pct + "%";

        showQuizResults();
        requestAnimationFrame(() => setTimeout(() => { ringFill.style.strokeDashoffset = offset; }, 100));
    }

    function startQuiz() {
        currentQuestion = 0; score = 0;
        shuffledQuestions = shuffle(allQuestions);
        showQuiz(); renderQuestion();
    }

    startQuizCard.addEventListener("click", startQuiz);
    retryBtn.addEventListener("click", startQuiz);
    backHomeBtn.addEventListener("click", showHub);

    // ============================================
    // SPOT THE RISK GAME LOGIC
    // ============================================
    function showGame() { hideAll(); gameContainer.classList.add("active"); window.scrollTo({ top: 0, behavior: "smooth" }); }
    function showGameResults() { hideAll(); gameResults.classList.add("active"); window.scrollTo({ top: 0, behavior: "smooth" }); }

    function renderScenario() {
        gameAnswered = false;
        const s = shuffledScenarios[gameCurrentScenario];
        const total = shuffledScenarios.length;

        scenarioCount.textContent = `Scenario ${gameCurrentScenario + 1} of ${total}`;
        gameScoreDisplay.textContent = gameScore;
        streakDisplay.textContent = gameStreak;
        streakBadge.classList.toggle("hot", gameStreak >= 3);
        gameProgressFill.style.width = `${(gameCurrentScenario / total) * 100}%`;

        // Set scenario type class
        scenarioBox.className = `scenario-box ${s.type}-scenario`;
        scenarioBox.innerHTML = s.render();

        gamePrompt.textContent = s.prompt;
        gameOptionsContainer.innerHTML = "";
        gameFeedback.className = "quiz-feedback"; gameFeedback.style.display = "none";
        gameNextBtn.classList.remove("show");

        s.options.forEach((opt, i) => {
            const div = document.createElement("div");
            div.className = "quiz-option";
            div.innerHTML = `<span class="option-letter">${letters[i]}</span><span class="option-text">${opt}</span>`;
            div.addEventListener("click", () => selectGameAnswer(i, div));
            gameOptionsContainer.appendChild(div);
        });
    }

    function selectGameAnswer(index, el) {
        if (gameAnswered) return;
        gameAnswered = true;
        const s = shuffledScenarios[gameCurrentScenario];
        const allOpts = gameOptionsContainer.querySelectorAll(".quiz-option");
        allOpts.forEach(o => o.classList.add("disabled"));

        if (index === s.correct) {
            gameScore++; gameStreak++;
            if (gameStreak > gameBestStreak) gameBestStreak = gameStreak;
            gameScoreDisplay.textContent = gameScore;
            streakDisplay.textContent = gameStreak;
            streakBadge.classList.toggle("hot", gameStreak >= 3);
            streakBadge.classList.add("pop");
            setTimeout(() => streakBadge.classList.remove("pop"), 400);

            el.classList.add("correct");
            gameFeedback.className = "quiz-feedback correct show";
            gameFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Correct! ${s.feedback}`;
        } else {
            gameStreak = 0;
            streakDisplay.textContent = 0;
            streakBadge.classList.remove("hot");
            el.classList.add("wrong");
            allOpts[s.correct].classList.add("correct");
            gameFeedback.className = "quiz-feedback wrong show";
            gameFeedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Wrong! ${s.feedback}`;
        }

        gameNextBtn.textContent = gameCurrentScenario < shuffledScenarios.length - 1 ? "Next Scenario →" : "See Results →";
        gameNextBtn.classList.add("show");
    }

    gameNextBtn.addEventListener("click", () => {
        gameCurrentScenario++;
        if (gameCurrentScenario < shuffledScenarios.length) renderScenario();
        else finishGame();
    });

    function finishGame() {
        const total = shuffledScenarios.length;
        const wrong = total - gameScore;

        let badge, icon, subtitle;
        if (gameScore <= 5) { badge = "beginner"; icon = "fa-solid fa-seedling"; subtitle = "Keep practicing — you'll get better at spotting risks!"; }
        else if (gameScore <= 10) { badge = "intermediate"; icon = "fa-solid fa-fire"; subtitle = "Good eye! You can spot most common threats."; }
        else { badge = "expert"; icon = "fa-solid fa-crown"; subtitle = "Sharp instincts! You're a cyber risk detection expert."; }

        gameResultsCard.className = `results-card ${badge}`;
        gameResultBadgeIconI.className = icon;
        gameResultBadgeTitle.textContent = { beginner: "Risk Spotter — Beginner", intermediate: "Risk Spotter — Intermediate", expert: "Risk Spotter — Expert" }[badge];
        gameResultBadgeSubtitle.textContent = subtitle;

        const circ = 2 * Math.PI * 52;
        const offset = circ - (gameScore / total) * circ;
        gameRingFill.style.strokeDasharray = circ;
        gameRingFill.style.strokeDashoffset = circ;
        gameResultScoreNum.textContent = gameScore;
        gameStatCorrect.textContent = gameScore;
        gameStatWrong.textContent = wrong;
        gameStatStreak.textContent = gameBestStreak;

        showGameResults();
        requestAnimationFrame(() => setTimeout(() => { gameRingFill.style.strokeDashoffset = offset; }, 100));
    }

    function startGame() {
        gameCurrentScenario = 0; gameScore = 0; gameStreak = 0; gameBestStreak = 0;
        shuffledScenarios = shuffle(allScenarios);
        showGame(); renderScenario();
    }

    startGameCard.addEventListener("click", startGame);
    gameRetryBtn.addEventListener("click", startGame);
    gameBackBtn.addEventListener("click", showHub);

    // Init
    showHub();
});