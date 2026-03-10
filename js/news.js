document.addEventListener("DOMContentLoaded", () => {

  // ============================================
  // ELEMENTS
  // ============================================
  const newsGrid = document.getElementById("newsGrid");
  const cveList = document.getElementById("cveList");
  const newsLoading = document.getElementById("newsLoading");
  const cveLoading = document.getElementById("cveLoading");
  const newsError = document.getElementById("newsError");
  const cveError = document.getElementById("cveError");
  const newsCountEl = document.getElementById("newsCount");
  const cveCountEl = document.getElementById("cveCount");
  const searchInput = document.getElementById("searchInput");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const newsSection = document.getElementById("newsSection");
  const cveSection = document.getElementById("cveSection");
  const retryNewsBtn = document.getElementById("retryNews");
  const retryCveBtn = document.getElementById("retryCve");

  let allNews = [];
  let allCves = [];
  let activeFilter = "all";

  // Pagination
  const NEWS_PER_PAGE = 6;
  let newsPage = 1;
  let displayedNews = [];

  // ============================================
  // HELPERS
  // ============================================
  function timeAgo(dateStr) {
    if (!dateStr) return "";
    const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (seconds < 0 || seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function getBadge(title) {
    const t = title.toLowerCase();
    if (t.includes("malware")) return { label: "Malware", cls: "malware" };
    if (t.includes("ransomware")) return { label: "Ransomware", cls: "ransomware" };
    if (t.includes("breach") || t.includes("leak") || t.includes("stolen")) return { label: "Breach", cls: "breach" };
    if (t.includes("phish")) return { label: "Phishing", cls: "phishing" };
    if (t.includes("ai") || t.includes("artificial")) return { label: "AI", cls: "ai" };
    if (t.includes("vulnerabilit") || t.includes("cve") || t.includes("flaw") || t.includes("exploit") || t.includes("patch")) return { label: "Vulnerability", cls: "vulnerability" };
    if (t.includes("zero-day") || t.includes("0-day")) return { label: "Zero-Day", cls: "vulnerability" };
    return { label: "Threat", cls: "threat" };
  }

  function getSeverity(cvssScore) {
    if (cvssScore === null || cvssScore === undefined || isNaN(cvssScore)) return { label: "Unknown", cls: "unknown" };
    const score = parseFloat(cvssScore);
    if (score >= 9) return { label: "Critical", cls: "critical" };
    if (score >= 7) return { label: "High", cls: "high" };
    if (score >= 4) return { label: "Medium", cls: "medium" };
    return { label: "Low", cls: "low" };
  }

  function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
  }

  // ============================================
  // RENDER NEWS (paginated)
  // ============================================
  function renderNews(articles, reset) {
    if (reset) {
      newsGrid.innerHTML = "";
      newsPage = 1;
    }

    displayedNews = articles;

    if (articles.length === 0) {
      newsGrid.innerHTML = `
        <div style="text-align:center; padding:40px; color:#475569;">
          <i class="fa-solid fa-search" style="font-size:24px; margin-bottom:10px; display:block;"></i>
          No matching articles found
        </div>`;
      removeLoadMore();
      return;
    }

    const start = 0;
    const end = newsPage * NEWS_PER_PAGE;
    const visible = articles.slice(start, end);

    newsGrid.innerHTML = "";

    visible.forEach(article => {
      const badge = getBadge(article.title);
      const desc = stripHtml(article.description || article.content || "").substring(0, 150);
      const hasThumbnail = article.thumbnail && article.thumbnail.length > 10;

      const card = document.createElement("a");
      card.className = "news-card";
      card.href = article.link;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      card.innerHTML = `
        ${hasThumbnail ? `<div class="news-card-thumb"><img src="${article.thumbnail}" alt="" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : ""}
        <div class="news-card-body">
          <div class="news-card-meta">
            <span class="news-badge ${badge.cls}">${badge.label}</span>
            <span class="news-time">${timeAgo(article.pubDate)}</span>
          </div>
          <div class="news-card-title">${article.title}</div>
          <div class="news-card-desc">${desc}</div>
          <span class="news-card-link">Read full article →</span>
        </div>
      `;

      newsGrid.appendChild(card);
    });

    // Show/hide load more button
    if (end < articles.length) {
      addLoadMoreButton(articles.length - end);
    } else {
      removeLoadMore();
    }
  }

  // ============================================
  // LOAD MORE BUTTON
  // ============================================
  function addLoadMoreButton(remaining) {
    removeLoadMore();

    const btn = document.createElement("button");
    btn.className = "load-more-btn";
    btn.id = "loadMoreBtn";
    btn.innerHTML = `<i class="fa-solid fa-plus"></i> Load More <span class="load-more-count">(${remaining} remaining)</span>`;

    btn.addEventListener("click", () => {
      newsPage++;
      renderNews(displayedNews, false);
    });

    newsGrid.appendChild(btn);
  }

  function removeLoadMore() {
    const existing = document.getElementById("loadMoreBtn");
    if (existing) existing.remove();
  }

  // ============================================
  // RENDER CVEs
  // ============================================
  function renderCves(cves) {
    cveList.innerHTML = "";

    if (cves.length === 0) {
      cveList.innerHTML = `
        <div style="text-align:center; padding:40px; color:#475569;">
          <i class="fa-solid fa-search" style="font-size:24px; margin-bottom:10px; display:block;"></i>
          No matching vulnerabilities found
        </div>`;
      return;
    }

    cves.forEach(cve => {
      const cveId = cve.id || cve.cve_id || cve.cveId || "Unknown";
      const summary = (cve.summary || cve.description || "No description available.").substring(0, 220);
      const cvss = cve.cvss || null;
      const severity = getSeverity(cvss);
      const published = cve.Published || cve.published || cve.datePublished || "";

      const card = document.createElement("div");
      card.className = "cve-card";

      card.innerHTML = `
        <div class="cve-header">
          <span class="cve-id">${cveId}</span>
          <span class="cve-severity ${severity.cls}">${severity.label}${cvss ? ` (${cvss})` : ""}</span>
        </div>
        <div class="cve-summary">${summary}</div>
        <div class="cve-footer">
          <span>${published ? timeAgo(published) : ""}</span>
          <a class="cve-link" href="https://www.cvedetails.com/cve/${cveId}/" target="_blank" rel="noopener noreferrer">View Details →</a>
        </div>
      `;

      cveList.appendChild(card);
    });
  }

  // ============================================
  // FETCH NEWS — Multiple RSS sources combined
  // ============================================
  const RSS_FEEDS = [
    "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews",
    "https://api.rss2json.com/v1/api.json?rss_url=https://www.bleepingcomputer.com/feed/",
    "https://api.rss2json.com/v1/api.json?rss_url=https://krebsonsecurity.com/feed/"
  ];

  function loadNews() {
    newsLoading.classList.remove("hidden");
    newsError.classList.remove("show");
    newsError.classList.add("hidden");
    newsGrid.innerHTML = "";
    newsPage = 1;

    // Fetch all feeds in parallel
    Promise.allSettled(
      RSS_FEEDS.map(url =>
        fetch(url)
          .then(r => {
            if (!r.ok) throw new Error("Feed error");
            return r.json();
          })
          .then(data => {
            if (!data.items || data.items.length === 0) return [];
            // Tag each article with its source
            const sourceName = data.feed ? data.feed.title : "Cyber News";
            return data.items.map(item => ({
              ...item,
              sourceName: sourceName
            }));
          })
          .catch(() => [])
      )
    ).then(results => {
      // Combine all articles
      let combined = [];
      results.forEach(result => {
        if (result.status === "fulfilled" && Array.isArray(result.value)) {
          combined = combined.concat(result.value);
        }
      });

      if (combined.length === 0) {
        throw new Error("No articles from any source");
      }

      // Sort by date (newest first)
      combined.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      // Remove duplicates by title similarity
      const seen = new Set();
      allNews = combined.filter(article => {
        const key = article.title.toLowerCase().substring(0, 50);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      newsCountEl.textContent = allNews.length;
      newsLoading.classList.add("hidden");
      renderNews(allNews, true);

    }).catch(err => {
      console.error("All news feeds failed:", err);
      newsLoading.classList.add("hidden");
      newsError.classList.remove("hidden");
      newsError.classList.add("show");
      newsCountEl.textContent = "0";
    });
  }

  // ============================================
  // FETCH CVEs — with fallbacks
  // ============================================
  const fallbackCves = [
    { id: "CVE-2024-3400", summary: "A command injection vulnerability in Palo Alto Networks PAN-OS GlobalProtect feature allows unauthenticated attackers to execute arbitrary code with root privileges on the firewall.", cvss: 10.0, Published: "2024-04-12" },
    { id: "CVE-2024-21762", summary: "An out-of-bounds write vulnerability in Fortinet FortiOS allows remote unauthenticated attackers to execute arbitrary code via specially crafted HTTP requests.", cvss: 9.8, Published: "2024-02-09" },
    { id: "CVE-2024-1709", summary: "ConnectWise ScreenConnect authentication bypass vulnerability allowing unauthorized access to the setup wizard, enabling attackers to create admin accounts.", cvss: 10.0, Published: "2024-02-19" },
    { id: "CVE-2024-27198", summary: "Authentication bypass vulnerability in JetBrains TeamCity web server allows unauthenticated attackers to perform administrative actions.", cvss: 9.8, Published: "2024-03-04" },
    { id: "CVE-2024-20353", summary: "A vulnerability in the management and VPN web servers for Cisco ASA and FTD Software allows unauthenticated remote attackers to cause a denial of service.", cvss: 8.6, Published: "2024-04-24" },
    { id: "CVE-2023-46805", summary: "An authentication bypass vulnerability in Ivanti Connect Secure and Policy Secure allows remote unauthenticated attackers to access restricted resources.", cvss: 8.2, Published: "2024-01-10" },
    { id: "CVE-2024-23897", summary: "An arbitrary file read vulnerability in Jenkins allows unauthenticated attackers to read files on the server through the CLI feature.", cvss: 9.8, Published: "2024-01-24" },
    { id: "CVE-2024-0204", summary: "Authentication bypass in GoAnywhere MFT prior to 7.4.1 allows an unauthorized user to create an admin user via the administration portal.", cvss: 9.8, Published: "2024-01-22" }
  ];

  function loadCves() {
    cveLoading.classList.remove("hidden");
    cveError.classList.remove("show");
    cveError.classList.add("hidden");
    cveList.innerHTML = "";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch("https://cve.circl.lu/api/last", { signal: controller.signal })
      .then(r => {
        clearTimeout(timeoutId);
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) throw new Error("Empty");
        allCves = data.slice(0, 10);
        cveCountEl.textContent = allCves.length;
        cveLoading.classList.add("hidden");
        renderCves(allCves);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.warn("Primary CVE API failed, trying NVD...", err);
        loadCveFallback();
      });
  }

  function loadCveFallback() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch("https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10", { signal: controller.signal })
      .then(r => {
        clearTimeout(timeoutId);
        if (!r.ok) throw new Error("NVD error");
        return r.json();
      })
      .then(data => {
        if (!data.vulnerabilities || data.vulnerabilities.length === 0) throw new Error("No NVD data");
        allCves = data.vulnerabilities.slice(0, 10).map(v => {
          const cve = v.cve;
          const desc = cve.descriptions ? cve.descriptions.find(d => d.lang === "en") : null;
          let cvss = null;
          if (cve.metrics) {
            if (cve.metrics.cvssMetricV31 && cve.metrics.cvssMetricV31[0]) cvss = cve.metrics.cvssMetricV31[0].cvssData.baseScore;
            else if (cve.metrics.cvssMetricV2 && cve.metrics.cvssMetricV2[0]) cvss = cve.metrics.cvssMetricV2[0].cvssData.baseScore;
          }
          return { id: cve.id, summary: desc ? desc.value : "No description available.", cvss, Published: cve.published };
        });
        cveCountEl.textContent = allCves.length;
        cveLoading.classList.add("hidden");
        renderCves(allCves);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.warn("NVD also failed, using static fallback...", err);
        loadCveStatic();
      });
  }

  function loadCveStatic() {
    allCves = fallbackCves;
    cveCountEl.textContent = allCves.length;
    cveLoading.classList.add("hidden");

    const note = document.createElement("div");
    note.className = "cve-cache-note";
    note.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> Showing recently known critical CVEs (live feed unavailable)`;
    cveList.appendChild(note);

    allCves.forEach(cve => {
      const severity = getSeverity(cve.cvss);
      const card = document.createElement("div");
      card.className = "cve-card";
      card.innerHTML = `
        <div class="cve-header">
          <span class="cve-id">${cve.id}</span>
          <span class="cve-severity ${severity.cls}">${severity.label}${cve.cvss ? ` (${cve.cvss})` : ""}</span>
        </div>
        <div class="cve-summary">${cve.summary.substring(0, 220)}</div>
        <div class="cve-footer">
          <span>${cve.Published ? timeAgo(cve.Published) : ""}</span>
          <a class="cve-link" href="https://www.cvedetails.com/cve/${cve.id}/" target="_blank" rel="noopener noreferrer">View Details →</a>
        </div>
      `;
      cveList.appendChild(card);
    });
  }

  // ============================================
  // SEARCH & FILTERS
  // ============================================
  searchInput.addEventListener("input", () => applyFilters());

  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();

    const filteredNews = allNews.filter(a =>
      a.title.toLowerCase().includes(query) ||
      (a.description || "").toLowerCase().includes(query)
    );

    const filteredCves = allCves.filter(c =>
      (c.id || "").toLowerCase().includes(query) ||
      (c.summary || c.description || "").toLowerCase().includes(query)
    );

    if (activeFilter === "all") {
      newsSection.style.display = "";
      cveSection.style.display = "";
    } else if (activeFilter === "news") {
      newsSection.style.display = "";
      cveSection.style.display = "none";
    } else if (activeFilter === "cve") {
      newsSection.style.display = "none";
      cveSection.style.display = "";
    }

    renderNews(filteredNews, true);
    renderCves(filteredCves);
  }

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.dataset.filter;
      applyFilters();
    });
  });

  // ============================================
  // RETRY
  // ============================================
  retryNewsBtn.addEventListener("click", loadNews);
  retryCveBtn.addEventListener("click", loadCves);

  // ============================================
  // INIT
  // ============================================
  loadNews();
  loadCves();
});