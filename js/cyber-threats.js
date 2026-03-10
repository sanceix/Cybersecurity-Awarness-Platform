const cards = document.querySelectorAll(".threat-card");
const modalOverlay = document.getElementById("threatModal");
const modalBox = document.getElementById("modalBox");
const closeModal = document.getElementById("closeModal");

const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalHow = document.getElementById("modalHow");
const modalProtect = document.getElementById("modalProtect");
const modalIcon = document.getElementById("modalIcon");

cards.forEach(card => {
    card.addEventListener("click", () => {

        // 1️⃣ Get data
        const title = card.dataset.title;
        const subtitle = card.dataset.subtitle;
        const how = card.dataset.how;
        const protect = card.dataset.protect.split("|");
        const type = card.dataset.type;

        // 2️⃣ Set text
        modalTitle.textContent = title;
        modalSubtitle.textContent = subtitle;
        modalHow.textContent = how;

        // 3️⃣ Clear & rebuild protection list
        modalProtect.innerHTML = "";
        protect.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            modalProtect.appendChild(li);
        });

        // 4️⃣ ICON FIX (THIS IS THE MISSING PART)
        const iconHTML = card.querySelector(".threat-icon").innerHTML;
        modalIcon.innerHTML = iconHTML;

        // 5️⃣ Apply color theme
        modalBox.className = `modal ${type}`;
        modalIcon.className = `modal-icon ${type}`;

        // 6️⃣ Show modal
        modalOverlay.classList.remove("hidden");
    });
});

// Close modal
closeModal.addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
});

// Close on background click
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add("hidden");
    }
});
