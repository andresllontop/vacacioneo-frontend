var beanPaginationDepartamento;
var departamentoSelected;
var beanRequestDepartamento = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestDepartamento.entity_api = 'departamentos';
    beanRequestDepartamento.operation = 'paginate';
    beanRequestDepartamento.type_request = 'GET';

    $('#sizePageDepartamento').change(function () {
        beanRequestDepartamento.type_request = 'GET';
        beanRequestDepartamento.operation = 'paginate';
        $('#modalCargandoDepartamento').modal('show');
    });

    $('#modalCargandoDepartamento').modal('show');

    $("#modalCargandoDepartamento").on('shown.bs.modal', function () {
        processAjaxDepartamento();
    });

    $("#ventanaModalManDepartamento").on('hide.bs.modal', function () {
        beanRequestDepartamento.type_request = 'GET';
        beanRequestDepartamento.operation = 'paginate';
    });



    $("#btnAbrirbook").click(function () {
        beanRequestDepartamento.operation = 'add';
        beanRequestDepartamento.type_request = 'POST';
        $("#imagePreview").html("");
        $("#tituloModalManDepartamento").html("REGISTRAR DEPARTAMENTO");
        addDepartamento();
        $("#ventanaModalManDepartamento").modal("show");


    });
    $("#formularioDepartamento").submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormDepartamento()) {
            $('#modalCargandoDepartamento').modal('show');
        }
    });

});

function processAjaxDepartamento() {
    let form_data = new FormData();
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestDepartamento.operation == 'update' ||
        beanRequestDepartamento.operation == 'add'
    ) {

        json = {
            idDepartamento: null,
            nombre: document.querySelector("#txtNombreDepartamento").value,
            imagen: null

        };


    } else {
        form_data = null;
    }

    switch (beanRequestDepartamento.operation) {
        case 'delete':
            parameters_pagination = '/' + departamentoSelected.idDepartamento;
            break;

        case 'update':
            json.idDepartamento = departamentoSelected.idDepartamento;
            json.imagen = departamentoSelected.imagen;
            if (document.querySelector("#txtImagenDepartamento").files.length !== 0) {
                form_data.append("file", $("#txtImagenDepartamento").prop("files")[0]);
            }
            form_data.append("departamento", JSON.stringify(json));
            break;
        case 'add':
            form_data.append("file", $("#txtImagenDepartamento").prop("files")[0]);
            form_data.append("departamento", JSON.stringify(json));
            break;

        default:

            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=' + document.querySelector("#pageDepartamento").value.trim();
            parameters_pagination +=
                '&size=' + document.querySelector("#sizePageDepartamento").value.trim();
            break;
    }
    $.ajax({
        url: getHostAPI() + beanRequestDepartamento.entity_api + "/" + beanRequestDepartamento.operation +
            parameters_pagination,
        type: beanRequestDepartamento.type_request,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("vacacioneo_token")
        },

        data: form_data,
        cache: false,
        contentType: ((beanRequestDepartamento.operation == 'update' || beanRequestDepartamento.operation == 'add') ? false : 'application/json; charset=UTF-8'),
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        $('#modalCargandoDepartamento').modal('hide');
        if (beanRequestDepartamento.operation == "delete") {
            beanRequestDepartamento.type_request = 'GET';
            beanRequestDepartamento.operation = 'paginate';
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
                document.querySelector("#pageDepartamento").value = 1;
                document.querySelector("#sizePageDepartamento").value = 20;
                $('#ventanaModalManDepartamento').modal('hide');
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
        $('#modalCargandoDepartamento').modal("hide");
        console.log(errorThrown);

    });

}

function addDepartamento(departamento = undefined) {
    //LIMPIAR LOS CAMPOS

    document.querySelector('#txtNombreDepartamento').value = (departamento == undefined) ? '' : departamento.nombre;

    if (departamento != undefined) {
        if (departamentoSelected.imagen == null) {
            document.querySelector("#imagenPreview").innerHTML = ``;
        } else {
            document.querySelector("#imagenPreview").innerHTML = `<img width='244' alt='user-picture' class='img-responsive text-center' src='${getHostFrontEnd() + 'resources/img/DEPARTAMENTOS/' + departamento.imagen}' />`;
        }

    } else {

        document.querySelector("#imagenPreview").innerHTML = "";
    }


    addViewArchivosPrevius();

}
function addViewArchivosPrevius() {

    $("#txtImagenDepartamento").change(function () {
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
function listaDepartamento(beanPagination) {
    document.querySelector('#tbodyDepartamento').innerHTML = '';
    document.querySelector('#titleManagerDepartamento').innerHTML =
        '[ ' + beanPagination.countFilter + ' ] DEPARTAMENTOS';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationDepartamento'));
        row += `<tr>
        <td class="text-center" colspan="6">NO HAY DEPARTAMENTOS</td>
        </tr>`;

        document.querySelector('#tbodyDepartamento').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyDepartamento').innerHTML += row;
    let html2;
    beanPagination.list.forEach((departamento) => {

        row += `<tr  idDepartamento="${departamento.idDepartamento}">
<td class="text-center">${departamento.nombre}</td>

<td class="text-center">${departamento.imagen == null ? '' : "<img style='width: 53px;' alt='user-picture' class='img-responsive center-box' src='" + getHostFrontEnd() + "resources/img/DEPARTAMENTOS/" + departamento.imagen + "'"}</td>
<td class="text-center">
<button class="btn btn-info editar-departamento" ><i class="fa fa-edit"></i> </button>
</td>
<td class="text-center">
<button class="btn btn-danger eliminar-departamento"><i class="fa fa-trash"></i></button>
</td>
</tr>`;

        // $('[data-toggle="tooltip"]').tooltip();
    });
    document.querySelector('#tbodyDepartamento').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(document.querySelector("#sizePageDepartamento").value),
        document.querySelector("#pageDepartamento"),
        $('#modalCargandoDepartamento'),
        $('#paginationDepartamento'));
    addEventsButtonsDepartamento();


}

function addEventsButtonsDepartamento() {


    document.querySelectorAll('.editar-departamento').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            departamentoSelected = findByDepartamento(
                btn.parentElement.parentElement.getAttribute('idDepartamento')
            );

            if (departamentoSelected != undefined) {
                addDepartamento(departamentoSelected);
                $("#tituloModalManDepartamento").html("EDITAR DEPARTAMENTO");
                $("#ventanaModalManDepartamento").modal("show");
                beanRequestDepartamento.type_request = 'PUT';
                beanRequestDepartamento.operation = 'update';
            } else {
                console.log(
                    'warning',
                    'No se encontró el Almacen para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-departamento').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            //   $('[data-toggle="tooltip"]').tooltip("hide");
            departamentoSelected = findByDepartamento(
                btn.parentElement.parentElement.getAttribute('idDepartamento')
            );

            if (departamentoSelected != undefined) {
                beanRequestDepartamento.type_request = 'DELETE';
                beanRequestDepartamento.operation = 'delete';
                $('#modalCargandoDepartamento').modal('show');
            } else {
                console.log(
                    'warning',
                    'No se encontró el registro para poder editar'
                );
            }
        };
    });
}




function findIndexDepartamento(idbusqueda) {
    return beanPaginationDepartamento.list.findIndex(
        (Departamento) => {
            if (Departamento.idDepartamento == parseInt(idbusqueda))
                return Departamento;


        }
    );
}

function findByDepartamento(idDepartamento) {
    return beanPaginationDepartamento.list.find(
        (Departamento) => {
            if (parseInt(idDepartamento) == Departamento.idDepartamento) {
                return Departamento;
            }


        }
    );
}
var validateFormDepartamento = () => {
    if (document.querySelector("#txtNombreDepartamento").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Nombre",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }

    if (beanRequestDepartamento.operation == 'add') {


        if (document.querySelector("#txtImagenDepartamento").files.length == 0) {
            swal({
                title: "Vacío",
                text: "Ingrese Imagen",
                type: "warning",
                timer: 1200,
                showConfirmButton: false
            });
            return false;
        }
        if (!(document.querySelector("#txtImagenDepartamento").files[0].type == "image/png" || document.querySelector("#txtImagenDepartamento").files[0].type == "image/jpg" || document.querySelector("#txtImagenDepartamento").files[0].type == "image/jpeg")) {
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
        if (document.querySelector("#txtImagenDepartamento").files[0].size > (4 * 1024 * 1024)) {
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


        if (document.querySelector("#txtImagenDepartamento").files.length != 0) {
            if (document.querySelector("#txtImagenDepartamento").files.length == 0) {
                swal({
                    title: "Vacío",
                    text: "Ingrese Imagen",
                    type: "warning",
                    timer: 1200,
                    showConfirmButton: false
                });
                return false;
            }
            if (!(document.querySelector("#txtImagenDepartamento").files[0].type == "image/png" || document.querySelector("#txtImagenDepartamento").files[0].type == "image/jpg" || document.querySelector("#txtImagenDepartamento").files[0].type == "image/jpeg")) {
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
            if (document.querySelector("#txtImagenDepartamento").files[0].size > (4 * 1024 * 1024)) {
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