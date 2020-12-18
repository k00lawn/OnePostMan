// facebook.onclick = function() {

//     if( facebook.id == 'selected' ) {
//         console.log(facebook.className)
//         facebook.id = '';
//     }

//     else {
//         console.log(facebook.className)
//         facebook.id = 'selected';
//     }
// };


function light_up(btn) {

    var button = document.getElementsByClassName(btn)

    if( button.id == 'selected' ) {
        console.log(`${btn} is now not selected`)
        button.id = '';
    }

    else {
        console.log(`${btn} is selected`)
        button.id = 'selected';
    }
};

function test() {
    var btn = document.getElementsByClassName('testing');

    if (btn[0].id == 'tt') {
        btn[0].innerHTML = 'blue';
        btn[0].id = '';
    } 
    else {
        btn[0].innerHTML = 'post now';
        btn[0].id = 'tt';
        btn[0].style.color = 'black';
        btn[0].style.backgroundColor = 'grey';
        btn[0].style.filter = 'greyscale(100%)';
    }
}   