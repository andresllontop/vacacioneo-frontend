var beanPaginationDepartamento;
function processAjaxDepartamento() {
    document.querySelector('#txtDepartamentoHotel').innerHTML = 'cargando...';
    let parameters_pagination = '';
    parameters_pagination +=
        '?filter=';
    parameters_pagination +=
        '&page=1';
    parameters_pagination +=
        '&size=30';

    $.ajax({
        url: getHostAPI() + "departamentos/paginate" +
            parameters_pagination,
        type: beanRequestHotel.type_request,
        headers: {
        },

        data: "",
        cache: false,
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        document.querySelector('#txtDepartamentoHotel').innerHTML = '';
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
            beanPaginationDepartamento = beanCrudResponse.beanPagination;
            listaDepartamento(beanPaginationDepartamento);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        document.querySelector('#txtDepartamentoHotel').innerHTML = '';
        console.log(errorThrown);

    });

}

function listaDepartamento(beanPagination) {
    document.querySelector('#txtDepartamentoHotel').innerHTML = '';
    let row = `<option value="0">Todos</option>`, row2 = '<li data-value="0" class="option selected">Todos</li>';

    if (beanPagination.list.length == 0) {
        document.querySelector('#txtDepartamentoHotel').innerHTML += row;
        return;
    }

    beanPagination.list.forEach((departamento) => {

        row += `<option value="${departamento.idDepartamento}">${departamento.nombre}</option>`;
        row2 += `<li data-value="${departamento.idDepartamento}" class="option">${departamento.nombre}</li>`;

    });
    document.querySelector('#txtDepartamentoHotel').innerHTML = row;
    if (document.querySelector('#ulDepartamentoHotel')) {
        document.querySelector('#ulDepartamentoHotel').innerHTML = row2;
    }
}