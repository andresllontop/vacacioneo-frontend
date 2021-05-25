var beanPaginationCiudad;
var ciudadSelected, contadorCiudad = 2, valorHover;
var beanRequestCiudad = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestCiudad.entity_api = 'ciudades';
    beanRequestCiudad.operation = 'paginate';
    beanRequestCiudad.type_request = 'GET';


    $('#modalCargandoCiudad').modal('show');
    $("#modalCargandoCiudad").on('shown.bs.modal', function () {
        processAjaxCiudad();
    });


});

function processAjaxCiudad() {

    let parameters_pagination = '';

    switch (beanRequestCiudad.operation) {
        default:
            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=' + parseInt(document.querySelector("#pageCiudad").value.trim());
            parameters_pagination +=
                '&size=12';
            break;
    }

    $.ajax({
        url: getHostAPI() + beanRequestCiudad.entity_api + "/" + beanRequestCiudad.operation +
            parameters_pagination,
        type: beanRequestCiudad.type_request,
        json: null,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json'
    }).done(function (beanCrudResponse) {
        $('#modalCargandoCiudad').modal("hide");
        if (beanCrudResponse.beanPagination !== null) {
            beanPaginationCiudad = beanCrudResponse.beanPagination;

            listaCiudad(beanPaginationCiudad);

        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoCiudad').modal("hide");
    });

}



function listaCiudad(beanPagination) {

    let row = "";
    document.querySelector('#tbodyCiudad').innerHTML = "";
    if (beanPagination.list.length == 0) {

        return;
    }

    beanPagination.list.forEach((ciudad) => {

        row += `
      
            <div class="col-lg-4">
            <div class="single-destination relative">
                <div class="thumb relative">
                    <div class="overlay overlay-bg"></div>
                    <img class="img-fluid" src="${getHostFrontEnd()}resources/img/CIUDADES/${ciudad.imagen}" alt="">
                </div>
                <div class="desc">
                
                    <h4>${ciudad.nombre}</h4>
                    <p>${ciudad.departamento.nombre}</p>
                </div>
            </div>
        </div>

            `;

    });



    document.querySelector('#tbodyCiudad').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(12),
        document.querySelector("#pageCiudad"),
        $('#modalCargandoCiudad'),
        $('#paginationCiudad'));

}