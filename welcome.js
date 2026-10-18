const user_data = "name_data_subj";

const TAG_COLORS = [
    "tc0",
    "tc1",
    "tc2",
    "tc3",
    "tc4",
    "tc5",
    "tc6",
    "tc7",
];

let subjects = [];
let colorIndex = 0;

// ── Load from localStorage ──
function load() {
    try {
        const raw = localStorage.getItem(user_data);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// ── Save to localStorage ──
function save() {
    const hours =
        parseFloat(document.getElementById("hoursInput").value.trim()) || 0;

    // حساب التارجت لكل مادة
    const targetPerSubject =
        subjects.length > 0 ? +(hours / subjects.length).toFixed(1) : 0;

    // تحديث المواد وإضافة target
    subjects = subjects.map((subj) => ({
        ...subj,
        target: targetPerSubject,
    }));

    const data = {
        name: document.getElementById("nameInput").value.trim(),
        hours: hours,
        subjects: subjects,
        colorIndex: colorIndex,
    };

    localStorage.setItem(user_data, JSON.stringify(data));
}

// ── Render tags in setup form ──
function renderTags() {
    const wrap = document.getElementById("tagsWrap");

    wrap.innerHTML = "";

    subjects.forEach((subj, i) => {
        const tag = document.createElement("div");

        tag.className = "tag " + subj.color;

        tag.innerHTML = `
            ${subj.name}
            <span class="tag-remove" data-i="${i}" title="Remove">✕</span>
        `;

        wrap.appendChild(tag);
    });

    wrap.querySelectorAll(".tag-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
            subjects.splice(parseInt(btn.dataset.i), 1);

            renderTags();

            save();
        });
    });
}

let time = 0;

// ── Add subject ──
function addSubject() {
    const input = document.getElementById("subjectInput");

    const name = input.value.trim();

    if (!name) return;

    if (
        subjects.find(
            (s) => s.name.toLowerCase() === name.toLowerCase(),
        )
    ) {
        input.style.borderColor = "rgba(220,38,38,.6)";

        setTimeout(() => (input.style.borderColor = ""), 1000);

        return;
    }

    subjects.push({
        name,
        time,
        target: 0,
        color: TAG_COLORS[colorIndex % TAG_COLORS.length],
    });

    colorIndex++;

    input.value = "";

    renderTags();

    save();
}

// ── Render dashboard ──
function renderDashboard(data) {
    document.getElementById("dashName").textContent =
        data.name || "Student";

    document.getElementById("dashHours").textContent =
        data.hours || "0";

    document.getElementById("dashCount").textContent =
        data.subjects.length;

    const wrap = document.getElementById("dashTags");

    wrap.innerHTML = "";

    data.subjects.forEach((subj) => {
        const tag = document.createElement("div");

        tag.className = "tag " + subj.color;

        // عرض التارجت
        tag.textContent = `${subj.name} - ${subj.target}h`;

        wrap.appendChild(tag);
    });
}

// ── Switch views ──
function showDashboard() {
    document.getElementById("setupView").style.display = "none";

    const dash = document.getElementById("dashView");

    dash.classList.add("active");

    const data = load();

    if (data) renderDashboard(data);
}

function showSetup() {
    document.getElementById("dashView").classList.remove("active");

    document.getElementById("setupView").style.display = "block";

    const data = load();

    if (data) {
        document.getElementById("nameInput").value =
            data.name || "";

        document.getElementById("hoursInput").value =
            data.hours || "";

        subjects = data.subjects || [];

        colorIndex = data.colorIndex || 0;

        renderTags();
    }
}

// ── Init ──
document
    .getElementById("addBtn")
    .addEventListener("click", addSubject);

document
    .getElementById("subjectInput")
    .addEventListener("keydown", (e) => {
        if (e.key === "Enter") addSubject();
    });

// Auto-save name & hours on input
["nameInput", "hoursInput"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
        clearTimeout(window._saveTimer);

        window._saveTimer = setTimeout(save, 600);
    });
});

document.getElementById("goBtn").addEventListener("click", () => {
    const name =
        document.getElementById("nameInput").value.trim();

    const hours =
        document.getElementById("hoursInput").value.trim();

    if (!name) {
        document.getElementById("nameInput").focus();

        document.getElementById("nameInput").style.borderColor =
            "rgba(220,38,38,.6)";

        setTimeout(
            () =>
            (document.getElementById(
                "nameInput",
            ).style.borderColor = ""),
            1200,
        );

        return;
    }

    if (!hours || hours < 1) {
        document.getElementById("hoursInput").focus();

        document.getElementById("hoursInput").style.borderColor =
            "rgba(220,38,38,.6)";

        setTimeout(
            () =>
            (document.getElementById(
                "hoursInput",
            ).style.borderColor = ""),
            1200,
        );

        return;
    }

    save();

    showDashboard();
});

document
    .getElementById("editBtn")
    .addEventListener("click", showSetup);

// ── On load: check if data exists ──
const existing = load();

if (existing && existing.name && existing.hours) {
    // Pre-fill setup fields too
    subjects = existing.subjects || [];

    colorIndex = existing.colorIndex || 0;

    showDashboard();
} else {
    // Pre-fill defaults if partial data
    if (existing) {
        document.getElementById("nameInput").value =
            existing.name || "";

        document.getElementById("hoursInput").value =
            existing.hours || "";

        subjects = existing.subjects || [];

        colorIndex = existing.colorIndex || 0;

        renderTags();
    } else {
        // Default demo subjects
        subjects = [];

        colorIndex = 3;

        renderTags();
    }
}

function sart() {
    window.location.href =
        "../dash-board/add_task_pro.html";
}