function file(){
    document.getElementById('file').click();
    var photo =  document.getElementsByClassName('photo');
    
    if (photo.Id == 'photo') {
        photo[0].style.fill = 'red';
    }
};

function change_color(btn){
    var button = document.getElementsByClassName(btn);
    button[0].style['background-color'] = "red";
};