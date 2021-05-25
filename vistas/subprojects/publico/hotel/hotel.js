var beanPaginationHotel, beanPaginationDetalleHotel;
var hotelSelected = 0;
var beanRequestHotel = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestHotel.entity_api = 'hotel/detalle';
    beanRequestHotel.operation = 'paginate';
    beanRequestHotel.type_request = 'GET';
    $('#txtDepartamentoHotel').change(function (e) {
        hotelSelected = e.target.value;
        $('#modalCargandoHotel').modal('show');
    });

    $('#modalCargandoHotel').modal('show');
    $("#modalCargandoHotel").on('shown.bs.modal', function () {
        processAjaxHotel();
    });


});

function processAjaxHotel() {

    let parameters_pagination = '';

    switch (beanRequestHotel.operation) {
        default:
            parameters_pagination +=
                '?id=' + hotelSelected;
            parameters_pagination +=
                '&page=' + parseInt(document.querySelector("#pageHotel").value.trim());
            parameters_pagination +=
                '&size=6';
            break;
    }

    $.ajax({
        url: getHostAPI() + beanRequestHotel.entity_api + "/" + beanRequestHotel.operation +
            parameters_pagination,
        type: beanRequestHotel.type_request,
        json: null,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json'
    }).done(function (beanCrudResponse) {
        $('#modalCargandoHotel').modal("hide");
        if (beanCrudResponse.beanPagination !== null) {
            beanPaginationHotel = beanCrudResponse.beanPagination;

            listaHotel(beanPaginationHotel);

        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoHotel').modal("hide");
    });

}

function EstadoHotelServicio(key) {
    switch (key) {
        case 0:

            return "NO";
        case 1:

            return "SI";

        default:
            return "NO";
    }

}

function listaHotel(beanPagination) {
    if (beanPaginationDepartamento == undefined) {
        processAjaxDepartamento();
    }
    let row = "";
    document.querySelector('#tbodyHotel').innerHTML = "";
    if (beanPagination.list.length == 0) {

        return;
    }
    beanPaginationDetalleHotel = listByDetalleHotel();
    beanPaginationHotel.list = listByHotel();
    beanPagination = beanPaginationHotel;
    let listaTemporal;
    beanPagination.list.forEach((hotel) => {
        row += `
      <div class="col-lg-4">
      <div class="single-destinations">
          <div class="thumb">
              <img src="${getHostFrontEnd()}resources/img/HOTELES/${hotel.imagen}" alt="">
          </div>
          <div class="details">
              <h4 class="d-flex justify-content-between">
                  <span>${hotel.nombre}</span>
                  ${estrellas(parseInt(hotel.traslado))}
                  
              </h4>
              <p>
              ${hotel.ciudad.departamento.nombre} | ${hotel.ciudad.nombre}
              </p>
              <ul class="package-list">
  `;

        listaTemporal = findByDetalleHotel(hotel.idHotel);
        if (listaTemporal != undefined) {
            listaTemporal.forEach(detalle => {
                row += `<li class="d-flex justify-content-between align-items-center">
                                <span>${detalle.categoria.nombre}</span>
                                <span>${EstadoHotelServicio(detalle.estado)}</span></li>  
            `;
            });



        }
        row += `
        <li class="d-flex justify-content-between align-items-center">
                  <span>Precio por noche</span>
                  <a href="#" class="price-btn">S/. ${hotel.precio}</a>
        </li>
        <li class="d-flex justify-content-center align-items-center">
        <a href="${getHostFrontEnd() + "hotel/detalle/" + hotel.idHotel}" class="genric-btn info circle arrow ">Ver más ... <span class="lnr lnr-arrow-right"></span></a>
            </li>
       
        </ul>
          </div>
      </div>
  </div>
`;


    });


    document.querySelector('#tbodyHotel').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(6),
        document.querySelector("#pageHotel"),
        $('#modalCargandoHotel'),
        $('#paginationHotel'));

}
function estrellas(cantidad) {
    let row = '<div class="star">';
    for (let index = 0; index < cantidad; index++) {
        row += `
                      <span class="fa fa-star checked"></span>
       `;

    }
    row += '</div>';
    return row;
}

function listByHotel() {
    return beanPaginationHotel.list.filter(
        (Hotel) => {
            if (Hotel.idHotel > 0) {
                return Hotel;
            }


        }
    );
}

function listByDetalleHotel() {
    return beanPaginationHotel.list.filter(
        (Detalle) => {
            if (Detalle.idDetalleHotel > 0) {
                return Detalle;
            }


        }
    );
}

function findByDetalleHotel(idhotel) {
    return beanPaginationDetalleHotel.filter(
        (Detalle) => {
            if (Detalle.hotel.idHotel == idhotel) {
                return Detalle;
            }


        }
    );
}