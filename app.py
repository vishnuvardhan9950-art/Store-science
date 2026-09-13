from pyscript import document, window
import json

KEY = "storeScienceProfile"

def get(id):
    return document.getElementById(id)

def set_visible(id, visible):
    el = get(id)
    if visible:
        el.classList.remove("hidden")
    else:
        el.classList.add("hidden")

def show_login():
    set_visible("loginScreen", True)
    set_visible("site", False)

def show_home():
    set_visible("loginScreen", False)
    set_visible("site", True)
    set_visible("profileModal", False)
    set_visible("subjectPage", False)
    set_visible("homeSubjects", True)
    document.querySelector(".tools").style.display = "block"

def save_profile(event=None):
    name = get("loginName").value.strip()
    age = get("loginAge").value
    gender = get("loginGender").value
    student_class = get("loginClass").value
    if not name or not age or not gender or not student_class:
        window.alert("Please complete all profile details.")
        return
    profile = {"name": name, "age": age, "gender": gender, "studentClass": student_class}
    window.localStorage.setItem(KEY, json.dumps(profile))
    get("userName").textContent = "Hi, " + name
    get("welcomeText").textContent = "Welcome back, " + name + ". Keep learning and keep growing."
    set_avatar(gender)
    show_home()

def set_avatar(gender):
    face = "👩🏻‍🎓" if gender == "female" else "👨🏻‍🎓"
    get("avatarFace").textContent = face
    get("modalAvatar").textContent = face

def open_profile(event=None):
    raw = window.localStorage.getItem(KEY)
    if not raw:
        show_login()
        return
    p = json.loads(raw)
    get("detailName").textContent = p.get("name", "—")
    get("detailAge").textContent = p.get("age", "—")
    get("detailGender").textContent = "Female" if p.get("gender") == "female" else "Male"
    get("detailClass").textContent = "Class " + p.get("studentClass", "11")
    get("modalName").textContent = p.get("name", "Student")
    get("modalClass").textContent = "Class " + p.get("studentClass", "11")
    set_avatar(p.get("gender", "male"))
    set_visible("profileModal", True)

def edit_profile(event=None):
    raw = window.localStorage.getItem(KEY)
    if not raw:
        show_login()
        return
    p = json.loads(raw)
    get("loginName").value = p.get("name", "")
    get("loginAge").value = p.get("age", "")
    get("loginGender").value = p.get("gender", "")
    get("loginClass").value = p.get("studentClass", "")
    set_visible("profileModal", False)
    show_login()

def logout(event=None):
    window.localStorage.removeItem(KEY)
    set_visible("profileModal", False)
    show_login()

SUBJECTS = [
    ("⚛️", "Physics", "Your Physics study files"),
    ("🧪", "Chemistry", "Your Chemistry study files"),
    ("📐", "Mathematics", "Your Mathematics study files"),
    ("💻", "Computer Science", "Your Computer Science study files"),
    ("🧬", "Biology", "Your Biology study files"),
]

def render(query=""):
    query = query.lower().strip()
    grid = get("subjects")
    grid.innerHTML = ""
    matches = [s for s in SUBJECTS if query in " ".join(s).lower()]
    for icon, name, desc in matches:
        card = document.createElement("button")
        card.type = "button"
        card.className = "subject"
        card.innerHTML = f'<div class="emoji">{icon}</div><h4>{name}</h4><p>{desc}</p><div class="arrow">→</div>'
        card.addEventListener("click", lambda event, n=name: open_subject(n))
        grid.appendChild(card)
    get("count").textContent = str(len(matches)) + " subject" + ("" if len(matches) == 1 else "s")

def open_subject(name):
    set_visible("homeSubjects", False)
    document.querySelector(".tools").style.display = "none"
    set_visible("subjectPage", True)
    get("subjectName").textContent = name

def go_home(event=None):
    show_home()
    render()

def toggle_theme(event=None):
    document.body.classList.toggle("dark")
    get("themeBtn").textContent = "☀" if document.body.classList.contains("dark") else "☾"

def open_ai(event=None):
    set_visible("modal", True)

def close_ai(event=None):
    set_visible("modal", False)

def make_mcqs(event=None):
    subject = get("mcqSubject").value
    questions = {
        "Physics": ["Which law relates force, mass and acceleration?", "What is the SI unit of work?", "What does velocity measure?"],
        "Chemistry": ["What is atomic number?", "Which particle has a negative charge?", "What is Avogadro's constant?"],
        "Mathematics": ["What is the domain of a function?", "What is sin²θ + cos²θ?", "What is a quadratic equation?"],
        "Computer Science": ["What does CPU stand for?", "What is an algorithm?", "What is a variable?"],
        "Biology": ["What is the basic unit of life?", "Which organelle is called the powerhouse of the cell?", "What is photosynthesis?"]
    }[subject]
    items = "".join(f"<li>{questions[i % len(questions)]}</li>" for i in range(10))
    get("mcqOutput").innerHTML = f"<div class='answer'><b>Practice set — {subject}</b><ol>{items}</ol></div>"

def stats():
    get("fileTotal").textContent = "0"
    get("mcqTotal").textContent = "0"
    get("bestScore").textContent = "—"

# Register every handler after the DOM exists.
get("loginBtn").addEventListener("click", save_profile)
get("profileBtn").addEventListener("click", open_profile)
get("profileClose").addEventListener("click", lambda event: set_visible("profileModal", False))
get("editProfile").addEventListener("click", edit_profile)
get("logoutBtn").addEventListener("click", logout)
get("themeBtn").addEventListener("click", toggle_theme)
get("search").addEventListener("input", lambda event: render(event.target.value))
get("backBtn").addEventListener("click", go_home)
get("aiBtn").addEventListener("click", open_ai)
get("close").addEventListener("click", close_ai)
get("mcqBtn").addEventListener("click", make_mcqs)

stored = window.localStorage.getItem(KEY)
if stored:
    try:
        p = json.loads(stored)
        get("userName").textContent = "Hi, " + p.get("name", "")
        get("welcomeText").textContent = "Welcome back, " + p.get("name", "") + ". Keep learning and keep growing."
        set_avatar(p.get("gender", "male"))
        show_home()
    except Exception:
        window.localStorage.removeItem(KEY)
        show_login()
else:
    show_login()

render()
stats()
