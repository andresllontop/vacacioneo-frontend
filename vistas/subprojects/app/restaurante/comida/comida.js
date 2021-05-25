var beanPaginationComida;
var comidaSelected;
var beanRequestComida = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestComida.entity_api = 'comida';
    beanRequestComida.operation = 'paginate';
    beanRequestComida.type_request = 'GET';

    $('#sizePageComida').change(function () {
        beanRequestComida.type_request = 'GET';
        beanRequestComida.operation = 'paginate';
        $('#modalCargandoComida').modal('show');
    });

    $('#modalCargandoComida').modal('show');

    $("#modalCargandoComida").on('shown.bs.modal', function () {
        processAjaxComida();
    });

    $("#ventanaModalManComida").on('hide.bs.modal', function () {
        beanRequestComida.type_request = 'GET';
        beanRequestComida.operation = 'paginate';
    });



    $("#btnAbrirbook").click(function () {
        beanRequestComida.operation = 'add';
        beanRequestComida.type_request = 'POST';
        $("#imagePreview").html("");
        $("#tituloModalManComida").html("REGISTRAR COMIDA");
        addComida();
        $("#ventanaModalManComida").modal("show");


    });
    $("#formularioComida").submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormComida()) {
            $('#modalCargandoComida').modal('show');
        }
    });

});

function processAjaxComida() {
    let form_data = new FormData();

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestComida.operation == 'update' ||
        beanRequestComida.operation == 'add'
    ) {

        json = {
            idComida: null,
            nombre: document.querySelector("#txtNombreComida").value,
            direccion: document.querySelector("#txtDireccionComida").value,
            facebook: document.querySelector("#txtFacebookComida").value,
            email: document.querySelector("#txtEmailComida").value,
            ciudad: { idCiudad: 1 },
            imagen: null

        };


    } else {
        form_data = null;
    }

    switch (beanRequestComida.operation) {
        case 'delete':
            parameters_pagination = '/' + comidaSelected.idComida;
            break;

        case 'update':
            json.idComida = comidaSelected.idComida;

            if (document.querySelector("#txtImagenComida").files.length !== 0) {
                form_data.append("file", $("#txtImagenComida").prop("files")[0]);
            }
            form_data.append("comida", JSON.stringify(json));
            break;
        case 'add':


            form_data.append("file", $("#txtImagenComida").prop("files")[0]);
            form_data.append("comida", JSON.stringify(json));
            break;

        default:

            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=' + document.querySelector("#pageComida").value.trim();
            parameters_pagination +=
                '&size=' + document.querySelector("#sizePageComida").value.trim();
            break;
    }
    $.ajax({
        url: getHostAPI() + beanRequestComida.entity_api + "/" + beanRequestComida.operation +
            parameters_pagination,
        type: beanRequestComida.type_request,
        headers: {
            // 'Authorization': 'Bearer ' + Cookies.get("vacacioneo_token")
        },

        data: form_data,
        cache: false,
        contentType: ((beanRequestComida.operation == 'update' || beanRequestComida.operation == 'add') ? false : 'application/json; charset=UTF-8'),
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        $('#modalCargandoComida').modal('hide');
        if (beanCrudResponse.messageServer !== null) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                swal({
                    title: "Realizado",
                    text: "Acción realizada existosamente!",
                    type: "success",
                    timer: 800,
                    showConfirmButton: false
                });
                document.querySelector("#pageComida").value = 1;
                document.querySelector("#sizePageComida").value = 20;
                $('#ventanaModalManComida').modal('hide');
            } else {


                swal({
                    title: "Error",
                    text: beanCrudResponse.messageServer,
                    type: "warning",
                    timer: 1200,
                    showConfirmButton: false
                });
            }
        }
        if (beanCrudResponse.beanPagination !== null) {

            beanPaginationComida = beanCrudResponse.beanPagination;
            listaComida(beanPaginationComida);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoComida').modal("hide");
        console.log(errorThrown);

    });

}

function addComida(comida = undefined) {
    //LIMPIAR LOS CAMPOS

    document.querySelector('#txtNombreComida').value = (comida == undefined) ? '' : comida.nombre;
    document.querySelector('#txtDireccionComida').value = (comida == undefined) ? '' : comida.direccion;
    document.querySelector('#txtEmailComida').value = (comida == undefined) ? '' : comida.email;
    document.querySelector('#txtFacebookComida').value = (comida == undefined) ? '' : comida.facebook;


    if (comida != undefined) {
        if (comidaSelected.foto == null) {
            document.querySelector("#imagenPreview").innerHTML = ``;
        } else {
            document.querySelector("#imagenPreview").innerHTML = `<img width='244' alt='user-picture' class='img-responsive text-center' src='${getHostFrontEnd() + 'adjuntos/comida/IMAGENES/' + comida.foto}' />`;
        }

    } else {

        document.querySelector("#imagenPreview").innerHTML = "";
    }


    addViewArchivosPrevius();


}

function listaComida(beanPagination) {
    document.querySelector('#tbodyComida').innerHTML = '';
    document.querySelector('#titleManagerComida').innerHTML =
        '[ ' + beanPagination.countFilter + ' ] COMIDAS';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationComida'));
        row += `<tr>
        <td class="text-center" colspan="6">NO HAY COMIDAS</td>
        </tr>`;

        document.querySelector('#tbodyComida').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyComida').innerHTML += row;
    let html2;
    beanPagination.list.forEach((comida) => {

        row += `<tr  idComida="${comida.idComida}">
<td class="text-center">${comida.ciudad.departamento.nombre}</td>
<td class="text-center">${comida.ciudad.nombre}</td>
<td class="text-center">${comida.nombre}</td>
<td class="text-center">${comida.direccion}</td>
<td class="text-center">${comida.email}</td>
<td class="text-center">${comida.facebook}</td>
<td class="text-center">${comida.imagen == null ? '' : "<img style='width: 53px;' alt='user-picture' class='img-responsive center-box' src='" + getHostFrontEnd() + "resources/img/COMIDAS/" + comida.imagen + "'"}</td>
<td class="text-center">
<button class="btn btn-info editar-comida" ><i class="fa fa-edit"></i> </button>
</td>
<td class="text-center">
<button class="btn btn-danger eliminar-comida"><i class="fa fa-trash"></i></button>
</td>
</tr>`;

        // $('[data-toggle="tooltip"]').tooltip();
    });
    document.querySelector('#tbodyComida').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(document.querySelector("#sizePageComida").value),
        document.querySelector("#pageComida"),
        $('#modalCargandoComida'),
        $('#paginationComida'));
    addEventsButtonsComida();


}

function addEventsButtonsComida() {


    document.querySelectorAll('.editar-comida').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            comidaSelected = findByComida(
                btn.parentElement.parentElement.getAttribute('idComida')
            );

            if (comidaSelected != undefined) {
                addComida(comidaSelected);
                $("#tituloModalManComida").html("EDITAR COMIDA");
                $("#ventanaModalManComida").modal("show");
                beanRequestComida.type_request = 'PUT';
                beanRequestComida.operation = 'update';
            } else {
                console.log(
                    'warning',
                    'No se encontró el Almacen para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-comida').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            //   $('[data-toggle="tooltip"]').tooltip("hide");
            comidaSelected = findByComida(
                btn.parentElement.parentElement.getAttribute('idComida')
            );

            if (comidaSelected != undefined) {
                beanRequestComida.type_request = 'DELETE';
                beanRequestComida.operation = 'delete';
                $('#modalCargandoComida').modal('show');
            } else {
                console.log(
                    'warning',
                    'No se encontró el registro para poder editar'
                );
            }
        };
    });
}


function addViewArchivosPrevius() {

    $("#txtImagenComida").change(function () {
        filePreview(this, "#imagenPreview");
    });

}
function filePreview(input, imagen) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        imagen;
        reader.onload = function (e) {
            $(imagen).html(
                "<img style='width:200px' alt='user-picture' class='img-responsive center-box' src='" +
                e.target.result +
                "' />"
            );
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function findIndexComida(idbusqueda) {
    return beanPaginationComida.list.findIndex(
        (Comida) => {
            if (Comida.idComida == parseInt(idbusqueda))
                return Comida;


        }
    );
}

function findByComida(idComida) {
    return beanPaginationComida.list.find(
        (Comida) => {
            if (parseInt(idComida) == Comida.idComida) {
                return Comida;
            }


        }
    );
}
var validateFormComida = () => {
    if (document.querySelector("#txtNombreComida").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Nombre",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtDireccionComida").value == "") {
        swal({
            title: "Vacío",
            text: "Escribe Dirección",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtEmailComida").value == "") {
        swal({
            title: "Vacío",
            text: "Escribe el email ",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }

    if (document.querySelector("#txtFacebookComida").value == "") {
        swal({
            title: "Vacío",
            text: "Escribe el Facebook ",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }

    if (beanRequestComida.operation == 'add') {


        if (document.querySelector("#txtImagenComida").files.length == 0) {
            swal({
                title: "Vacío",
                text: "Ingrese Imagen",
                type: "warning",
                timer: 1200,
                showConfirmButton: false
            });
            return false;
        }
        if (!(document.querySelector("#txtImagenComida").files[0].type == "image/png" || document.querySelector("#txtImagenComida").files[0].type == "image/jpg" || document.querySelector("#txtImagenComida").files[0].type == "image/jpeg")) {
            swal({
                title: "Formato Incorrecto",
                text: "Ingrese formato png, jpeg y jpg",
                type: "warning",
                timer: 1200,
                showConfirmButton: false
            });
            return false;
        }
        //menor a   4 MB
        if (document.querySelector("#txtImagenComida").files[0].size > (4 * 1024 * 1024)) {
            swal({
                title: "Tamaño excedido",
                text: "el tamaño del archivo tiene que ser menor a 4 MB",
                type: "warning",
                timer: 1200,
                showConfirmButton: false
            });
            return false;
        }
    } else {


        if (document.querySelector("#txtImagenComida").files.length != 0) {
            if (document.querySelector("#txtImagenComida").files.length == 0) {
                swal({
                    title: "Vacío",
                    text: "Ingrese Imagen",
                    type: "warning",
                    timer: 1200,
                    showConfirmButton: false
                });
                return false;
            }
            if (!(document.querySelector("#txtImagenComida").files[0].type == "image/png" || document.querySelector("#txtImagenComida").files[0].type == "image/jpg" || document.querySelector("#txtImagenComida").files[0].type == "image/jpeg")) {
                swal({
                    title: "Formato Incorrecto",
                    text: "Ingrese formato png, jpeg y jpg",
                    type: "warning",
                    timer: 1200,
                    showConfirmButton: false
                });
                return false;
            }
            //menor a   4 mb
            if (document.querySelector("#txtImagenComida").files[0].size > (4 * 1024 * 1024)) {
                swal({
                    title: "Tamaño excedido",
                    text: "el tamaño del archivo tiene que ser menor a 4 MB",
                    type: "warning",
                    timer: 1200,
                    showConfirmButton: false
                });
                return false;
            }
        }


    }

    return true;
}