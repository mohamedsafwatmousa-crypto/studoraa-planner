/* ═══════════════════════════════════════
   STORAGE
═══════════════════════════════════════ */

const STORAGE_KEY = "name_data_subj";

const SUBJECT_ICONS = [
  '<i class="fa-solid fa-book-open"></i>'
];

const EXTRA_COLORS = [
  '#f97316',
  '#ec4899',
  '#14b8a6',
  '#eab308',
  '#6366f1',
  '#a855f7'
];

let subjects = [];

/* ═══════════════════════════════════════
   LOAD DATA
═══════════════════════════════════════ */

function loadData() {

  return JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || {
    subjects: []
  };
}

function loadSubjects() {

  const data = loadData();

  subjects = (data.subjects || []).map(sub => ({

    name: sub.name,

    color:
      sub.color || EXTRA_COLORS[0],

    target:
      Number(sub.target) ||
      (
        data.hours /
        data.subjects.length
      ).toFixed(2),

    // بالدقائق
    time: sub.time || 0,
    sessions: sub.sessions || 0,
    startedat: sub.startedat || null,
    day: sub.day || null




  }));
}

loadSubjects();

/* ═══════════════════════════════════════
   SAVE
═══════════════════════════════════════ */

function saveSubjects() {

  // البيانات القديمة من localStorage
  const oldData = loadData();

  data = oldData || {};

  data.subjects = subjects.map(sub => {

    // المادة القديمة
    const oldSubject =
      (oldData.subjects || []).find(
        s => s.name === sub.name
      );

    return {

      name: sub.name,

      color: sub.color,

      target: Number(sub.target),

      time: sub.time || 0,

      sessions: sub.sessions || 0,

      // حافظ على startedat القديم
      startedat:
        sub.startedat ||
        oldSubject?.startedat ||
        null,
      day: sub.day || null

    };

  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

/* ═══════════════════════════════════════
   DOM
═══════════════════════════════════════ */

const subjectsList =
  document.getElementById("subjectsList");

const emptyState =
  document.getElementById("emptyState");

const addForm =
  document.getElementById("addForm");

const toggleAddBtn =
  document.getElementById("toggleAddBtn");

const cancelBtn =
  document.getElementById("cancelBtn");

const addSubjectBtn =
  document.getElementById("addSubjectBtn");

const newNameInput =
  document.getElementById("newName");

const newTargetInput =
  document.getElementById("newTarget");

/* ═══════════════════════════════════════
   RENDER
═══════════════════════════════════════ */

function render() {

  subjectsList.innerHTML = "";

  emptyState.style.display =
    subjects.length === 0
      ? "block"
      : "none";

  subjects.forEach((subject, index) => {

    const studiedHours =
      (subject.time || 0) / 60;

    const studied =
      Math.min(
        studiedHours,
        subject.target
      );

    const remaining =
      Math.max(
        subject.target - studied,
        0
      );

    const pct = Math.min(
      Math.round(
        (studied / subject.target) * 100
      ),
      100
    );

    /* progress color */

    let progressColor = "#22c55e";

    if (pct < 40) {

      progressColor = "#ef4444";

    } else if (pct < 70) {

      progressColor = "#f59e0b";
    }

    const icon =
      SUBJECT_ICONS[
      index % SUBJECT_ICONS.length
      ];

    const card =
      document.createElement("div");

    card.className = "subject-card";

    card.innerHTML = `

      <div class="subject-card-top">

        <div class="subject-card-left">

          <div
            class="subject-icon"
            style="
              background:${subject.color}22;
              border:1px solid ${subject.color}44;
            "
          >
            ${icon}
          </div>

          <div>

            <div class="subject-name">
              ${subject.name}
            </div>

            <div class="subject-meta">

              <span>
                Target: ${subject.target}h
              </span>

              <span>
                Studied: ${studied.toFixed(1)}h
              </span>

              <span>
                Remaining: ${remaining.toFixed(1)}h
              </span>

              <span
                class="subject-pct"
                style="color:${progressColor};"
              >
                ${pct}%
              </span>

            </div>

          </div>

        </div>

        <div class="subject-actions">

          <button
            class="action-btn delete"
            data-index="${index}"
          >
            <i class="fa-regular fa-trash-can"></i>
          </button>

          <button
            class="action-btn edit"
            data-index="${index}"
          >
            <i class="fa-regular fa-pen-to-square"></i>
          </button>

        </div>

      </div>

      <div class="progress-bar">

        <div
          class="progress-fill"
          style="
            width:${pct}%;
            background:${progressColor};
          "
        ></div>

      </div>
    `;

    /* delete */

    card
      .querySelector(".delete")
      .addEventListener("click", () => {

        subjects.splice(index, 1);

        saveSubjects();

        render();
      });

    /* edit */

    card
      .querySelector(".edit")
      .addEventListener("click", () => {

        openEditForm(index, card);
      });

    subjectsList.appendChild(card);
  });
}

/* ═══════════════════════════════════════
   EDIT
═══════════════════════════════════════ */
function openEditForm(index, card) {

  if (document.querySelector(".inline-edit-form")) return;

  const s = subjects[index];

  const editHtml = `
    <div
      class="inline-edit-form add-form card"
      style="display:block; margin-top:12px;"
    >

      <div class="form-grid">

        <div>
          <div class="input-label">Subject Name</div>

          <input
            class="input-field edit-name"
            value="${s.name}"
          />
        </div>

        <div>
          <div class="input-label">Target</div>

          <input
            class="input-field edit-target"
            type="number"
            value="${s.target}"
            min="1"
          />
        </div>

      </div>

      <div class="form-actions">

        <button class="btn-sm save-edit-btn">
          Save
        </button>

        <button class="btn-outline-sm cancel-edit-btn">
          Cancel
        </button>

      </div>

    </div>
  `;

  card.insertAdjacentHTML("beforeend", editHtml);

  const form = card.querySelector(".inline-edit-form");

  /* SAVE */
  form.querySelector(".save-edit-btn").addEventListener("click", () => {

    const name = form.querySelector(".edit-name").value.trim();

    const target = parseFloat(
      form.querySelector(".edit-target").value
    );

    form.querySelector(".edit-name").style.borderColor = "";
    form.querySelector(".edit-target").style.borderColor = "";

    if (!name) {
      form.querySelector(".edit-name").style.borderColor = "red";
      return;
    }

    if (!target || target <= 0) {
      form.querySelector(".edit-target").style.borderColor = "red";
      return;
    }

    const data = loadData();
    const dailyHours = parseFloat(data.hours) || 0;

    if (target > dailyHours) {
      showPopup(`Subject target cannot exceed ${dailyHours}h`);
      form.querySelector(".edit-target").style.borderColor = "red";
      return;
    }

    const newTime = s.time; // ثابت بدون أي تعديل

    const freshData = loadData();

    const freshSubject = freshData.subjects.find(
      sub => sub.name === s.name
    );

    const startedat =
      freshSubject?.startedat || s.startedat || null;

    subjects[index] = {
      ...s,
      name,
      target: Number(target),
      time: newTime,
      sessions: s.sessions || 0,
      startedat
    };

    saveSubjects();
    render();
    form.remove();
  });

  /* CANCEL */
  form.querySelector(".cancel-edit-btn").addEventListener("click", () => {
    form.remove();
  });
}
/* ═══════════════════════════════════════
   ADD SUBJECT
═══════════════════════════════════════ */

toggleAddBtn.addEventListener(
  "click",
  () => {

    const isOpen =
      addForm.style.display === "block";

    addForm.style.display =
      isOpen ? "none" : "block";

    if (!isOpen)
      newNameInput.focus();
  }
);

cancelBtn.addEventListener(
  "click",
  () => {

    addForm.style.display = "none";

    newNameInput.value = "";

    newTargetInput.value = "";

    newNameInput.style.borderColor = "";

    newTargetInput.style.borderColor = "";
  }
);

addSubjectBtn.addEventListener(
  "click",
  addSubject
);

[newNameInput, newTargetInput]
  .forEach(inp => {

    inp.addEventListener(
      "keydown",
      e => {

        if (e.key === "Enter")
          addSubject();
      }
    );
  });

function addSubject() {

  const name =
    newNameInput.value.trim();

  const target =
    parseFloat(
      newTargetInput.value
    );

  /* reset borders */

  newNameInput.style.borderColor = "";

  newTargetInput.style.borderColor = "";

  /* validation */

  let hasError = false;

  if (!name) {

    newNameInput.style.borderColor =
      "red";

    hasError = true;
  }

  if (!target || target <= 0) {

    newTargetInput.style.borderColor =
      "red";

    hasError = true;
  }

  if (hasError) return;

  const data = loadData();

  const dailyHours =
    parseFloat(data.hours) || 0;

  /* المادة نفسها */

  if (target > dailyHours) {

    showPopup(
      `Subject target cannot exceed ${dailyHours}h`
    );

    newTargetInput.style.borderColor =
      "red";

    return;
  }

  /* duplicate */

  if (
    subjects.find(
      s =>
        s.name.toLowerCase() ===
        name.toLowerCase()
    )
  ) {

    showPopup(
      "Subject already exists"
    );

    return;
  }

  /* add */

  const color =
    EXTRA_COLORS[
    subjects.length %
    EXTRA_COLORS.length
    ];

  subjects.push({

    name,

    color,

    target: Number(target),

    // بالدقائق
    time: 0
  });

  saveSubjects();

  newNameInput.value = "";

  newTargetInput.value = "";

  addForm.style.display = "none";

  render();
}

/* ═══════════════════════════════════════
   POPUP
═══════════════════════════════════════ */

function showPopup(message) {

  const oldPopup =
    document.querySelector(".custom-popup");

  if (oldPopup) {
    oldPopup.remove();
  }

  const popup =
    document.createElement("div");

  popup.className = "custom-popup";

  popup.innerHTML = `
  
    <div class="popup-box">

      <div class="popup-icon">
        <i class="fa-solid fa-circle-exclamation"></i>
      </div>

      <div class="popup-text">
        ${message}
      </div>

      <button class="popup-btn">
        OK
      </button>

    </div>
  `;

  document.body.appendChild(popup);

  popup
    .querySelector(".popup-btn")
    .addEventListener("click", () => {

      popup.remove();
    });
}

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */

render();
let resave_data = localStorage.getItem("name_data_subj");

let myobj = JSON.parse(resave_data);


// edit nav bar 
const user = document.getElementById("user")
user.textContent = myobj.name

// logout btn
const logout = document.getElementById("logout")
logout.onclick = async function () {

  const result = await Swal.fire({
    icon: "warning",
    title: "warning",
    text: "if click logout your data deleted",
    showCancelButton: true,
    confirmButtonText: "logout",
    cancelButtonText: "cancel",
  });

  if (result.isConfirmed) {
    localStorage.clear();
    window.location.href = "../index.html"
  }
}