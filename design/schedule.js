function light_up(btn) {

    var button = document.getElementsByClassName(btn)

    if( button.id == 'selected' ) {
        console.log(`${btn} is now not selected`)
        button.id = '';
        button[0].style.filter = 'grayscale(0.9)';
    }

    else {
        console.log(`${btn} is selected`)
        button.id = 'selected';
        button[0].style.filter = "none";
    }
};

 