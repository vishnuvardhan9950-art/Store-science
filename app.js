const $=id=>document.getElementById(id);
const subjects=[
["⚛️","Physics","Your Physics study files"],
["🧪","Chemistry","Your Chemistry study files"],
["📐","Mathematics","Your Mathematics study files"],
["💻","Computer Science","Your Computer Science study files"],
["🧬","Biology","Your Biology study files"]
];
const grid=$("subjects"),home=$("homeSubjects"),subjectPage=$("subjectPage"),tools=document.querySelector(".tools"),aiModal=$("modal");

function stats(){$("fileTotal").textContent="0";$("mcqTotal").textContent="0";$("bestScore").textContent="—";}
function render(q=""){
 q=q.toLowerCase().trim();
 grid.innerHTML=subjects.filter(s=>s.join(" ").toLowerCase().includes(q)).map(s=>'<button type="button" class="subject" data-subject="'+s[1]+'"><div class="emoji">'+s[0]+'</div><h4>'+s[1]+'</h4><p>'+s[2]+'</p><div class="arrow">→</div></button>').join("");
 $("count").textContent=grid.children.length+" subject"+(grid.children.length===1?"":"s");
 grid.querySelectorAll(".subject").forEach(el=>el.addEventListener("click",()=>openSubject(el.dataset.subject)));
}
function openSubject(name){
 home.style.display="none";
 tools.style.display="none";
 subjectPage.classList.remove("hidden");
 subjectPage.style.display="block";
 $("subjectName").textContent=name;
}
$("themeBtn").addEventListener("click",()=>{
 document.body.classList.toggle("dark");
 $("themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾";
});
$("search").addEventListener("input",e=>render(e.target.value));
$("backBtn").addEventListener("click",()=>{
 subjectPage.classList.add("hidden");
 subjectPage.style.display="none";
 home.style.display="block";
 tools.style.display="block";
 render();
});
$("aiBtn").addEventListener("click",()=>aiModal.classList.remove("hidden"));
$("close").addEventListener("click",()=>aiModal.classList.add("hidden"));
aiModal.addEventListener("click",e=>{if(e.target===aiModal)aiModal.classList.add("hidden")});
$("mcqBtn").addEventListener("click",()=>{
 const sub=$("mcqSubject").value;
 const qs={
 Physics:["Which law relates force, mass and acceleration?","What is the SI unit of work?","What does velocity measure?"],
 Chemistry:["What is atomic number?","Which particle has a negative charge?","What is Avogadro’s constant?"],
 Mathematics:["What is the domain of a function?","What is sin²θ+cos²θ?","What is a quadratic equation?"],
 "Computer Science":["What does CPU stand for?","What is an algorithm?","What is a variable?"],
 Biology:["What is the basic unit of life?","Which organelle is called the powerhouse of the cell?","What is photosynthesis?"]
 }[sub];
 $("mcqOutput").innerHTML='<div class="answer"><b>Practice set — '+sub+'</b><ol>'+Array.from({length:10},(_,i)=>"<li>"+qs[i%qs.length]+"</li>").join("")+"</ol></div>";
});
render();stats();