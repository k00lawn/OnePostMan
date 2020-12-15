
const card = document.querySelector('.card')
const container = document.querySelector('.container')

//animating inside the card 

const title = document.querySelector('.title')
const facebook = document.querySelector('.facebook img')
const desc = document.querySelector('.info h4')
const login = document.querySelector('.login button')

// animation event 

container.addEventListener("mousemove" , (e) => {

    let xaxis = (window.innerWidth /2 - e.pageX) / 10;
    let yaxis = (window.innerHeight /2 - e.pageY) / 10;
    card.style.transform = `rotateX(${yaxis}deg) rotateY(${xaxis}deg)` ;

});

//animate in 

container.addEventListener('mouseenter', e => {
    card.style.transition = 'none';

    //extra
    title.style.transform = 'translateZ(60px)'
    facebook.style.transform = 'translateZ(60px)'
    desc.style.transform = 'translateZ(60px)'
    login.style.transform = 'translateZ(60px)'
});

// go back to original position after moving out of the container

container.addEventListener('mouseleave' , (e) => {
    card.style.transition = 'all 0.5s ease';
    card.style.transform = `rotateY(0deg) rotateX(0deg)`

    //extra
    title.style.transform = 'translateZ(0px)'
    facebook.style.transform = 'translateZ(0px)'
    desc.style.transform = 'translateZ(0px)'
    login.style.transform = 'translateZ(0px)'
});

