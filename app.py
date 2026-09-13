from pyscript import document, window

SUBJECTS = [
    ("⚛️", "Physics", "Your Physics study files"),
    ("🧪", "Chemistry", "Your Chemistry study files"),
    ("📐", "Mathematics", "Your Mathematics study files"),
    ("💻", "Computer Science", "Your Computer Science study files"),
    ("🧬", "Biology", "Your Biology study files"),
]

def stats():
    document.getElementById("fileTotal").textContent = "0"
    document.getElementById("mcqTotal").textContent = "0"
    document.getElementById("bestScore").textContent = "—"

def open_subject(name):
    document.getElementById("homeSubjects").style.display = "none"
    document.querySelector(".tools").style.display = "none"
    page = document.getElementById("subjectPage")
    page.classList.remove("hidden")
    page.style.display = "block"
    document.getElementById("subjectName").textContent = name

def render(query=""):
    query = query.lower().strip()
    grid = document.getElementById("subjects")
    grid.innerHTML = ""
    matches = [s for s in SUBJECTS if query in " ".join(s).lower()]
    for icon, name, desc in matches:
        card = document.createElement("button")
        card.className = "subject"
        card.type = "button"
        card.innerHTML = f'<div class="emoji">{icon}</div><h4>{name}</h4><p>{desc}</p><div class="arrow">→</div>'
        card.addEventListener("click", lambda event, n=name: open_subject(n))
        grid.appendChild(card)
    document.getElementById("count").textContent = f"{len(matches)} subject" + ("" if len(matches) == 1 else "s")

def go_home(event=None):
    document.getElementById("subjectPage").classList.add("hidden")
    document.getElementById("subjectPage").style.display = "none"
    document.getElementById("homeSubjects").style.display = "block"
    document.querySelector(".tools").style.display = "block"
    render()

def toggle_theme(event=None):
    body = document.body
    body.classList.toggle("dark")
    document.getElementById("themeBtn").textContent = "☀" if body.classList.contains("dark") else "☾"

def close_ai(event=None):
    document.getElementById("modal").classList.add("hidden")

def open_ai(event=None):
    document.getElementById("modal").classList.remove("hidden")

def make_mcqs(event=None):
    subject = document.getElementById("mcqSubject").value
    questions = {
        "Physics": ["Which law relates force, mass and acceleration?", "What is the SI unit of work?", "What does velocity measure?"],
        "Chemistry": ["What is atomic number?", "Which particle has a negative charge?", "What is Avogadro’s constant?"],
        "Mathematics": ["What is the domain of a function?", "What is sin²θ + cos²θ?", "What is a quadratic equation?"],
        "Computer Science": ["What does CPU stand for?", "What is an algorithm?", "What is a variable?"],
        "Biology": ["What is the basic unit of life?", "Which organelle is called the powerhouse of the cell?", "What is photosynthesis?"],
    }[subject]
    output = document.getElementById("mcqOutput")
    output.innerHTML = "<div class='answer'><b>Practice set — " + subject + "</b><ol>" + "".join(
        f"<li>{questions[i % len(questions)]}</li>" for i in range(10)
    ) + "</ol></div>"

def search(event=None):
    render(event.target.value)

document.getElementById("themeBtn").addEventListener("click", toggle_theme)
document.getElementById("search").addEventListener("input", search)
document.getElementById("backBtn").addEventListener("click", go_home)
document.getElementById("aiBtn").addEventListener("click", open_ai)
document.getElementById("close").addEventListener("click", close_ai)
document.getElementById("modal").addEventListener("click", lambda event: close_ai() if event.target.id == "modal" else None)
document.getElementById("mcqBtn").addEventListener("click", make_mcqs)

render()
stats()