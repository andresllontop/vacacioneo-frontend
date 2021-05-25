var beanPaginationDetalle, beanPaginationCiudad;
var detalleSelected, ciudadSelected, contadorDetalle = 2, valorHover;
var beanRequestDetalle = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestDetalle.entity_api = 'ciudades';
    beanRequestDetalle.operation = 'paginate';
    beanRequestDetalle.type_request = 'GET';
    let GETsearch = window.location.pathname;

    if (GETsearch.split("/").length == 5) {
        if (/^[0-9.]*$/.test(GETsearch.split("/")[4])) {
            ciudadSelected = { "idCiudad": GETsearch.split("/")[4] };
            $('#modalCargandoDetalle').modal('show');

            /* */
        } else {
            window.location.href = getHostFrontEnd() + "destino";
        }

    } else {
        window.location.href = getHostFrontEnd() + "destino";
    }


    $("#modalCargandoDetalle").on('shown.bs.modal', function () {
        processAjax();
    });


});

function processAjax() {

    let parameters_pagination = '';


    parameters_pagination +=
        '?id=' + ciudadSelected.idCiudad;
    parameters_pagination +=
        '&page=' + document.querySelector("#pageCiudad").value.trim();
    parameters_pagination +=
        '&size=6';



    $.ajax({
        url: getHostAPI() + beanRequestDetalle.entity_api + "/" + beanRequestDetalle.operation +
            parameters_pagination,
        type: beanRequestDetalle.type_request,
        json: null,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json'
    }).done(function (beanCrudResponse) {
        $('#modalCargandoDetalle').modal("hide");
        if (beanCrudResponse.beanPagination !== null) {


            beanPaginationCiudad = beanCrudResponse.beanPagination;
            listaDetalle(beanPaginationCiudad);



        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoDetalle').modal("hide");
    });

}

function listaDetalle(beanPagination) {

    let row = "", row2 = "", row3 = "";
    document.querySelector('#tbodyCiudad').innerHTML = "";
    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationCiudad'));
        return;
    }
    beanPaginationDetalle = listByDetalleCiudad();
    beanPaginationCiudad.list = listByCiudad();
    beanPaginationCiudad.list.forEach((ciudad) => {

        row += `
        <div class="col-lg-3 col-md-6">
        <div class="single-other-issue">
            <div class="thumb">
                <img class="img-fluid" src="${getHostFrontEnd() + "resources/img/CIUDADES/" + ciudad.imagen}" alt="">					
            </div>
                <h4>${ciudad.nombre}</h4>
            <p>
            ${ciudad.descripcion} </p>
        </div>
    </div>
            `;
        document.querySelector('.name_departamento').innerHTML = "DESTINOS EN " + ciudad.departamento.nombre;
    });


    document.querySelector('#tbodyCiudad').innerHTML = row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(6),
        document.querySelector("#pageCiudad"),
        $('#modalCargandoDetalle'),
        $('#paginationCiudad'));
}


function listByCiudad() {
    return beanPaginationCiudad.list.filter(
        (Ciudad) => {
            if (Ciudad.idCiudad > 0) {
                return Ciudad;
            }


        }
    );
}

function listByDetalleCiudad() {
    return beanPaginationCiudad.list.filter(
        (Detalle) => {
            if (Detalle.idDetalleCiudad > 0) {
                return Detalle;
            }


        }
    );
}