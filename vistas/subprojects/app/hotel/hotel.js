var beanPaginationHotel;
var beanPaginationCiudad;
var hotelSelected;
var beanRequestHotel = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestHotel.entity_api = 'hotel';
    beanRequestHotel.operation = 'paginate';
    beanRequestHotel.type_request = 'GET';

    $('#sizePageHotel').change(function () {
        beanRequestHotel.type_request = 'GET';
        beanRequestHotel.operation = 'paginate';
        $('#modalCargandoHotel').modal('show');
    });

    $('#modalCargandoHotel').modal('show');

    $("#modalCargandoHotel").on('shown.bs.modal', function () {
        processAjaxHotel();
    });

    $("#ventanaModalManHotel").on('hide.bs.modal', function () {
        beanRequestHotel.type_request = 'GET';
        beanRequestHotel.operation = 'paginate';
    });



    $("#btnAbrirbook").click(function () {
        beanRequestHotel.operation = 'add';
        beanRequestHotel.type_request = 'POST';
        $("#imagePreview").html("");
        $("#tituloModalManHotel").html("REGISTRAR RESTAURANTE");
        addHotel();
        $("#ventanaModalManHotel").modal("show");


    });
    $("#formularioHotel").submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormHotel()) {
            $('#modalCargandoHotel').modal('show');
        }
    });

});

function processAjaxHotel() {
    let form_data = new FormData();

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestHotel.operation == 'update' ||
        beanRequestHotel.operation == 'add'
    ) {

        json = {
            idHotel: null,
            nombre: document.querySelector("#txtNombreHotel").value,
            direccion: document.querySelector("#txtDireccionHotel").value,
            telefono: document.querySelector("#txtTelefonoHotel").value,
            email: document.querySelector("#txtEmailHotel").value,
            web: document.querySelector("#txtWebHotel").value,
            descripcion: document.querySelector("#txtDescripcionHotel").value,
            alojamiento: document.querySelector("#txtAlojamientoHotel").value,
            tours: document.querySelector("#txtToursHotel").value,
            traslado: document.querySelector("#txtTrasladoHotel").value,
            alimentacion: document.querySelector("#txtAlimentacionHotel").value,
            facebook: document.querySelector("#txtFacebookHotel").value,
            precio: parseFloat(document.querySelector("#txtPrecioHotel").value),
            ciudad: { idCiudad: parseInt(document.querySelector('#txtCiudadHotel').value) },
            imagen: null

        };


    } else {
        form_data = null;
    }

    switch (beanRequestHotel.operation) {
        case 'delete':
            parameters_pagination = '/' + hotelSelected.idHotel;
            break;

        case 'update':
            json.idHotel = hotelSelected.idHotel;
            json.imagen = hotelSelected.imagen;
            if (document.querySelector("#txtImagenHotel").files.length !== 0) {
                form_data.append("file", $("#txtImagenHotel").prop("files")[0]);
            }
            form_data.append("hotel", JSON.stringify(json));
            break;
        case 'add':


            form_data.append("file", $("#txtImagenHotel").prop("files")[0]);
            form_data.append("hotel", JSON.stringify(json));
            break;

        default:

            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=' + document.querySelector("#pageHotel").value.trim();
            parameters_pagination +=
                '&size=' + document.querySelector("#sizePageHotel").value.trim();
            break;
    }
    $.ajax({
        url: getHostAPI() + beanRequestHotel.entity_api + "/" + beanRequestHotel.operation +
            parameters_pagination,
        type: beanRequestHotel.type_request,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("vacacioneo_token")
        },

        data: form_data,
        cache: false,
        contentType: ((beanRequestHotel.operation == 'update' || beanRequestHotel.operation == 'add') ? false : 'application/json; charset=UTF-8'),
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        $('#modalCargandoHotel').modal('hide');
        if (beanRequestHotel.operation == "delete") {
            beanRequestHotel.type_request = 'GET';
            beanRequestHotel.operation = 'paginate';
        }
        if (beanCrudResponse.messageServer !== null) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                swal({
                    title: "Realizado",
                    text: "Acción realizada existosamente!",
                    type: "success",
                    timer: 1200,
                    showConfirmButton: false
                });
                document.querySelector("#pageHotel").value = 1;
                document.querySelector("#sizePageHotel").value = 20;
                $('#ventanaModalManHotel').modal('hide');
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

            beanPaginationHotel = beanCrudResponse.beanPagination;
            listaHotel(beanPaginationHotel);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoHotel').modal("hide");
        console.log(errorThrown);

    });

}

function addHotel(hotel = undefined) {
    //LIMPIAR LOS CAMPOS

    document.querySelector('#txtNombreHotel').value = (hotel == undefined) ? '' : hotel.nombre;
    document.querySelector('#txtEmailHotel').value = (hotel == undefined) ? '' : hotel.email;
    document.querySelector('#txtWebHotel').value = (hotel == undefined) ? '' : hotel.web;
    document.querySelector('#txtFacebookHotel').value = (hotel == undefined) ? '' : hotel.facebook;
    document.querySelector('#txtDireccionHotel').value = (hotel == undefined) ? '' : hotel.direccion;
    document.querySelector('#txtTelefonoHotel').value = (hotel == undefined) ? '' : hotel.telefono;
    document.querySelector('#txtAlojamientoHotel').value = (hotel == undefined) ? '' : hotel.alojamiento;
    document.querySelector('#txtToursHotel').value = (hotel == undefined) ? '' : hotel.tours;
    document.querySelector('#txtTrasladoHotel').value = (hotel == undefined) ? '3 ESTRELLAS' : hotel.traslado;
    document.querySelector('#txtAlimentacionHotel').value = (hotel == undefined) ? '' : hotel.alimentacion;
    document.querySelector('#txtDescripcionHotel').value = (hotel == undefined) ? '' : hotel.descripcion;

    document.querySelector('#txtPrecioHotel').value = (hotel == undefined) ? '0' : hotel.precio;

    document.querySelector('#txtCiudadHotel').value = (hotel == undefined) ? '0' : hotel.ciudad.idCiudad;



    if (hotel != undefined) {
        if (hotelSelected.foto == null) {
            document.querySelector("#imagenPreview").innerHTML = ``;
        } else {
            document.querySelector("#imagenPreview").innerHTML = `<img style="width:100%" alt='user-picture' class='img-responsive text-center' src='${getHostFrontEnd() + 'resources/img/HOTELES/' + hotel.foto}' />`;
        }

    } else {

        document.querySelector("#imagenPreview").innerHTML = "";
    }


    addViewArchivosPrevius();


}

function listaHotel(beanPagination) {
    if (beanPaginationCiudad == undefined) {
        processAjaxCiudad();
    }

    document.querySelector('#tbodyHotel').innerHTML = '';
    document.querySelector('#titleManagerHotel').innerHTML =
        '[ ' + beanPagination.countFilter + ' ] HOTELES';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationHotel'));
        row += `<tr>
        <td class="text-center" colspan="7">NO HAY HOTELES</td>
        </tr>`;

        document.querySelector('#tbodyHotel').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyHotel').innerHTML += row;
    let html2;
    beanPagination.list.forEach((hotel) => {

        row += `<tr  idHotel="${hotel.idHotel}">
<td class="text-center">${hotel.ciudad.departamento.nombre}</td>
<td class="text-center">${hotel.ciudad.nombre}</td>
<td class="text-center">${hotel.nombre}</td>
<td class="text-center">S/. ${hotel.precio}</td>
<td class="text-center">${hotel.imagen == null ? '' : "<img style='width: 53px;' alt='user-picture' class='img-responsive center-box' src='" + getHostFrontEnd() + "resources/img/HOTELES/" + hotel.imagen + "'"}</td>
<td class="text-center">
<button class="btn btn-info editar-hotel" ><i class="fa fa-edit"></i> </button>
</td>
<td class="text-center">
<button class="btn btn-danger eliminar-hotel"><i class="fa fa-trash"></i></button>
</td>
</tr>`;

        // $('[data-toggle="tooltip"]').tooltip();
    });
    document.querySelector('#tbodyHotel').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(document.querySelector("#sizePageHotel").value),
        document.querySelector("#pageHotel"),
        $('#modalCargandoHotel'),
        $('#paginationHotel'));
    addEventsButtonsHotel();


}

function addEventsButtonsHotel() {


    document.querySelectorAll('.editar-hotel').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            hotelSelected = findByHotel(
                btn.parentElement.parentElement.getAttribute('idHotel')
            );

            if (hotelSelected != undefined) {
                addHotel(hotelSelected);
                $("#tituloModalManHotel").html("EDITAR RESTAURANTE");
                $("#ventanaModalManHotel").modal("show");
                beanRequestHotel.type_request = 'PUT';
                beanRequestHotel.operation = 'update';
            } else {
                console.log(
                    'warning',
                    'No se encontró el Almacen para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-hotel').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            //   $('[data-toggle="tooltip"]').tooltip("hide");
            hotelSelected = findByHotel(
                btn.parentElement.parentElement.getAttribute('idHotel')
            );

            if (hotelSelected != undefined) {
                beanRequestHotel.type_request = 'DELETE';
                beanRequestHotel.operation = 'delete';
                $('#modalCargandoHotel').modal('show');
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

    $("#txtImagenHotel").change(function () {
        filePreview(this, "#imagenPreview");
    });

}

function filePreview(input, imagen) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        imagen;
        reader.onload = function (e) {
            $(imagen).html(
                "<img style='width:100%' alt='user-picture' class='img-responsive center-box' src='" +
                e.target.result +
                "' />"
            );
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function findIndexHotel(idbusqueda) {
    return beanPaginationHotel.list.findIndex(
        (Hotel) => {
            if (Hotel.idHotel == parseInt(idbusqueda))
                return Hotel;


        }
    );
}

function findByHotel(idHotel) {
    return beanPaginationHotel.list.find(
        (Hotel) => {
            if (parseInt(idHotel) == Hotel.idHotel) {
                return Hotel;
            }


        }
    );
}

var validateFormHotel = () => {
    if (document.querySelector("#txtNombreHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Nombre",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtWebHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Pagina Web",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtFacebookHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Facebook",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtEmailHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Email",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtDireccionHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Direccion",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtTelefonoHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Telefono",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtAlojamientoHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Alojamiento",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtToursHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Tours",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtTrasladoHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Estrellas",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtAlimentacionHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Restaurante",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }

    if (document.querySelector("#txtPrecioHotel").value == "") {
        swal({
            title: "Vacío",
            text: "Escribe Precio",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtCiudadHotel").value == "0") {
        swal({
            title: "Vacío",
            text: "Selecciona Ciudad",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }


    if (beanRequestHotel.operation == 'add') {


        if (document.querySelector("#txtImagenHotel").files.length == 0) {
            swal({
                title: "Vacío",
                text: "Ingrese Imagen",
                type: "warning",
                timer: 1200,
                showConfirmButton: false
            });
            return false;
        }
        if (!(document.querySelector("#txtImagenHotel").files[0].type == "image/png" || document.querySelector("#txtImagenHotel").files[0].type == "image/jpg" || document.querySelector("#txtImagenHotel").files[0].type == "image/jpeg")) {
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
        if (document.querySelector("#txtImagenHotel").files[0].size > (4 * 1024 * 1024)) {
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


        if (document.querySelector("#txtImagenHotel").files.length != 0) {
            if (document.querySelector("#txtImagenHotel").files.length == 0) {
                swal({
                    title: "Vacío",
                    text: "Ingrese Imagen",
                    type: "warning",
                    timer: 1200,
                    showConfirmButton: false
                });
                return false;
            }
            if (!(document.querySelector("#txtImagenHotel").files[0].type == "image/png" || document.querySelector("#txtImagenHotel").files[0].type == "image/jpg" || document.querySelector("#txtImagenHotel").files[0].type == "image/jpeg")) {
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
            if (document.querySelector("#txtImagenHotel").files[0].size > (4 * 1024 * 1024)) {
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

function processAjaxCiudad() {
    document.querySelector('#txtCiudadHotel').innerHTML = 'cargando...';
    let parameters_pagination = '';


    switch (beanRequestHotel.operation) {


        default:

            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=1';
            parameters_pagination +=
                '&size=30';
            break;
    }
    $.ajax({
        url: getHostAPI() + "ciudades/paginate" +
            parameters_pagination,
        type: beanRequestHotel.type_request,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("vacacioneo_token")
        },

        data: "",
        cache: false,
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        document.querySelector('#txtCiudadHotel').innerHTML = '';
        if (beanCrudResponse.messageServer !== null) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                swal({
                    title: "Realizado",
                    text: "Acción realizada existosamente!",
                    type: "success",
                    timer: 800,
                    showConfirmButton: false
                });
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
            beanPaginationCiudad = beanCrudResponse.beanPagination;
            listaCiudad(beanPaginationCiudad);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        document.querySelector('#txtCiudadHotel').innerHTML = '';
        console.log(errorThrown);

    });

}

function listaCiudad(beanPagination) {
    document.querySelector('#txtCiudadHotel').innerHTML = '';
    let row = `<option value="0">Selecciona</option>`;

    if (beanPagination.list.length == 0) {
        document.querySelector('#txtCiudadHotel').innerHTML += row;
        return;
    }

    beanPagination.list.forEach((ciudad) => {

        row += `<option value="${ciudad.idCiudad}">${ciudad.nombre}</option>`;

    });
    document.querySelector('#txtCiudadHotel').innerHTML = row;
}