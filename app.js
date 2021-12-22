let controller;
let pageScene;
let slideScene;
let detailScene;
const logo = document.querySelector("#logo");
const mouse = document.querySelector(".cursor");
function animateHome() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide,index,slides)=>{
    const slideTl = gsap.timeline({defaults:{duration:1, ease: "power2.inOut"}});
    const img = slide.querySelector("img");
    const revealImg = slide.querySelector(".reveal-img");
    const revealTxt = slide.querySelector(".reveal-text");
    slideTl.fromTo(revealImg, {x: "0%"}, {x:"100%"});
    slideTl.fromTo(img, {scale:2}, {scale:1}, "-=0.75");
    slideTl.fromTo(revealTxt, {x: "0%"}, {x:"100%"}, "-=0.5");
  slideScene = new ScrollMagic.Scene({
    triggerElement: slide,
    triggerHook: 0.25,
    reverse: false
  })
  .setTween(slideTl)
  .addTo(controller);
  const pageTl = gsap.timeline();
  let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
  pageTl.fromTo(nextSlide, {y: "0%"}, {y: "50%"});
  pageTl.fromTo(slide, {opacity:1, scale:1}, {opacity:0, scale: 0.5});
  pageTl.fromTo(nextSlide, {y: "50%"}, {y: "0%"}, "-=0.5");
  pageScene = new ScrollMagic.Scene({
    triggerElement:slide,
    duration: "100%",
    triggerHook: 0
  }).setPin(slide, {pushFollowers:false})
  .setTween(pageTl)
  .addIndicators()
  .addTo(controller)
});
}
window.addEventListener("mousemove", cursorFunc);
window.addEventListener("mouseover", hoverFunc);
function hoverFunc(e) {
  if(e.target.classList.contains("burger") || e.target.id === "logo") {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if(e.target.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, {y:"0%"}, {y: "100%"});
    mouse.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, {y:"100%"}, {y: "0%"});
    mouse.innerText = "";
    
  }
}
function navToggle(e) {
  if(!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, {rotate: "45", y:5, background:"black"});
    gsap.to(".line2", 0.5, {rotate: "-45", y:-5, background:"black"});
    gsap.to("#logo", 1, {color:"black"});
    gsap.to(".nav-bar", 1, {clipPath: "circle(2500px at 100% -10%)"});
    document.body.classList.add("hide")
  }
  else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, {rotate: "0", y:0, background:"white"});
    gsap.to(".line2", 0.5, {rotate: "0", y:0, background:"white"});
    gsap.to("#logo", 1, {color:"white"});
    gsap.to(".nav-bar", 1, {clipPath: "circle(50px at 100% -10%)"});
    document.body.classList.remove("hide")
  }
}
function cursorFunc(e) {
  mouse.style.top = e.pageY+"px";
  mouse.style.left = e.pageX+"px";
}
const burger = document.querySelector(".burger");
burger.addEventListener("click", navToggle);
function animateFash() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides)=>{
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    const timeLine = gsap.timeline();
    timeLine.fromTo(nextSlide,1,{y:"0%"}, {y:"50%"});
    timeLine.fromTo(slide,1,{opacity:1},{opacity:0});
    timeLine.fromTo(nextSlide,1,{y:"50%"}, {y:"0%"});
    timeLine.fromTo(nextImg,1,{opacity:0, x:"100%"}, {opacity:1, x:"0%"}, "-=0.5");
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration:"100%",
      triggerHook: 0
    }).setPin(slide,{pushFollowers:false})
    .setTween(timeLine)
    .addIndicators()
    .addTo(controller);
  });
}
barba.init({
  views:[{
    namespace:"home",
    beforeEnter() {
      animateHome();
      logo.href="index.html";
    },
    beforeLeave() {
      controller.destroy();
    }
  },
  {
    namespace:"fashion",
    beforeEnter() {
      window.scrollTo(0,0);
      animateFash();
      logo.href="../index.html";
    },
    beforeLeave() {
    }
  }],
  transitions: [{
    leave({current, next}) {
      let done = this.async();
      const timeLine = gsap.timeline();
      timeLine.fromTo(current.container,1, {opacity:1}, {opacity:0});
      timeLine.fromTo(".swipe", 0.5, {x:"-100%"}, {x:"0%", stagger:0.2, onComplete: done});
    },
    enter({current, next}) {
      let done = this.async();
      const timeLine = gsap.timeline();
      timeLine.fromTo(next.container,1, {opacity:0}, {opacity:1});
      timeLine.fromTo(".swipe", 0.5, {x:"0%"}, {x:"100%",stagger:0.2, onComplete: done}, "-=0.5");
    }
  }]
});