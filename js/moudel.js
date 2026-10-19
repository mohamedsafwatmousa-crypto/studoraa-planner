const LS_NAME = "studyplan_name";
const LS_SUBJECTS = "studyplan_subjects";
//mohamed ssssss//
let isOpen = false;
let datas = { name: "", hours: 0, subjects: [] };
let lastRawText = "";

const META = [
  ["👋 Hey! What's your name?", "Step 1 of 4"],
  ["How many hours?", "Step 2 of 4"],
  ["Your subjects", "Step 3 of 4"],
  ["Distribute hours", "Step 4 of 4"],
  ["✅ Your plan is ready!", "Generated locally"],
];

// ─── LOCAL STORAGE ───

function loadSaved() {
  const savedData = localStorage.getItem("name_data_subj");

  if (!savedData) return;

  try {
    const data = JSON.parse(savedData);

    if (data.name) {
      document.getElementById("iName").value = data.name;
      datas.name = data.name;
    }

    if (data.hours) {
      document.getElementById("iHours").value = data.hours;
      datas.hours = parseInt(data.hours, 10);
    }

    if (Array.isArray(data.subjects) && data.subjects.length > 0) {
      datas.subjects = data.subjects.map((s) =>
        typeof s === "string" ? s : s.name,
      );

      const list = document.getElementById("subjList");
      list.innerHTML = "";

      datas.subjects.forEach((subject) => {
        const d = document.createElement("div");
        d.className = "subj-row";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "si";
        input.placeholder = "Subject name";
        input.value = subject;

        const button = document.createElement("button");
        button.className = "rm-btn";
        button.textContent = "×";
        button.onclick = function () {
          rmSubj(this);
        };

        d.append(input, button);
        list.appendChild(d);
      });
    }
  } catch (error) {
    console.error("LocalStorage Error:", error);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function saveName(name) {
  localStorage.setItem(LS_NAME, name);
}

function saveSubjects(subjects) {
  localStorage.setItem(LS_SUBJECTS, JSON.stringify(subjects));
}

// ─── POPUP ───

function togglePopup() {
  isOpen = !isOpen;

  document.getElementById("popup").classList.toggle("visible", isOpen);

  document.getElementById("fab").classList.toggle("open", isOpen);

  if (isOpen) {
    setTimeout(() => {
      document.getElementById("iName").focus();
    }, 350);
  }
}

function goPane(n) {
  document.querySelectorAll(".step-pane").forEach((pane, i) => {
    pane.classList.toggle("active", i === n);
  });

  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById("sd" + i);

    if (dot) {
      dot.className = "s-dot" + (i < n ? " done" : i === n ? " active" : "");
    }
  }

  document.getElementById("popTitle").textContent = META[n][0];
  document.getElementById("popSub").textContent = META[n][1];
}

// ─── STEP 1: NAME ───

function s1() {
  const name = document.getElementById("iName").value.trim();

  if (!name) {
    document.getElementById("e0").style.display = "flex";
    return;
  }

  document.getElementById("e0").style.display = "none";

  datas.name = name;

  saveName(name);

  document.getElementById("nameDisp").textContent = name;

  goPane(1);

  setTimeout(() => {
    document.getElementById("iHours").focus();
  }, 100);
}

// ─── STEP 2: STUDY HOURS ───

function s2() {
  const hours = parseInt(document.getElementById("iHours").value, 10);

  if (!hours || hours < 1) {
    document.getElementById("e1").style.display = "flex";
    return;
  }

  document.getElementById("e1").style.display = "none";

  datas.hours = hours;

  goPane(2);

  const firstSubject = document.querySelector(".si");

  if (firstSubject) {
    setTimeout(() => firstSubject.focus(), 100);
  }
}

// ─── ADD / REMOVE SUBJECTS ───

function addSubj() {
  const div = document.createElement("div");
  div.className = "subj-row";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "si";
  input.placeholder = "Subject name";

  const button = document.createElement("button");
  button.className = "rm-btn";
  button.textContent = "×";
  button.onclick = function () {
    rmSubj(this);
  };

  div.append(input, button);

  document.getElementById("subjList").appendChild(div);

  input.focus();
}

function rmSubj(button) {
  if (document.querySelectorAll(".subj-row").length > 1) {
    button.parentElement.remove();
  }
}

// ─── STEP 3: SUBJECTS ───

function s3() {
  const subjects = [...document.querySelectorAll(".si")]
    .map((input) => input.value.trim())
    .filter(Boolean);

  if (!subjects.length) {
    document.getElementById("e2").style.display = "flex";
    return;
  }

  const uniqueSubjects = [...new Set(subjects)];

  document.getElementById("e2").style.display = "none";

  datas.subjects = uniqueSubjects;

  saveSubjects(uniqueSubjects);

  buildHrs();

  goPane(3);
}

// ─── STEP 4: DISTRIBUTE HOURS ───

function buildHrs() {
  document.getElementById("tDisp").textContent = datas.hours;

  const container = document.getElementById("hrsCards");
  container.innerHTML = "";

  const count = datas.subjects.length;
  const baseHours = Math.floor(datas.hours / count);
  const remainder = datas.hours % count;

  datas.subjects.forEach((subject, index) => {
    const div = document.createElement("div");
    div.className = "hrs-card";

    const label = document.createElement("span");
    label.className = "hrs-name";
    label.textContent = subject;

    const wrapper = document.createElement("div");
    wrapper.className = "hrs-inp-wrap";

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = String(datas.hours);
    input.step = "1";
    input.id = "h" + index;
    input.value = String(baseHours + (index < remainder ? 1 : 0));
    input.addEventListener("input", updTotal);

    const unit = document.createElement("span");
    unit.className = "hrs-lbl";
    unit.textContent = "hrs";

    wrapper.append(input, unit);
    div.append(label, wrapper);
    container.appendChild(div);
  });

  updTotal();
}

function updTotal() {
  let total = 0;

  datas.subjects.forEach((subject, index) => {
    const input = document.getElementById("h" + index);

    if (input) {
      total += Math.max(0, Number(input.value) || 0);
    }
  });

  const element = document.getElementById("tAssigned");

  element.textContent = total;

  element.className = "t-num " + (total === datas.hours ? "ok" : "over");
}

// ─── RENDER STUDY PLAN ───

function renderPlan(text) {
  lastRawText = text;

  document.getElementById("resultActions").style.display = "flex";

  const box = document.getElementById("resultBox");

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const dayPattern =
    /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):/i;

  let html = `
        <div class="plan-header">
            <h2>🗓️ ${escapeHtml(datas.name)}'s Study Plan</h2>
            <p>${datas.hours} hours · ${datas.subjects.length} subjects</p>
        </div>
    `;

  let currentSection = null;
  let sectionContent = [];

  function flushSection() {
    if (!currentSection && sectionContent.length === 0) {
      return;
    }

    if (currentSection) {
      html += `
                <div class="plan-section">
                    <div class="section-title">
                        ${escapeHtml(currentSection)}
                    </div>
            `;
    }

    sectionContent.forEach((line) => {
      const safeLine = escapeHtml(line);

      if (dayPattern.test(line)) {
        const colon = line.indexOf(":");
        const dayName = line.slice(0, colon);
        const dayBody = line.slice(colon + 1).trim();

        html += `
                    <div class="day-card">
                        <div class="day-name">
                            ${escapeHtml(dayName)}
                        </div>
                        <div class="day-content">
                            ${escapeHtml(dayBody)}
                        </div>
                    </div>
                `;
      } else if (/^[-•*►▸→]\s/.test(line)) {
        html += `
                    <div class="tip-card">
                        <span class="tip-ico">💡</span>
                        <span>${safeLine.replace(/^[-•*►▸→]\s*/, "")}</span>
                    </div>
                `;
      } else if (/motivat|great job|believe|success|keep going/i.test(line)) {
        html += `
                    <div class="motivation-card">${safeLine}</div>
                `;
      } else {
        html += `
                    <div class="tip-card">
                        <span class="tip-ico">📌</span>
                        <span>${safeLine}</span>
                    </div>
                `;
      }
    });

    if (currentSection) {
      html += "</div>";
    }

    sectionContent = [];
  }

  lines.forEach((line) => {
    const isHeader =
      (line.endsWith(":") && line.length < 60 && !dayPattern.test(line)) ||
      (line.startsWith("**") && line.endsWith("**")) ||
      /^#+\s/.test(line);

    if (isHeader) {
      flushSection();

      currentSection = line
        .replace(/^#+\s*/, "")
        .replace(/\*\*/g, "")
        .replace(/:$/, "");
    } else {
      sectionContent.push(line);
    }
  });

  flushSection();

  box.innerHTML = html;
}

// ─── COPY PLAN ───

function copyPlan() {
  if (!lastRawText) return;

  const copyText = () => {
    const button = document.getElementById("copyBtn");

    button.textContent = "Copied!";
    button.classList.add("copied");

    setTimeout(() => {
      button.textContent = "Copy Plan";
      button.classList.remove("copied");
    }, 2000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(lastRawText)
      .then(copyText)
      .catch(() => fallbackCopy());
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const textarea = document.createElement("textarea");
    textarea.value = lastRawText;

    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      copyText();
    } catch (error) {
      alert("Could not copy the plan. Please copy it manually.");
    }

    textarea.remove();
  }
}

// ─── LOCAL STUDY PLAN GENERATOR ───

function generate() {
  let total = 0;
  const allocations = {};

  datas.subjects.forEach((subject, index) => {
    const input = document.getElementById("h" + index);
    const hours = Number(input?.value) || 0;

    if (hours < 0 || !Number.isFinite(hours)) {
      total = -1;
      return;
    }

    allocations[subject] = hours;
    total += hours;
  });

  if (total !== datas.hours) {
    document.getElementById("e3").style.display = "flex";
    return;
  }

  document.getElementById("e3").style.display = "none";

  goPane(4);

  document.getElementById("resultActions").style.display = "none";

  document.getElementById("resultBox").innerHTML = `
        <div class="loading">
            <div class="loading-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="loading-text">
                Building your study plan locally ✨
            </div>
        </div>
    `;

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const subjects = datas.subjects
    .map((name) => ({
      name,
      hours: allocations[name] || 0,
    }))
    .filter((subject) => subject.hours > 0);

  if (!subjects.length) {
    document.getElementById("resultBox").textContent =
      "Please assign at least one hour to a subject.";
    return;
  }

  const dailySchedule = days.map(() => []);
  const weeklySessions = [];

  // Split subject time into sessions of up to 60 minutes.
  subjects.forEach((subject) => {
    let remainingMinutes = Math.round(subject.hours * 60);

    while (remainingMinutes > 0) {
      const sessionMinutes = Math.min(60, remainingMinutes);

      weeklySessions.push({
        name: subject.name,
        minutes: sessionMinutes,
      });

      remainingMinutes -= sessionMinutes;
    }
  });

  // Spread sessions across the week.
  weeklySessions.forEach((session, index) => {
    const dayIndex = index % days.length;
    dailySchedule[dayIndex].push(session);
  });

  const lines = [
    `${datas.name}'s Weekly Study Plan:`,
    `Total study time: ${datas.hours} hours`,
    `Number of subjects: ${datas.subjects.length}`,
    "",
    "Weekly Schedule:",
  ];

  days.forEach((day, index) => {
    lines.push(`${day}:`);

    const sessions = dailySchedule[index];

    if (sessions.length === 0) {
      lines.push("- Rest day or optional 15-minute review.");
      return;
    }

    sessions.forEach((session) => {
      lines.push(
        `- ${session.name}: ${session.minutes} minutes of focused study.`,
      );

      lines.push("- Take a 5–10 minute break between study sessions.");
    });

    lines.push("- Finish with a 10-minute review of what you learned.");
  });

  lines.push("", "Study Tips:");

  subjects.forEach((subject) => {
    lines.push(
      `- ${subject.name}: review the lesson, then solve practice questions.`,
    );
  });

  lines.push(
    "- Put your phone away to avoid distractions.",
    "- Use 25–50 minute focus sessions followed by short breaks.",
    "- Review difficult topics the next day.",
    "- Keep track of questions you could not answer.",
  );

  lines.push("", "Motivation:");

  lines.push(
    `- Keep going, ${datas.name}! Small, consistent steps lead to progress. 💪`,
  );

  const planText = lines.join("\n");

  setTimeout(() => {
    renderPlan(planText);
  }, 250);
}

// ─── RESET ───

function reset() {
  datas = {
    name: "",
    hours: 0,
    subjects: [],
  };

  lastRawText = "";

  document.getElementById("iName").value = "";
  document.getElementById("iHours").value = "";

  document.getElementById("subjList").innerHTML = `
        <div class="subj-row">
            <input
                type="text"
                class="si"
                placeholder="Subject name"
            />
            <button class="rm-btn" onclick="rmSubj(this)">×</button>
        </div>
    `;

  goPane(0);
}

// ─── INITIALIZE ───

loadSaved();

document.getElementById("iName").addEventListener("keydown", (event) => {
  if (event.key === "Enter") s1();
});

document.getElementById("iHours").addEventListener("keydown", (event) => {
  if (event.key === "Enter") s2();
});
