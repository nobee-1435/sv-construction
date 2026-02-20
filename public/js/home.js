
const btn = document.getElementById("menuBtn");
const menu = document.getElementById("sideMenu");

btn.onclick = () => {
  menu.classList.toggle("show");
}

btn.onclick = () => {
  menu.classList.toggle("show");
};

/* close menu when link clicked */
document.querySelectorAll("#sideMenu a").forEach(link=>{
  link.addEventListener("click", ()=>{
    menu.classList.remove("show");
  });
});

const slides = document.getElementById("slides");
const total = slides.children.length;

let index = 0;

/* AUTO SLIDE */
function moveSlide(){
    index++;
    if(index >= total) index = 0;
    slides.style.transform = `translateX(-${index*100}%)`;
}
setInterval(moveSlide,3000);


/* TOUCH SWIPE */
let startX = 0;

slides.addEventListener("touchstart",e=>{
    startX = e.touches[0].clientX;
});

slides.addEventListener("touchend",e=>{
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if(diff > 50){
        index = Math.min(index+1,total-1);
    }
    else if(diff < -50){
        index = Math.max(index-1,0);
    }

    slides.style.transform = `translateX(-${index*100}%)`;
});


/* SECOND SLIDER */
const slides2 = document.getElementById("slides2");
const total2 = slides2.children.length;

let index2 = 0;

/* AUTO SLIDE */
function moveSlide2(){
    index2++;
    if(index2 >= total2) index2 = 0;
    slides2.style.transform = `translateX(-${index2*100}%)`;
}
setInterval(moveSlide2,3000);


/* TOUCH SWIPE */
let startX2 = 0;

slides2.addEventListener("touchstart",e=>{
    startX2 = e.touches[0].clientX;
});

slides2.addEventListener("touchend",e=>{
    let endX2 = e.changedTouches[0].clientX;
    let diff2 = startX2 - endX2;

    if(diff2 > 50){
        index2 = Math.min(index2+1,total2-1);
    }
    else if(diff2 < -50){
        index2 = Math.max(index2-1,0);
    }

    slides2.style.transform = `translateX(-${index2*100}%)`;
});

const section = document.querySelector(".office-info");

window.addEventListener("scroll", () => {
  const rect = section.getBoundingClientRect();

  if(rect.top < window.innerHeight - 100){
    section.classList.add("show");
  }
});