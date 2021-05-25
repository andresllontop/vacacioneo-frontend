var beanPaginationHotel;
var hotelSelected;
var beanRequestHotel = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestHotel.entity_api = 'hotel';
    beanRequestHotel.operation = 'paginate';
    beanRequestHotel.type_request = 'GET';

    document.querySelector("#servicioHTML").classList.add("d-none");
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




});

function processAjaxHotel() {

    let parameters_pagination = '';

    switch (beanRequestHotel.operation) {


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

        data: "",
        cache: false,
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        $('#modalCargandoHotel').modal('hide');
        if (beanCrudResponse.messageServer !== null) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                swal({
                    title: "Realizado",
                    text: "Acción realizada existosamente!",
                    type: "success",
                    timer: 800,
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



function listaHotel(beanPagination) {
    document.querySelector('#tbodyHotel').innerHTML = '';
    document.querySelector('#titleManagerHotel').innerHTML =
        '[ ' + beanPagination.countFilter + ' ] Lista de Hoteles';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationHotel'));
        row += `<tr>
        <td class="text-center" colspan="6">NO HAY Lista de Hoteles</td>
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
        <td class="text-center">S/.  ${hotel.precio}</td>
<td class="text-center">
<button class="btn btn-info ver-hotel" ><i class="fa fa-edit"></i> </button>
</td>
`;

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

    document.querySelectorAll('.ver-hotel').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            hotelSelected = findByHotel(
                btn.parentElement.parentElement.getAttribute('idHotel')
            );

            if (hotelSelected != undefined) {
                $('#modalCargandoServicio').modal('show');
                document.querySelector("#servicioHTML").classList.remove("d-none");
                document.querySelector("#hotelHTML").classList.add("d-none");
            } else {
                console.log(
                    'warning',
                    'No se encontró el registro de hotel'
                );
            }
        };
    });

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
