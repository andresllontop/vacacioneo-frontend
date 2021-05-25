
class BeanURL {
    constructor() {
        this.url = "";
        //this.type_perfil = "";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let user_session = Cookies.getJSON('vacacioneo_user');
    if (user_session != undefined) {
        var current_path = window.location.href;
        current_path = current_path.substring(getHostFrontEnd().length - 1, current_path.length);
        switch (parseInt(user_session.tipo_usuario)) {
            case 1:
                if (current_path.includes('app')) {
                    //VALIDAMOS SI TIENE HABILITADO ESTA URL
                    console.log("Url correcta");
                } else {
                    sendIndex();
                }
                break;
            case 2:
                if (current_path.includes('aula')) {
                    //VALIDAMOS SI TIENE HABILITADO ESTA URL
                    console.log("Url correcta");
                } else {

                    sendIndex();
                }
                break;
            default:
                sendIndex();
                break;
        }
    } else {
        sendIndex();
    }

});
