function welcomeOffAnimation (){
    var welcome = document.getElementById('welcome');
    welcome.classList.add('animated');
    welcome.classList.add('fadeOut');
    welcomeOff();

}

function welcomeOff (){
    setTimeout(function() {
        var welcome = document.getElementById('welcome');
        welcome.style.display = 'none';

        var authentication = document.getElementById('authentication');
        authentication.classList.add('animated');
        authentication.classList.add('fadeIn');
        document.getElementById('authentication').style.display = 'block';  }, 1000);


}

