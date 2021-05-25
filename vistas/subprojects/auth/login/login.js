document.addEventListener('DOMContentLoaded', function () {


    $('#FrmLogin').submit(function (event) {

        try {
            if (true) {


                $('#modalCargandoLogin').modal('show');
            }
        } catch (e) {
            console.log(e);
        }
        event.preventDefault();
        event.stopPropagation();
    });
    $('#modalCargandoLogin').on('shown.bs.modal', function () {
        processAjaxAuth();
    });





});

function processAjaxAuth() {

    let datosSerializados = $('#FrmLogin').serialize();
    // console.log(datosSerializados);
    $.ajax({
        url: getHostAPI() + 'authentication/login',
        type: 'POST',
        data: datosSerializados,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json'

    })
        .done(function (jsonResponse) {
            $('#modalCargandoLogin').modal('hide');
            console.log(jsonResponse);

            if (jsonResponse.message_server == "ok") {
                setCookieSession(jsonResponse.token, jsonResponse.usuario);
                sendIndex();
            } else {

            }

        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
}


var validarFormularioLogin = () => {

    let email = email_campo(
        document.querySelector('#txtUsername')
    );

    if (email != undefined) {
        if (email.value == '') {
            swal({
                title: "vacío!",
                text: "Por favor ingrese Correo electrónico",
                type: "warning",
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            swal({
                title: "Formato Incorrecto!",
                text: "Por favor ingrese Correo electrónico válida",
                type: "warning",
                timer: 3000,
                showConfirmButton: false
            });
        }

        return false;
    }

    if (limpiar_campo(document.querySelector("#txtPass").value) == "") {
        swal({
            title: "Formato Incorrecto",
            text: "Ingrese Contraseña válida",
            type: "warning",
            timer: 3000,
            showConfirmButton: false
        });
        return false;
    }

    return true;
}


