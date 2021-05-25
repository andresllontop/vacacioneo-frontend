var beanPaginationServicio;
var beanPaginationCategoria;
var servicioSelected;
var beanRequestServicio = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestServicio.entity_api = 'hotel/detalle';
    beanRequestServicio.operation = '';
    beanRequestServicio.type_request = 'GET';

    $('#sizePageServicio').change(function () {
        beanRequestServicio.type_request = 'GET';
        beanRequestServicio.operation = '';
        $('#modalCargandoServicio').modal('show');
    });

    $("#btnAbrirHoteles").click(function () {
        document.querySelector("#servicioHTML").classList.add("d-none");
        document.querySelector("#hotelHTML").classList.remove("d-none");


    });

    $("#modalCargandoServicio").on('shown.bs.modal', function () {
        processAjaxServicio();
    });

    $("#ventanaModalManServicio").on('hide.bs.modal', function () {
        beanRequestServicio.type_request = 'GET';
        beanRequestServicio.operation = '';
    });



    $("#btnAbrirbook").click(function () {
        beanRequestServicio.operation = 'add';
        beanRequestServicio.type_request = 'POST';

        $("#tituloModalManServicio").html("REGISTRAR SERVICIO");
        addServicio();
        $("#ventanaModalManServicio").modal("show");


    });
    $("#formularioServicio").submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormServicio()) {
            $('#modalCargandoServicio').modal('show');
        }
    });

});

function processAjaxServicio() {


    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestServicio.operation == 'update' ||
        beanRequestServicio.operation == 'add'
    ) {

        json = {
            idDetalleHotel: null,
            estado: document.querySelector('#txtEstadoServicio').checked ? 1 : 0,
            categoria: { idCategoria: parseInt(document.querySelector('#txtCategoriaHotel').value) },
            hotel: { idHotel: hotelSelected.idHotel }

        };


    }
    switch (beanRequestServicio.operation) {
        case 'delete':
            parameters_pagination = '/' + servicioSelected.idDetalleHotel;
            break;

        case 'update':
            json.idDetalleHotel = servicioSelected.idDetalleHotel;


            break;
        case 'add':



            break;

        default:
            parameters_pagination = hotelSelected.idHotel;
            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=' + document.querySelector("#pageServicio").value.trim();
            parameters_pagination +=
                '&size=' + document.querySelector("#sizePageServicio").value.trim();
            break;
    }
    $.ajax({
        url: getHostAPI() + beanRequestServicio.entity_api + "/" + beanRequestServicio.operation +
            parameters_pagination,
        type: beanRequestServicio.type_request,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("vacacioneo_token")
        },

        data: JSON.stringify(json),
        cache: false,
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        $('#modalCargandoServicio').modal('hide');
        if (beanRequestServicio.operation == "delete") {
            beanRequestServicio.type_request = 'GET';
            beanRequestServicio.operation = '';
        }
        if (beanCrudResponse.messageServer !== null) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                swal({
                    title: "Realizado",
                    text: "Acción realizada existosamente!",
                    type: "success",
                    timer: 800,
                    showConfirmButton: false
                });
                document.querySelector("#pageServicio").value = 1;
                document.querySelector("#sizePageServicio").value = 20;
                $('#ventanaModalManServicio').modal('hide');
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

            beanPaginationServicio = beanCrudResponse.beanPagination;
            listaServicio(beanPaginationServicio);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoServicio').modal("hide");
        console.log(errorThrown);

    });

}

function addServicio(servicio = undefined) {
    //LIMPIAR LOS CAMPOS

    (servicio == undefined) ? document.querySelector('#txtEstadoServicio').checked = "false" : servicio.estado == 1 ? document.querySelector('#txtEstadoServicio').checked = "true" : document.querySelector('#txtEstadoServicio').checked = "false";


}

function listaServicio(beanPagination) {
    if (beanPaginationCategoria == undefined) {
        processAjaxCategoria();
    }
    document.querySelector('#tbodyServicio').innerHTML = '';
    document.querySelector('#titleManagerServicio').innerHTML =
        '[ ' + beanPagination.countFilter + ' ] SERVICIOS';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationServicio'));
        row += `<tr>
        <td class="text-center" colspan="6">NO HAY SERVCIOS</td>
        </tr>`;

        document.querySelector('#tbodyServicio').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyServicio').innerHTML += row;
    beanPagination.list.forEach((servicio) => {

        row += `<tr  idDetalleHotel="${servicio.idDetalleHotel}">
<td class="text-center">${hotelSelected.nombre}</td>
<td class="text-center">${servicio.categoria.nombre}</td>
<td class="text-center">${servicio.estado == 1 ? "SI" : "NO"}</td>
<td class="text-center">
<button class="btn btn-info editar-servicio" ><i class="fa fa-edit"></i> </button>
</td>
<td class="text-center">
<button class="btn btn-danger eliminar-servicio"><i class="fa fa-trash"></i></button>
</td>
</tr>`;

        // $('[data-toggle="tooltip"]').tooltip();
    });
    document.querySelector('#tbodyServicio').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(document.querySelector("#sizePageServicio").value),
        document.querySelector("#pageServicio"),
        $('#modalCargandoServicio'),
        $('#paginationServicio'));
    addEventsButtonsServicio();


}

function addEventsButtonsServicio() {


    document.querySelectorAll('.editar-servicio').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            servicioSelected = findByServicio(
                btn.parentElement.parentElement.getAttribute('idDetalleHotel')
            );

            if (servicioSelected != undefined) {
                addServicio(servicioSelected);
                $("#tituloModalManServicio").html("EDITAR SERVCIO");
                $("#ventanaModalManServicio").modal("show");
                beanRequestServicio.type_request = 'PUT';
                beanRequestServicio.operation = 'update';
            } else {
                console.log(
                    'warning',
                    'No se encontró el Almacen para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-servicio').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            //   $('[data-toggle="tooltip"]').tooltip("hide");
            servicioSelected = findByServicio(
                btn.parentElement.parentElement.getAttribute('idDetalleHotel')
            );

            if (servicioSelected != undefined) {
                beanRequestServicio.type_request = 'DELETE';
                beanRequestServicio.operation = 'delete';
                $('#modalCargandoServicio').modal('show');
            } else {
                console.log(
                    'warning',
                    'No se encontró el registro para poder editar'
                );
            }
        };
    });
}

function findIndexServicio(idbusqueda) {
    return beanPaginationServicio.list.findIndex(
        (Servicio) => {
            if (Servicio.idDetalleHotel == parseInt(idbusqueda))
                return Servicio;


        }
    );
}

function findByServicio(idDetalleHotel) {
    return beanPaginationServicio.list.find(
        (Servicio) => {
            if (parseInt(idDetalleHotel) == Servicio.idDetalleHotel) {
                return Servicio;
            }


        }
    );
}
var validateFormServicio = () => {
    if (document.querySelector('#txtCategoriaHotel').value == 0) {
        swal({
            title: "Vacío",
            text: "Ingrese Servicio",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (hotelSelected == undefined) {
        swal({
            title: "Vacío",
            text: "Escribe Hotel",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }


    return true;
}

function processAjaxCategoria() {
    document.querySelector('#txtCategoriaHotel').innerHTML = 'cargando...';
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
        url: getHostAPI() + "categorias/paginate" +
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

        document.querySelector('#txtCategoriaHotel').innerHTML = '';
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
            beanPaginationCategoria = beanCrudResponse.beanPagination;
            listaCategoria(beanPaginationCategoria);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        document.querySelector('#txtCategoriaHotel').innerHTML = '';
        console.log(errorThrown);

    });

}

function listaCategoria(beanPagination) {
    document.querySelector('#txtCategoriaHotel').innerHTML = '';
    let row = `<option value="0">Selecciona</option>`;

    if (beanPagination.list.length == 0) {
        document.querySelector('#txtCategoriaHotel').innerHTML += row;
        return;
    }

    beanPagination.list.forEach((ciudad) => {

        row += `<option value="${ciudad.idCategoria}">${ciudad.nombre}</option>`;

    });
    document.querySelector('#txtCategoriaHotel').innerHTML = row;
}