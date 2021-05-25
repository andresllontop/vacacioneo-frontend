var beanPaginationRestaurante;
var restauranteSelected, contadorRestaurante = 2, valorHover;
var beanRequestRestaurante = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestRestaurante.entity_api = 'restaurante/detalle';
    beanRequestRestaurante.operation = 'paginate';
    beanRequestRestaurante.type_request = 'GET';


    $('#modalCargandoRestaurante').modal('show');
    $("#modalCargandoRestaurante").on('shown.bs.modal', function () {
        processAjaxRestaurante();
    });


});

function processAjaxRestaurante() {

    let parameters_pagination = '';

    switch (beanRequestRestaurante.operation) {
        default:
            parameters_pagination +=
                '?id=1';
            parameters_pagination +=
                '&page=' + parseInt(document.querySelector("#pageRestaurante").value.trim());
            parameters_pagination +=
                '&size=1';
            break;
    }

    $.ajax({
        url: getHostAPI() + beanRequestRestaurante.entity_api + "/" + beanRequestRestaurante.operation +
            parameters_pagination,
        type: beanRequestRestaurante.type_request,
        json: null,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json'
    }).done(function (beanCrudResponse) {
        $('#modalCargandoRestaurante').modal("hide");
        if (beanCrudResponse.beanPagination !== null) {
            beanPaginationRestaurante = beanCrudResponse.beanPagination;

            listaRestaurante(beanPaginationRestaurante);

        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoRestaurante').modal("hide");
    });

}

function EstadoRestauranteServicio(key) {
    switch (key) {
        case 0:

            return "NO";
        case 1:

            return "SI";

        default:
            return "NO";
    }

}

function listaRestaurante(beanPagination) {

    let row = "";
    document.querySelector('#tbodyRestaurante').innerHTML = "";
    if (beanPagination.list.length == 0) {

        return;
    }

    let idrestaurante = 0, objectRestaurante = null, contador = 0;
    beanPagination.list.forEach((detalle) => {
        contador++;

        if (idrestaurante == 0) {
            idrestaurante = detalle.restaurante.idrestaurante;

            objectRestaurante = detalle.restaurante;
            row += `
<div class="col-lg-4">
    <div class="single-destinations">
        <div class="thumb">
            <img src="${getHostFrontEnd()}vistas/img/hotels/${detalle.restaurante.imagen}" alt="">
        </div>
        <div class="details">
            <h4 class="d-flex justify-content-between">
                <span>Hilton Star Restaurante</span>
                <div class="star">
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star"></span>
                </div>
            </h4>
            <p>
            ${detalle.restaurante.ciudad.departamento.nombre} | ${detalle.restaurante.ciudad.nombre}
            </p>
            <ul class="package-list">
            `;
            if (detalle.idDetalleRestaurante > 0) {
                row += `
            <li class="d-flex justify-content-between align-items-center">
                <span>${detalle.categoria.nombre}</span>
                <span>${EstadoRestauranteServicio(detalle.estado)}</span>
            </li>
            `;
            }

        } else {
            if (idrestaurante == detalle.restaurante.idRestaurante) {

                row += `
                <li class="d-flex justify-content-between align-items-center">
                    <span>${detalle.categoria.nombre}</span>
                    <span>${EstadoRestauranteServicio(detalle.estado)}</span>
                </li>
                `;
            } else {
                row += `
                <li class="d-flex justify-content-between align-items-center">
                <span>Precio por noche</span>
                <a href="#" class="price-btn">S/. ${objectRestaurante.precio}</a>
            </li>
        </ul>
    </div>
</div>
</div>
                `;
                idrestaurante = detalle.restaurante.idRestaurante;

                objectRestaurante = detalle.restaurante;
                row += `
            <div class="col-lg-4">
                <div class="single-destinations">
                    <div class="thumb">
                        <img src="${getHostFrontEnd()}vistas/img/restaurantes/${detalle.restaurante.imagen}" alt="">
                    </div>
                    <div class="details">
                        <h4 class="d-flex justify-content-between">
                            <span>Hilton Star Restaurante</span>
                            <div class="star">
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                            </div>
                        </h4>
                        <p>
                        ${detalle.restaurante.ciudad.departamento.nombre} | ${detalle.restaurante.ciudad.nombre}
                        </p>
                        <ul class="package-list">
                            <li class="d-flex justify-content-between align-items-center">
                                <span>${detalle.categoria.nombre}</span>
                                <span>${EstadoRestauranteServicio(detalle.estado)}</span>
                            </li>
                `;

            }
        }


        if (beanPaginationRestaurante.list.length == contador) {
            row += `
            <li class="d-flex justify-content-center align-items-center">
            <a href="${getHostFrontEnd()}restaurant/detalle/${detalle.restaurante.idRestaurante}" class="genric-btn success circle arrow">Ir a detalle<span class="lnr lnr-arrow-right"></span></a>
        </li>
    </ul>
</div>
</div>
</div>
            `;
        }




    });



    document.querySelector('#tbodyRestaurante').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(6),
        document.querySelector("#pageRestaurante"),
        $('#modalCargandoRestaurante'),
        $('#paginationRestaurante'));

}