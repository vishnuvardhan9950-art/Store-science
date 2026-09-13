(() => {
"use strict";

const PROFILE_KEY = "storeScienceProfile";
const SUBJECTS = [
  ["⚛️","Physics","Your Physics study files"],
  ["🧪","Chemistry","Your Chemistry study files"],
  ["📐","Mathematics","Your Mathematics study files"],
  ["💻","Computer Science","Your Computer Science study files"],
  ["🧬","Biology","Your Biology study files"]
];

const $ = id => document.getElementById(id);
const show = el => { if (el) el.classList.remove("hidden"); };
const hide = el => { if (el) el.classList.add("hidden"); };

function profile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"); }
  catch { return null; }
}

function setAvatar(gender) {
  const face = gender === "female" ? "👩🏻‍🎓" : "👨🏻‍🎓";
  if ($("avatarFace")) $("avatarFace").textContent = face;
  if ($("modalAvatar")) $("modalAvatar").textContent = face;
}

function renderSubjects(query = "") {
  const grid = $("subjects");
  if (!grid) return;
  const q = query.trim().toLowerCase();
  const matches = SUBJECTS.filter(s => s.join(" ").toLowerCase().includes(q));
  grid.innerHTML = matches.map(([icon,name,desc]) =>
    '<button type="button" class="subject" data-subject="'+name+'">'+
    '<div class="emoji">'+icon+'</div><h4>'+name+'</h4><p>'+desc+'</p><div class="arrow">→</div></button>'
  ).join("");
  grid.querySelectorAll(".subject").forEach(card =>
    card.addEventListener("click", () => openSubject(card.dataset.subject))
  );
  if ($("count")) $("count").textContent = matches.length + " subject" + (matches.length === 1 ? "" : "s");
}

function openSubject(name) {
  hide($("homeSubjects"));
  if (document.querySelector(".tools")) document.querySelector(".tools").style.display = "none";
  show($("subjectPage"));
  if ($("subjectName")) $("subjectName").textContent = name;
}

function goHome() {
  hide($("subjectPage"));
  show($("homeSubjects"));
  if (document.querySelector(".tools")) document.querySelector(".tools").style.display = "";
  renderSubjects($("search")?.value || "");
}

function openProfile() {
  const p = profile();
  if (!p) return;
  if ($("detailName")) $("detailName").textContent = p.name || "—";
  if ($("detailAge")) $("detailAge").textContent = p.age || "—";
  if ($("detailGender")) $("detailGender").textContent = p.gender === "female" ? "Female" : "Male";
  if ($("detailClass")) $("detailClass").textContent = "Class " + (p.studentClass || "11");
  if ($("modalName")) $("modalName").textContent = p.name || "Student";
  if ($("modalClass")) $("modalClass").textContent = "Class " + (p.studentClass || "11");
  setAvatar(p.gender);
  show($("profileModal"));
}

function saveProfile() {
  const p = {
    name: $("loginName")?.value.trim(),
    age: $("loginAge")?.value,
    gender: $("loginGender")?.value,
    studentClass: $("loginClass")?.value
  };
  if (!p.name || !p.age || !p.gender || !p.studentClass) {
    alert("Please complete all profile details.");
    return;
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  if ($("userName")) $("userName").textContent = "Hi, " + p.name;
  if ($("welcomeText")) $("welcomeText").textContent = "Welcome back, " + p.name + ". Keep learning and keep growing.";
  setAvatar(p.gender);
  hide($("loginScreen"));
  show($("site"));
  goHome();
}

function editProfile() {
  const p = profile();
  if (!p) return;
  $("loginName").value = p.name || "";
  $("loginAge").value = p.age || "";
  $("loginGender").value = p.gender || "";
  $("loginClass").value = p.studentClass || "";
  hide($("profileModal"));
  hide($("site"));
  show($("loginScreen"));
}

function logout() {
  localStorage.removeItem(PROFILE_KEY);
  hide($("profileModal"));
  hide($("site"));
  show($("loginScreen"));
  $("loginName").value = "";
  $("loginAge").value = "";
  $("loginGender").value = "";
  $("loginClass").value = "";
}

function applyStoredProfile() {
  const p = profile();
  if (!p) {
    hide($("site"));
    show($("loginScreen"));
    return;
  }
  if ($("userName")) $("userName").textContent = "Hi, " + p.name;
  if ($("welcomeText")) $("welcomeText").textContent = "Welcome back, " + p.name + ". Keep learning and keep growing.";
  setAvatar(p.gender);
  hide($("loginScreen"));
  show($("site"));
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  if ($("themeBtn")) $("themeBtn").textContent = dark ? "☀" : "☾";
  localStorage.setItem("storeScienceTheme", dark ? "dark" : "light");
}

function makeMCQs() {
  const subject = $("mcqSubject")?.value || "Physics";
  const questions = {
    Physics:["Which law relates force, mass and acceleration?","What is the SI unit of work?","What does velocity measure?"],
    Chemistry:["What is atomic number?","Which particle has a negative charge?","What is Avogadro's constant?"],
    Mathematics:["What is the domain of a function?","What is sin²θ + cos²θ?","What is a quadratic equation?"],
    "Computer Science":["What does CPU stand for?","What is an algorithm?","What is a variable?"],
    Biology:["What is the basic unit of life?","Which organelle is called the powerhouse of the cell?","What is photosynthesis?"]
  }[subject];
  if ($("mcqOutput")) $("mcqOutput").innerHTML =
    '<div class="answer"><b>Practice set — '+subject+'</b><ol>'+
    Array.from({length:10},(_,i)=>'<li>'+questions[i % questions.length]+'</li>').join("")+
    '</ol></div>';
}

function init() {
  // Every listener is registered only after the HTML is ready.
  $("loginBtn")?.addEventListener("click", saveProfile);
  $("profileBtn")?.addEventListener("click", openProfile);
  $("profileClose")?.addEventListener("click", () => hide($("profileModal")));
  $("editProfile")?.addEventListener("click", editProfile);
  $("logoutBtn")?.addEventListener("click", logout);
  $("themeBtn")?.addEventListener("click", toggleTheme);
  $("search")?.addEventListener("input", e => renderSubjects(e.target.value));
  $("backBtn")?.addEventListener("click", goHome);
  $("aiBtn")?.addEventListener("click", () => show($("modal")));
  $("close")?.addEventListener("click", () => hide($("modal")));
  $("mcqBtn")?.addEventListener("click", makeMCQs);

  $("profileModal")?.addEventListener("click", e => {
    if (e.target === $("profileModal")) hide($("profileModal"));
  });
  $("modal")?.addEventListener("click", e => {
    if (e.target === $("modal")) hide($("modal"));
  });

  if (localStorage.getItem("storeScienceTheme") === "dark") {
    document.body.classList.add("dark");
    if ($("themeBtn")) $("themeBtn").textContent = "☀";
  }

  renderSubjects();
  if ($("fileTotal")) $("fileTotal").textContent = "0";
  if ($("mcqTotal")) $("mcqTotal").textContent = "0";
  if ($("bestScore")) $("bestScore").textContent = "—";
  applyStoredProfile();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
})();