var beanPaginationRestaurante;
var restauranteSelected;
var beanRequestRestaurante = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestRestaurante.entity_api = 'restaurante';
    beanRequestRestaurante.operation = 'paginate';
    beanRequestRestaurante.type_request = 'GET';

    $('#sizePageRestaurante').change(function () {
        beanRequestRestaurante.type_request = 'GET';
        beanRequestRestaurante.operation = 'paginate';
        $('#modalCargandoRestaurante').modal('show');
    });

    $('#modalCargandoRestaurante').modal('show');

    $("#modalCargandoRestaurante").on('shown.bs.modal', function () {
        processAjaxRestaurante();
    });

    $("#ventanaModalManRestaurante").on('hide.bs.modal', function () {
        beanRequestRestaurante.type_request = 'GET';
        beanRequestRestaurante.operation = 'paginate';
    });



    $("#btnAbrirbook").click(function () {
        beanRequestRestaurante.operation = 'add';
        beanRequestRestaurante.type_request = 'POST';
        $("#imagePreview").html("");
        $("#tituloModalManRestaurante").html("REGISTRAR RESTAURANTE");
        addRestaurante();
        $("#ventanaModalManRestaurante").modal("show");


    });
    $("#formularioRestaurante").submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormRestaurante()) {
            $('#modalCargandoRestaurante').modal('show');
        }
    });

});

function processAjaxRestaurante() {
    let form_data = new FormData();

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestRestaurante.operation == 'update' ||
        beanRequestRestaurante.operation == 'add'
    ) {

        json = {
            idRestaurante: null,
            nombre: document.querySelector("#txtNombreRestaurante").value,
            direccion: document.querySelector("#txtDireccionRestaurante").value,
            facebook: document.querySelector("#txtFacebookRestaurante").value,
            email: document.querySelector("#txtEmailRestaurante").value,
            ciudad: { idCiudad: 1 },
            imagen: null

        };


    } else {
        form_data = null;
    }

    switch (beanRequestRestaurante.operation) {
        case 'delete':
            parameters_pagination = '/' + restauranteSelected.idRestaurante;
            break;

        case 'update':
            json.idRestaurante = restauranteSelected.idRestaurante;

            if (document.querySelector("#txtImagenRestaurante").files.length !== 0) {
                form_data.append("file", $("#txtImagenRestaurante").prop("files")[0]);
            }
            form_data.append("restaurante", JSON.stringify(json));
            break;
        case 'add':


            form_data.append("file", $("#txtImagenRestaurante").prop("files")[0]);
            form_data.append("restaurante", JSON.stringify(json));
            break;

        default:

            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=' + document.querySelector("#pageRestaurante").value.trim();
            parameters_pagination +=
                '&size=' + document.querySelector("#sizePageRestaurante").value.trim();
            break;
    }
    $.ajax({
        url: getHostAPI() + beanRequestRestaurante.entity_api + "/" + beanRequestRestaurante.operation +
            parameters_pagination,
        type: beanRequestRestaurante.type_request,
        headers: {
            // 'Authorization': 'Bearer ' + Cookies.get("vacacioneo_token")
        },

        data: form_data,
        cache: false,
        contentType: ((beanRequestRestaurante.operation == 'update' || beanRequestRestaurante.operation == 'add') ? false : 'application/json; charset=UTF-8'),
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        $('#modalCargandoRestaurante').modal('hide');
        if (beanCrudResponse.messageServer !== null) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                swal({
                    title: "Realizado",
                    text: "Acción realizada existosamente!",
                    type: "success",
                    timer: 800,
                    showConfirmButton: false
                });
                document.querySelector("#pageRestaurante").value = 1;
                document.querySelector("#sizePageRestaurante").value = 20;
                $('#ventanaModalManRestaurante').modal('hide');
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

            beanPaginationRestaurante = beanCrudResponse.beanPagination;
            listaRestaurante(beanPaginationRestaurante);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoRestaurante').modal("hide");
        console.log(errorThrown);

    });

}

function addRestaurante(restaurante = undefined) {
    //LIMPIAR LOS CAMPOS

    document.querySelector('#txtNombreRestaurante').value = (restaurante == undefined) ? '' : restaurante.nombre;
    document.querySelector('#txtDireccionRestaurante').value = (restaurante == undefined) ? '' : restaurante.direccion;
    document.querySelector('#txtEmailRestaurante').value = (restaurante == undefined) ? '' : restaurante.email;
    document.querySelector('#txtFacebookRestaurante').value = (restaurante == undefined) ? '' : restaurante.facebook;


    if (restaurante != undefined) {
        if (restauranteSelected.foto == null) {
            document.querySelector("#imagenPreview").innerHTML = ``;
        } else {
            document.querySelector("#imagenPreview").innerHTML = `<img width='244' alt='user-picture' class='img-responsive text-center' src='${getHostFrontEnd() + 'adjuntos/restaurante/IMAGENES/' + restaurante.foto}' />`;
        }

    } else {

        document.querySelector("#imagenPreview").innerHTML = "";
    }


    addViewArchivosPrevius();


}

function listaRestaurante(beanPagination) {
    document.querySelector('#tbodyRestaurante').innerHTML = '';
    document.querySelector('#titleManagerRestaurante').innerHTML =
        '[ ' + beanPagination.countFilter + ' ] RESTAURANTES';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationRestaurante'));
        row += `<tr>
        <td class="text-center" colspan="6">NO HAY RESTAURANTES</td>
        </tr>`;

        document.querySelector('#tbodyRestaurante').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyRestaurante').innerHTML += row;
    let html2;
    beanPagination.list.forEach((restaurante) => {

        row += `<tr  idRestaurante="${restaurante.idRestaurante}">
<td class="text-center">${restaurante.ciudad.departamento.nombre}</td>
<td class="text-center">${restaurante.ciudad.nombre}</td>
<td class="text-center">${restaurante.nombre}</td>
<td class="text-center">${restaurante.direccion}</td>
<td class="text-center">${restaurante.email}</td>
<td class="text-center">${restaurante.facebook}</td>
<td class="text-center">${restaurante.imagen == null ? '' : "<img style='width: 53px;' alt='user-picture' class='img-responsive center-box' src='" + getHostFrontEnd() + "resources/img/RESTAURANTES/" + restaurante.imagen + "'"}</td>
<td class="text-center">
<button class="btn btn-info editar-restaurante" ><i class="fa fa-edit"></i> </button>
</td>
<td class="text-center">
<button class="btn btn-danger eliminar-restaurante"><i class="fa fa-trash"></i></button>
</td>
</tr>`;

        // $('[data-toggle="tooltip"]').tooltip();
    });
    document.querySelector('#tbodyRestaurante').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(document.querySelector("#sizePageRestaurante").value),
        document.querySelector("#pageRestaurante"),
        $('#modalCargandoRestaurante'),
        $('#paginationRestaurante'));
    addEventsButtonsRestaurante();


}

function addEventsButtonsRestaurante() {


    document.querySelectorAll('.editar-restaurante').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            restauranteSelected = findByRestaurante(
                btn.parentElement.parentElement.getAttribute('idRestaurante')
            );

            if (restauranteSelected != undefined) {
                addRestaurante(restauranteSelected);
                $("#tituloModalManRestaurante").html("EDITAR RESTAURANTE");
                $("#ventanaModalManRestaurante").modal("show");
                beanRequestRestaurante.type_request = 'PUT';
                beanRequestRestaurante.operation = 'update';
            } else {
                console.log(
                    'warning',
                    'No se encontró el Almacen para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-restaurante').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            //   $('[data-toggle="tooltip"]').tooltip("hide");
            restauranteSelected = findByRestaurante(
                btn.parentElement.parentElement.getAttribute('idRestaurante')
            );

            if (restauranteSelected != undefined) {
                beanRequestRestaurante.type_request = 'DELETE';
                beanRequestRestaurante.operation = 'delete';
                $('#modalCargandoRestaurante').modal('show');
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

    $("#txtImagenRestaurante").change(function () {
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

function findIndexRestaurante(idbusqueda) {
    return beanPaginationRestaurante.list.findIndex(
        (Restaurante) => {
            if (Restaurante.idRestaurante == parseInt(idbusqueda))
                return Restaurante;


        }
    );
}

function findByRestaurante(idRestaurante) {
    return beanPaginationRestaurante.list.find(
        (Restaurante) => {
            if (parseInt(idRestaurante) == Restaurante.idRestaurante) {
                return Restaurante;
            }


        }
    );
}
var validateFormRestaurante = () => {
    if (document.querySelector("#txtNombreRestaurante").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Nombre",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtDireccionRestaurante").value == "") {
        swal({
            title: "Vacío",
            text: "Escribe Dirección",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtEmailRestaurante").value == "") {
        swal({
            title: "Vacío",
            text: "Escribe el email ",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }

    if (document.querySelector("#txtFacebookRestaurante").value == "") {
        swal({
            title: "Vacío",
            text: "Escribe el Facebook ",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }

    if (beanRequestRestaurante.operation == 'add') {


        if (document.querySelector("#txtImagenRestaurante").files.length == 0) {
            swal({
                title: "Vacío",
                text: "Ingrese Imagen",
                type: "warning",
                timer: 1200,
                showConfirmButton: false
            });
            return false;
        }
        if (!(document.querySelector("#txtImagenRestaurante").files[0].type == "image/png" || document.querySelector("#txtImagenRestaurante").files[0].type == "image/jpg" || document.querySelector("#txtImagenRestaurante").files[0].type == "image/jpeg")) {
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
        if (document.querySelector("#txtImagenRestaurante").files[0].size > (4 * 1024 * 1024)) {
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


        if (document.querySelector("#txtImagenRestaurante").files.length != 0) {
            if (document.querySelector("#txtImagenRestaurante").files.length == 0) {
                swal({
                    title: "Vacío",
                    text: "Ingrese Imagen",
                    type: "warning",
                    timer: 1200,
                    showConfirmButton: false
                });
                return false;
            }
            if (!(document.querySelector("#txtImagenRestaurante").files[0].type == "image/png" || document.querySelector("#txtImagenRestaurante").files[0].type == "image/jpg" || document.querySelector("#txtImagenRestaurante").files[0].type == "image/jpeg")) {
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
            if (document.querySelector("#txtImagenRestaurante").files[0].size > (4 * 1024 * 1024)) {
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