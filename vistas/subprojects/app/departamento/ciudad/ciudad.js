var beanPaginationCiudad;
var ciudadSelected, departamentoSelected;
var beanRequestCiudad = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestCiudad.entity_api = 'ciudades';
    beanRequestCiudad.operation = 'paginate';
    beanRequestCiudad.type_request = 'GET';

    $('#sizePageCiudad').change(function () {
        beanRequestCiudad.type_request = 'GET';
        beanRequestCiudad.operation = 'paginate';
        $('#modalCargandoCiudad').modal('show');
    });



    $("#modalCargandoCiudad").on('shown.bs.modal', function () {
        processAjaxCiudad();
    });

    $("#ventanaModalManCiudad").on('hide.bs.modal', function () {
        beanRequestCiudad.type_request = 'GET';
        beanRequestCiudad.operation = 'paginate';
    });



    $("#btnAbrirDepartamentos").click(function () {
        document.querySelector("#ciudadHTML").classList.add("d-none");
        document.querySelector("#departamentoHTML").classList.remove("d-none");


    });
    $("#btnAbrirbook").click(function () {
        beanRequestCiudad.operation = 'add';
        beanRequestCiudad.type_request = 'POST';
        $("#imagePreview").html("");
        $("#tituloModalManCiudad").html("REGISTRAR CIUDAD");
        addCiudad();
        $("#ventanaModalManCiudad").modal("show");


    });
    $("#formularioCiudad").submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormCiudad()) {
            $('#modalCargandoCiudad').modal('show');
        }
    });

});

function processAjaxCiudad() {
    let form_data = new FormData();

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestCiudad.operation == 'update' ||
        beanRequestCiudad.operation == 'add'
    ) {

        json = {
            idCiudad: null,
            nombre: document.querySelector("#txtNombreCiudad").value.toLocaleUpperCase(),
            descripcion: document.querySelector("#txtDescripcionCiudad").value,
            departamento: { idDepartamento: departamentoSelected.idDepartamento },
            imagen: null

        };


    } else {
        form_data = null;
    }

    switch (beanRequestCiudad.operation) {
        case 'delete':
            parameters_pagination = '/' + ciudadSelected.idCiudad;
            break;

        case 'update':
            json.idCiudad = ciudadSelected.idCiudad;
            json.imagen = ciudadSelected.imagen;

            if (document.querySelector("#txtImagenCiudad").files.length !== 0) {
                form_data.append("file", $("#txtImagenCiudad").prop("files")[0]);
            }
            form_data.append("ciudad", JSON.stringify(json));
            break;
        case 'add':


            form_data.append("file", $("#txtImagenCiudad").prop("files")[0]);
            form_data.append("ciudad", JSON.stringify(json));
            break;

        default:

            parameters_pagination +=
                '?id=' + departamentoSelected.idDepartamento;
            parameters_pagination +=
                '&page=' + document.querySelector("#pageCiudad").value.trim();
            parameters_pagination +=
                '&size=' + document.querySelector("#sizePageCiudad").value.trim();
            break;
    }
    $.ajax({
        url: getHostAPI() + beanRequestCiudad.entity_api + "/" + beanRequestCiudad.operation +
            parameters_pagination,
        type: beanRequestCiudad.type_request,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("vacacioneo_token")
        },

        data: form_data,
        cache: false,
        contentType: ((beanRequestCiudad.operation == 'update' || beanRequestCiudad.operation == 'add') ? false : 'application/json; charset=UTF-8'),
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        $('#modalCargandoCiudad').modal('hide');
        if (beanRequestCiudad.operation == "delete") {
            beanRequestCiudad.type_request = 'GET';
            beanRequestCiudad.operation = 'paginate';
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
                document.querySelector("#pageCiudad").value = 1;
                document.querySelector("#sizePageCiudad").value = 20;
                $('#ventanaModalManCiudad').modal('hide');
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
        $('#modalCargandoCiudad').modal("hide");
        console.log(errorThrown);

    });

}

function addCiudad(ciudad = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreCiudad').value = (ciudad == undefined) ? '' : ciudad.nombre;
    document.querySelector('#txtDescripcionCiudad').value = (ciudad == undefined) ? '' : ciudad.descripcion;
    document.querySelector('#txtDepartamentoCiudad').value = (ciudad == undefined) ? departamentoSelected.nombre : ciudad.departamento.nombre;
    if (ciudad != undefined) {
        if (ciudadSelected.imagen == null) {
            document.querySelector("#imagenPreview").innerHTML = ``;
        } else {
            document.querySelector("#imagenPreview").innerHTML = `<img width='244' alt='user-picture' class='img-responsive text-center' src='${getHostFrontEnd() + 'resources/img/CIUDADES/' + ciudad.imagen}' />`;
        }

    } else {

        document.querySelector("#imagenPreview").innerHTML = "";
    }


    addViewArchivosPrevius();
}

function listaCiudad(beanPagination) {
    document.querySelector('#tbodyCiudad').innerHTML = '';
    document.querySelector('#titleManagerCiudad').innerHTML =
        '[ ' + beanPagination.countFilter + ' ] CIUDADES';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationCiudad'));
        row += `<tr>
        <td class="text-center" colspan="6">NO HAY CIUDADES</td>
        </tr>`;

        document.querySelector('#tbodyCiudad').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyCiudad').innerHTML += row;

    beanPagination.list.forEach((ciudad) => {

        row += `<tr  idCiudad="${ciudad.idCiudad}">
<td class="text-center">${departamentoSelected.nombre}</td>
<td class="text-center">${ciudad.nombre}</td>
<td class="text-center">${ciudad.descripcion}</td>
<td class="text-center">${ciudad.imagen == null ? '' : "<img style='width: 53px;' alt='user-picture' class='img-responsive center-box' src='" + getHostFrontEnd() + "resources/img/CIUDADES/" + ciudad.imagen + "'"}</td>
<td class="text-center">
<button class="btn btn-info editar-ciudad" ><i class="fa fa-edit"></i> </button>
</td>
<td class="text-center">
<button class="btn btn-danger eliminar-ciudad"><i class="fa fa-trash"></i></button>
</td>
</tr>`;

        // $('[data-toggle="tooltip"]').tooltip();
    });
    document.querySelector('#tbodyCiudad').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(document.querySelector("#sizePageCiudad").value),
        document.querySelector("#pageCiudad"),
        $('#modalCargandoCiudad'),
        $('#paginationCiudad'));
    addEventsButtonsCiudad();


}

function addViewArchivosPrevius() {

    $("#txtImagenCiudad").change(function () {
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

function addEventsButtonsCiudad() {


    document.querySelectorAll('.editar-ciudad').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            ciudadSelected = findByCiudad(
                btn.parentElement.parentElement.getAttribute('idCiudad')
            );

            if (ciudadSelected != undefined) {
                addCiudad(ciudadSelected);
                $("#tituloModalManCiudad").html("EDITAR CIUDAD");
                $("#ventanaModalManCiudad").modal("show");
                beanRequestCiudad.type_request = 'PUT';
                beanRequestCiudad.operation = 'update';
            } else {
                console.log(
                    'warning',
                    'No se encontró el registro para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-ciudad').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            //   $('[data-toggle="tooltip"]').tooltip("hide");
            ciudadSelected = findByCiudad(
                btn.parentElement.parentElement.getAttribute('idCiudad')
            );

            if (ciudadSelected != undefined) {
                beanRequestCiudad.type_request = 'DELETE';
                beanRequestCiudad.operation = 'delete';
                $('#modalCargandoCiudad').modal('show');
            } else {
                console.log(
                    'warning',
                    'No se encontró el registro para poder editar'
                );
            }
        };
    });
}

function findIndexCiudad(idbusqueda) {
    return beanPaginationCiudad.list.findIndex(
        (Ciudad) => {
            if (Ciudad.idCiudad == parseInt(idbusqueda))
                return Ciudad;


        }
    );
}

function findByCiudad(idCiudad) {
    return beanPaginationCiudad.list.find(
        (Ciudad) => {
            if (parseInt(idCiudad) == Ciudad.idCiudad) {
                return Ciudad;
            }


        }
    );
}

var validateFormCiudad = () => {
    if (document.querySelector("#txtNombreCiudad").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Nombre",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (document.querySelector("#txtDescripcionCiudad").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Descripcion",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (departamentoSelected == undefined) {
        swal({
            title: "Vacío",
            text: "Escribe Departamento",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }
    if (beanRequestCiudad.operation == 'add') {


        if (document.querySelector("#txtImagenCiudad").files.length == 0) {
            swal({
                title: "Vacío",
                text: "Ingrese Imagen",
                type: "warning",
                timer: 1200,
                showConfirmButton: false
            });
            return false;
        }
        if (!(document.querySelector("#txtImagenCiudad").files[0].type == "image/png" || document.querySelector("#txtImagenCiudad").files[0].type == "image/jpg" || document.querySelector("#txtImagenCiudad").files[0].type == "image/jpeg")) {
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
        if (document.querySelector("#txtImagenCiudad").files[0].size > (4 * 1024 * 1024)) {
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


        if (document.querySelector("#txtImagenCiudad").files.length != 0) {
            if (document.querySelector("#txtImagenCiudad").files.length == 0) {
                swal({
                    title: "Vacío",
                    text: "Ingrese Imagen",
                    type: "warning",
                    timer: 1200,
                    showConfirmButton: false
                });
                return false;
            }
            if (!(document.querySelector("#txtImagenCiudad").files[0].type == "image/png" || document.querySelector("#txtImagenCiudad").files[0].type == "image/jpg" || document.querySelector("#txtImagenCiudad").files[0].type == "image/jpeg")) {
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
            if (document.querySelector("#txtImagenCiudad").files[0].size > (4 * 1024 * 1024)) {
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