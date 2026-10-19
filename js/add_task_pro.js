// load data
let savedData =
  JSON.parse(localStorage.getItem("name_data_subj")) || {};

let data = {
  name: savedData.name || "Guest",

  subjects: (savedData.subjects || []).map((s) => ({
    name: s.name,
    color: s.color,
    studiedTime: s.time || 0,
    allocatedTime: s.target || 0
  }))
};

console.log(data);

let xp = document.getElementById("xp");
let level = document.getElementById("level");
let timeEl = document.getElementById("timeText");
let circle = document.getElementById("circle");

let subjectSelect = document.getElementById("subjectSelect");
let hoursInput = document.getElementById("hoursInput");
let todayPlanEl = document.getElementById("todayPlan");

// الاسم من localStorage


/// الخطة المحفوظة + فلترة المواد المحذوفة
let selectedSubjects =
  (JSON.parse(localStorage.getItem("todayPlan")) || [])
    .filter(planSubject =>
      data.subjects.some(
        realSubject => realSubject.name === planSubject.name
      )
    );

// إضافة startStudied للتاسكات القديمة
selectedSubjects = selectedSubjects.map(task => ({
  ...task,
  startStudied: task.startStudied || 0
}));

// تحديث التخزين بعد التنضيف
localStorage.setItem(
  "todayPlan",
  JSON.stringify(selectedSubjects)
);

// Popup بدل alert
function showPopup(message, type = "error") {
  let popup = document.createElement("div");

  popup.innerText = message;

  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.padding = "12px 18px";
  popup.style.borderRadius = "10px";
  popup.style.color = "white";
  popup.style.fontSize = "14px";
  popup.style.zIndex = "9999";
  popup.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
  popup.style.transition = "0.3s";

  if (type === "error") popup.style.background = "#EF4444";
  else if (type === "success") popup.style.background = "#10B981";
  else popup.style.background = "#3B82F6";

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform = "translateX(-50%) translateY(10px)";
  }, 2000);

  setTimeout(() => {
    popup.remove();
  }, 2500);
}

// الالوان
const COLOR_MAP = {
  tc0: "#7C3AED",
  tc1: "#06B6D4",
  tc2: "#F59E0B",
  tc3: "#10B981",
  tc4: "#EF4444",
  tc5: "#EC4899",
  tc6: "#8B5CF6",
  tc7: "#14B8A6"
};

let totalMinutes = data.subjects.reduce(
  (sum, s) => sum + (s.studiedTime || 0),
  0
);

let h = Math.floor(totalMinutes / 60);
let m = totalMinutes % 60;

xp.innerText = totalMinutes;

level.innerHTML = `
  ${Math.floor(totalMinutes / 100)}
  <i style="color:#F59E0B;font-size:30px" class="fa-solid fa-star"></i>
`;

let targetHours =
  Number(savedData.hours) || 4;

timeEl.innerHTML = `
${h}:${m < 10 ? "0" + m : m}<br>
<span style="font-size:14px;color:#94A3B8;">
/ ${targetHours}h
</span>
`;

let r = 70;
let c = 2 * Math.PI * r;

circle.style.strokeDasharray = c;

let percent =
  Math.min((h / targetHours) * 100, 100);

circle.style.strokeDashoffset =
  c - (percent / 100) * c;

// subject progress
let container =
  document.getElementById("subjects");

function renderSubjectProgress() {

  let html = "";

  selectedSubjects.forEach((s) => {

    let originalSubject =
      data.subjects.find(
        subject => subject.name === s.name
      );

    let currentStudied =
      originalSubject?.studiedTime || 0;

    let studiedForTask =
      currentStudied - (s.startStudied || 0);

    let allocated =
      s.todayMinutes || 0;

    let progress =
      allocated > 0
        ? (studiedForTask / allocated) * 100
        : 0;

    progress = Math.max(
      0,
      Math.min(progress, 100)
    );
    let subjectColor =
      COLOR_MAP[originalSubject?.color] || "#7C3AED";

    html += `
      <div style="margin-bottom:15px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <strong>${s.name}</strong>
          <span>${progress.toFixed(0)}%</span>
        </div>

        <div style="background:#334155;height:6px;border-radius:5px;overflow:hidden;">
          <div style="width:${progress}%;background:${subjectColor};height:6px;transition:0.3s;"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// select
subjectSelect.innerHTML = `
<option disabled selected>Select subject</option>
`;

data.subjects.forEach((s) => {
  subjectSelect.innerHTML += `
    <option value="${s.name}">
      ${s.name}
    </option>
  `;
});

// add subject
function addSubject() {

  let subjectName = subjectSelect.value;
  let hours = Number(hoursInput.value);

  if (!subjectName || !hours || hours <= 0) {
    showPopup("Choose subject and enter hours ⏱", "error");
    return;
  }

  let minutes = Math.round(hours * 60);

  let originalSubject =
    data.subjects.find(
      subject => subject.name === subjectName
    );

  if (!originalSubject) {
    showPopup("Subject not found", "error");
    return;
  }

  let targetMinutes =
    (originalSubject.allocatedTime || 0) * 60;

  let studiedMinutes =
    originalSubject.studiedTime || 0;

  if (studiedMinutes + minutes > targetMinutes) {

    let remaining =
      (targetMinutes - studiedMinutes) / 60;

    showPopup(
      `${subjectName} only has ${remaining.toFixed(2)} hour(s) remaining`,
      "error"
    );

    return;
  }

  if (
    selectedSubjects.some(
      (s) => s.name === subjectName
    )
  ) {
    showPopup("Subject already added today", "error");
    return;
  }
  selectedSubjects.push({
    name: subjectName,
    todayMinutes: minutes,
    todayHours: hours,
    startStudied: studiedMinutes
  });

  localStorage.setItem(
    "todayPlan",
    JSON.stringify(selectedSubjects)
  );

  showPopup("Subject added successfully 💪", "success");

  hoursInput.value = "";
  subjectSelect.selectedIndex = 0;

  renderTodayPlan();
  renderSubjectProgress();
}

// remove subject
function removeSubject(index) {

  selectedSubjects.splice(index, 1);

  localStorage.setItem(
    "todayPlan",
    JSON.stringify(selectedSubjects)
  );

  renderTodayPlan();
  renderSubjectProgress();
}

// today plan
function renderTodayPlan() {

  todayPlanEl.innerHTML = "";

  selectedSubjects.forEach((s, index) => {

    let originalSubject =
      data.subjects.find(
        subject => subject.name === s.name
      );

    let subjectColor =
      COLOR_MAP[originalSubject?.color] || "#7C3AED";

    todayPlanEl.innerHTML += `
      <div class="plan-item">

        <div class="subject-info">
          <span class="subject-dot" style="background:${subjectColor};"></span>
          <span>${s.name}</span>
        </div>

        <div style="display:flex;align-items:center;gap:10px;">
          <span>${s.todayHours} h</span>

          <button onclick="removeSubject(${index})"
            style="background:#6B7280;border:none;color:white;padding:4px 8px;border-radius:6px;cursor:pointer;">
            X
          </button>
        </div>

      </div>
    `;
  });
}

function goFocus() {
  localStorage.setItem(
    "todayPlan",
    JSON.stringify(selectedSubjects)
  );

  window.location.href = "../dash-board/focus.html";
}

// first render
renderTodayPlan();
renderSubjectProgress();
// edit nav bar 
const user = document.getElementById("user")
user.textContent = savedData.name

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