// Función encontrada en StackOverflow para quitar caracteres especiales y podes validar correctamente

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


// constante y constructor alumnos

const listaDeAlumnos = JSON.parse(localStorage.getItem("listaDeAlumnos")) || [];

class Alumno {
    constructor(nombreAlumno, apellidoAlumno, notaAlumno) {
        this.nombre = nombreAlumno;
        this.apellido = apellidoAlumno;
        this.nota = notaAlumno;
        this.aprobado = notaAlumno > 6;
    }
}



// Función para no recargar la página

function validarFormulario(e) {
    e.preventDefault();

    document.getElementById("mensajeError").style.display = "none";

    e.target.reset();
}

// Función para chequear si el alumno ya existe

function alumnoExistente(nombre, apellido) {
    return listaDeAlumnos.some(alumno => alumno.nombre === nombre && alumno.apellido === apellido);
}


// Función agregar alumno


function funcionAgregarAlumno() {

    // Variables para el constructor obtenidas de los inputs, utilizando la función para remover acentos y la función trim que encontré y apliqué el trabajo anterior, que elimina los espacios vacíos para así validar de manera mas correcta los datos ingresados y comparalos correctamente y no duplicarlos.
    let nombre = removeAccents(document.getElementById("nombreInput").value.trim());
    let apellido = removeAccents(document.getElementById("apellido").value.trim());
    let nota = parseInt(document.getElementById("nota").value.trim());


    // Manejo de errores de los datos ingresados
    if (!nombre || !isNaN(nombre) || !apellido || !isNaN(apellido) || isNaN(nota) || nota < 1 || nota > 10) {
        Toastify({
            text: "Por favor, complete todos los campos. Notas de 1 a 10 únicamente.",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ff0000",
            }
        }).showToast();
        return;
    }
    // Aplicación de función para validar si el alumno ya existe
    if (alumnoExistente(nombre, apellido)) {
        Toastify({
            text: "El alumno ya existe en la base de datos.",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ffff00",
                color: "#000000",
            }
        }).showToast();

        return;
    }






    // Finalización clase constructora
    let nuevoAlumno = new Alumno(nombre, apellido, nota);


    // Pusheo al array con el proceso JSON
    listaDeAlumnos.push(nuevoAlumno);


    //Si la lista está abierta al momento de agregar un alumno se actualiza automáticamente y recarga la lista con el alumno nuevo. De estar cerrada, solo sale el toastify y no se abre.
    if (listaAbierta === true) {
        mostrarListaDeAlumnos()
    }

    Toastify({
        text: "Alumno agregado.",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#008000",
        }
    }).showToast();
    localStorage.setItem("listaDeAlumnos", JSON.stringify(listaDeAlumnos));


    //Reseteo de inputs
    document.getElementById("nombreInput").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("nota").value = "";

}


// Creación contenedor de inputs
let contenedorDatos = document.createElement("div");
contenedorDatos.id = "contenedorDatos"

contenedorDatos.innerHTML = `
<h2> Bienvenido a nuestro sistema de alumnos </h2>

<form id="form-test">
<input type="text" id="nombreInput" placeholder="Ingresar nombre..." />
<input type="text" id="apellido" placeholder="Ingresar apellido..." />
<input type="number" id="nota" min="1" max="10" placeholder="Nota..." />
<input type="button" id="enviarDatos" class="btn-filtro" min="1" max="10" value="Enviar Datos" />
</form>`;

document.body.append(contenedorDatos);


// Eventos 
let botonEnviarDatos = document.getElementById("enviarDatos");
botonEnviarDatos.addEventListener("click", funcionAgregarAlumno);

let formulario = document.getElementById("form-test");
formulario.addEventListener("reset", validarFormulario);




// Creación contenedor de botones 

let contenedorBotones = document.createElement("div");
contenedorBotones.id = "contenedorBotones";

contenedorBotones.innerHTML = `
<h3>Lista de alumnos</h3>

<button type="button" class="btn btn-mostrar">Mostrar</button>
<button type="button" class="btn btn-ocultar">Ocultar</button>
<button type="button" class="btn btn-editar">Editar nota</button>
<p class="d-inline-flex gap-1">
  <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
    Aplicar filtro por:
  </a>
</p>  
  <div class="collapse" id="collapseExample">
  <div class="card card-body">
    <button type="button" class="btn btn-interno btn-collapse btn-mayorMenor" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Nota mayor a menor</button>
    <button type="button" class="btn btn-interno btn-collapse btn-menorMayor" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Nota menor a mayor</button>
    <button type="button" class="btn btn-interno btn-collapse btn-aprobados" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Aprobados</button>
    <button type="button" class="btn btn-interno btn-collapse btn-desaprobados" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Desaprobados</button>
    <button type="button" class="btn btn-interno btn-collapse btn-alfabeto" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Alfabeticamente</button>
  </div>
</div>
<div><input id="inputSearch" type="search" placeholder="Ingrese el nombre del alumno a buscar..."/></div>`

document.body.append(contenedorBotones);




// Creación contenedor lista

let contenedorLista = document.createElement("div")
contenedorLista.id = "contenedorLista";
contenedorLista.style.display = "none";

contenedorLista.innerHTML = `
<ul id="listaAlumnos"></ul>
<div class="loader" id="mensajeCargando" style= "display:none;"></div>
<p id="p-lista"> Aún no hay alumnos, por favor ingresar. </p>
<p id="vacioAprobados" style="display: none;">No hay alumnos aprobados.</p>
<p id="vacioDesaprobados" style="display: none;">No hay alumnos desaprobados.</p>
<p id="sinCoincidencias" style="display:none;">No se encontraron coincidencias</p>
`

document.body.append(contenedorLista)




// Constante y función para mostrar el array listaDeAlumnos en una lista

let listaAbierta = false;

function mostrarListaDeAlumnos() {

    listaAbierta = true;

    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");
    const divOculto = document.getElementById("contenedorLista");

    divOculto.style.display = "block";

    mensajeCargando.style.display = "block";
    listaAlumnosUl.style.display = "block";

    listaAlumnosUl.innerHTML = "";

    document.getElementById("p-lista").style.display = "none";
    document.getElementById("vacioDesaprobados").style.display = "none";
    document.getElementById("vacioAprobados").style.display = "none";



    if (listaDeAlumnos.length === 0) {

        setTimeout(() => {
            mensajeCargando.style.display = "none";
        }, 1000);

        setTimeout(() => {
            document.getElementById("p-lista").style.display = "block";
        }, 1000);

        return;
    } else// Recorre el array listaDeAlumnos y crea un li para cada uno
        (setTimeout(() => {
            mensajeCargando.style.display = "none";

            listaDeAlumnos.forEach((alumno, idx) => {
                const li = document.createElement("li");


                const botonEliminar = document.createElement("button");
                botonEliminar.id = "botonEliminar"
                botonEliminar.innerText = "Eliminar";
                botonEliminar.addEventListener("click", () => sweetAlertEliminar(idx));
                li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} - Nota final: ${alumno.nota} `;

                li.appendChild(botonEliminar);
                listaAlumnosUl.appendChild(li);
            })
        }, 1000))
}


// Función para mostrar la lista pero de mayor a menor nota

function mostrarListaDeAlumnosOrdenada() {

    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");
    const divAbierto = document.getElementById("contenedorLista");

    divAbierto.style.display = "block";

    mensajeCargando.style.display = "block";

    listaAlumnosUl.style.display = "block";

    listaAlumnosUl.innerHTML = "";

    // Recorre el array listaDeAlumnos y crea elementos <li> para cada alumno
    if (listaDeAlumnos.length === 0) {
        document.getElementById("p-lista").style.display = "none";

        setTimeout(() => {
            mensajeCargando.style.display = "none";
            document.getElementById("p-lista").style.display = "block";
        }, 1000);


        return;
    } else {
        document.getElementById("p-lista").style.display = "none";
        setTimeout(() => {
            listaDeAlumnos.forEach((alumno, idx) => {


                mensajeCargando.style.display = "none";

                const li = document.createElement("li");
                const botonEliminar = document.createElement("button");
                botonEliminar.id = "botonEliminar"
                botonEliminar.innerText = "Eliminar";
                botonEliminar.addEventListener("click", () => sweetAlertEliminar(idx));
                li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} - Nota final: ${alumno.nota}`;
                li.appendChild(botonEliminar);
                listaAlumnosUl.appendChild(li);
            })
        }, 1000)
    }

    listaAlumnosUl.innerHTML = "";
}


// Función para filtrar alumnos 

const mostrarAlumnosFiltrados = (alumnosFiltrados) => {
    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");

    const divAbierto = document.getElementById("contenedorLista");

    listaAlumnosUl.innerHTML = "";

    document.getElementById("p-lista").style.display = "none";

    divAbierto.style.display = "block";
    mensajeCargando.style.display = "block";
    listaAlumnosUl.style.display = "block";




    // Recorre el array de alumnos filtrados y crea elementos <li> para cada alumno

    if (listaDeAlumnos.length === 0) {
        setTimeout(() => {
            mensajeCargando.style.display = "none";
            document.getElementById("p-lista").style.display = "block";

        }, 1000);


        return;
    } else {
        setTimeout(() => {
            alumnosFiltrados.sort((a, b) => b.nota - a.nota);
            alumnosFiltrados.forEach((alumno, idx) => {

                mensajeCargando.style.display = "none";

                const li = document.createElement("li");
                const botonEliminar = document.createElement("button");
                botonEliminar.id = "botonEliminar"
                botonEliminar.innerText = "Eliminar";
                botonEliminar.addEventListener("click", () => sweetAlertEliminar(idx));
                li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} - Nota final: ${alumno.nota}`;
                li.appendChild(botonEliminar);
                listaAlumnosUl.appendChild(li);

            });
        }, 1000);
    }


}

// Función para filtrar alumnos por busqueda

const mostrarAlumnosFiltradosBusqueda = (alumnosFiltrados) => {
    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");

    const divAbierto = document.getElementById("contenedorLista");

    listaAlumnosUl.innerHTML = "";

    document.getElementById("p-lista").style.display = "none";

    divAbierto.style.display = "block";
    mensajeCargando.style.display = "block";
    listaAlumnosUl.style.display = "block";




    // Recorre el array de alumnos filtrados y crea elementos <li> para cada alumno

    if (alumnosFiltrados.length === 0) {
        setTimeout(() => {
            mensajeCargando.style.display = "none";
            document.getElementById("p-lista").innerText = "No se encontraron coincidencias"
            document.getElementById("p-lista").style.display = "block";

        }, 1000);


        return;
    } else {
        setTimeout(() => {
            alumnosFiltrados.sort((a, b) => b.nota - a.nota);
            alumnosFiltrados.forEach((alumno, idx) => {

                mensajeCargando.style.display = "none";
                document.getElementById("sinCoincidencias").style.display = "none";

                const li = document.createElement("li");
                const botonEliminar = document.createElement("button");
                botonEliminar.id = "botonEliminar"
                botonEliminar.innerText = "Eliminar";
                botonEliminar.addEventListener("click", () => sweetAlertEliminar(idx));
                li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} - Nota final: ${alumno.nota}`;
                li.appendChild(botonEliminar);
                listaAlumnosUl.appendChild(li);

            });
        }, 1000);
    }


}

// Función mostrar para editar

const mostrarListaEditar = () => {
    const listaAlumnosUl = document.getElementById("listaAlumnos");
    const mensajeCargando = document.getElementById("mensajeCargando");
    const divOculto = document.getElementById("contenedorLista");

    divOculto.style.display = "block";

    mensajeCargando.style.display = "block";
    listaAlumnosUl.style.display = "block";

    listaAlumnosUl.innerHTML = "";

    document.getElementById("p-lista").style.display = "none";
    document.getElementById("vacioDesaprobados").style.display = "none";
    document.getElementById("vacioAprobados").style.display = "none";



    if (listaDeAlumnos.length === 0) {

        setTimeout(() => {
            mensajeCargando.style.display = "none";
        }, 1000);

        setTimeout(() => {
            document.getElementById("p-lista").style.display = "block";
        }, 1000);

        return;
    } else// Recorre el array listaDeAlumnos y crea un li para cada uno
        (setTimeout(() => {
            mensajeCargando.style.display = "none";

            listaDeAlumnos.forEach((alumno, idx) => {
                const li = document.createElement("li");
                const divDivisor = document.createElement("div")
                divDivisor.id = "divDivisor"
                const inputEditar = document.createElement("input");
                inputEditar.className = "inputEditar";
                inputEditar.id = `inputEditar-${idx}`;
                inputEditar.placeholder = "Nueva nota."
                inputEditar.dataset.idx = idx;
                inputEditar.type = "number";

                inputEditar.min = 1;
                inputEditar.max = 10;

                const botonEditar = document.createElement("button");
                botonEditar.id = "botonEditar";
                botonEditar.innerText = "Editar nota.";
                botonEditar.addEventListener("click", () => {
                    // Acá no encontraba la manera de conseguir el dato del alumno y me terminé apoyando en ChatGPT. El resto ya lo tenia pensado
                    const idx = inputEditar.dataset.idx; // Obten el índice del atributo data-idx
                    const nuevaNota = parseFloat(document.getElementById(`inputEditar-${idx}`).value); // Obtén el valor del input
                    if (!isNaN(nuevaNota) && nuevaNota >= 1 && nuevaNota <= 10 && alumno.nota != nuevaNota) {

                        Swal.fire({
                            icon: 'question',
                            text: `Estas seguro de editar la nota de ${alumno.nombre} ${alumno.apellido}? 
                            La nota actual es ${alumno.nota} y la estas cambiando por ${nuevaNota}`,
                            allowEscapeKey: true,
                            showDenyButton: true,
                            confirmButtonText: 'Confirmar',
                            denyButtonText: `Cancelar`,
                            background: "#001000",
                            color: "#fff"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Actualiza la nota
                                listaDeAlumnos[idx].nota = nuevaNota;
                                // Actualiza el valor si se editó la nota
                                listaDeAlumnos[idx].aprobado = nuevaNota >= 7;
                                // Pusheo al localStorage utilizando stringify
                                localStorage.setItem("listaDeAlumnos", JSON.stringify(listaDeAlumnos));
                                Toastify({
                                    text: "Nota actualizada.",
                                    duration: 3000,
                                    gravity: "bottom",
                                    position: "right",
                                    style: {
                                        background: "#008000",
                                    }
                                }).showToast();
                                // Vuelve a mostrar la lista de alumnos actualizada
                                mostrarListaEditar();
                            } else if (result.isDenied) {
                                Swal.fire({
                                    text: 'No se editará la nota',
                                    allowEscapeKey: true,
                                    background: "#001000",
                                    color: "#fff"
                                })
                                inputEditar.value = "";
                            }

                        })

                    } else if (alumno.nota === nuevaNota) {
                        Swal.fire({
                            text: 'Estás ingresando el mismo valor de nota pre existente.',
                            allowEscapeKey: true,
                            background: "#001000",
                            color: "#fff"
                        })
                        inputEditar.value = "";
                    } else {
                        Swal.fire({
                            text: 'Por favor ingresar números, entre 1 y 10.',
                            allowEscapeKey: true,
                            background: "#001000",
                            color: "#fff"
                        })
                        inputEditar.value = "";
                    }
                });

                li.innerText = `${idx + 1}) ${alumno.nombre.toUpperCase()} ${alumno.apellido.toUpperCase()} - Nota final: ${alumno.nota} `;
                li.appendChild(divDivisor);
                divDivisor.appendChild(inputEditar);
                divDivisor.appendChild(botonEditar);
                listaAlumnosUl.appendChild(li);
            })
        }, 1000))
}




// Función para buscar alumnos por nombre y apellido 
let timeoutId;

const busqueda = () => {
    clearTimeout(timeoutId);

    const buscarInput = document.getElementById("inputSearch").value.toUpperCase();
    const listaAlumnosUl = document.getElementById("listaAlumnos");
    

    listaAlumnosUl.innerHTML = "";

    if (buscarInput === "") {
        mostrarListaDeAlumnosOrdenada();
    } else {
        timeoutId = setTimeout(() => {
            const resultados = listaDeAlumnos.filter(alumno => {
                const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`.toUpperCase();
                return nombreCompleto.includes(buscarInput);
            });
            mostrarAlumnosFiltradosBusqueda(resultados);
        }, 300);
    }
}

const inputSearch = document.getElementById("inputSearch");
inputSearch.addEventListener("input", busqueda);


// Función para ocultar la lista

const ocultarLista = () => {
    document.getElementById("contenedorLista").style.display = "none";
}

const botonOcultar = document.querySelector(".btn-ocultar");
botonOcultar.addEventListener("click", ocultarLista);


// Función para ordenar de mayor a menor nota 

const mayorParaMenor = () => {
    listaDeAlumnos.sort((a, b) => b.nota - a.nota);

    ocultarMensajes();
    mostrarListaDeAlumnosOrdenada();

}

// Funcion para ordenar de menor a mayor nota

const menorParaMayor = () => {
    listaDeAlumnos.sort((a, b) => a.nota - b.nota);

    ocultarMensajes();
    mostrarListaDeAlumnosOrdenada();

}

// Función para mostrar aprobados

const aprobados = () => {
    const aprobados = listaDeAlumnos.filter(alumno => alumno.aprobado);

    ocultarMensajes();


    if (aprobados.length === 0 && listaDeAlumnos.length > 0) {
        document.getElementById("vacioAprobados").style.display = "none";
        setTimeout(() => {
            document.getElementById("mensajeCargando").style.display = "none";
            document.getElementById("vacioAprobados").style.display = "block";
        }, 1000);
        document.getElementById("vacioDesaprobados").style.display = "none";
    } else {
        document.getElementById("vacioAprobados").style.display = "none";
    }

    mostrarAlumnosFiltrados(aprobados);
}


// Función para mostrar desaprobados

const desaprobados = () => {
    ocultarMensajes();

    const desaprobados = listaDeAlumnos.filter(alumno => !alumno.aprobado);

    if (desaprobados.length === 0 && listaDeAlumnos.length > 0) {

        setTimeout(() => {
            document.getElementById("mensajeCargando").style.display = "none";
            document.getElementById("vacioDesaprobados").style.display = "block";
        }, 1000);


        document.getElementById("vacioAprobados").style.display = "none";
    } else {
        document.getElementById("vacioDesaprobados").style.display = "none";
    }

    mostrarAlumnosFiltrados(desaprobados);
}



// Función para ocultar mensajes 

const ocultarMensajes = () => {
    document.getElementById("vacioAprobados").style.display = "none";
    document.getElementById("vacioDesaprobados").style.display = "none";
}


// Función para ordenar alfabeticamente

const ordenarAlfabeto = () => {
    listaDeAlumnos.sort((a, b) => {
        const nombreA = a.nombre.toLowerCase();
        const nombreB = b.nombre.toLowerCase();

        return nombreA < nombreB ? -1 : nombreA > nombreB ? 1 : 0;


    })

    ocultarMensajes();
    mostrarListaDeAlumnosOrdenada();
}

// Función para eliminar alumno


const eliminarAlumno = (idx) => {
    listaDeAlumnos.splice(idx, 1);
    localStorage.setItem("listaDeAlumnos", JSON.stringify(listaDeAlumnos))

    mostrarListaDeAlumnos();
}




// Funcion sweet alert eliminar alumno

const sweetAlertEliminar = (idx) => {
    const alumnoEliminar = listaDeAlumnos[idx];

    Swal.fire({
        icon: 'warning',
        text: `Estás seguro? Vas a eliminar al alumno ${alumnoEliminar.nombre} ${alumnoEliminar.apellido}`,
        showDenyButton: true,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
        allowEscapeKey: true,
        background: "#001000",
        color: "#fff"
    }).then((result) => {
        if (result.isConfirmed) {

            eliminarAlumno(idx);
            Toastify({
                text: "Alumno eliminado.",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "#ff0000",
                }
            }).showToast();
        } else if (result.isDenied) {
            Swal.fire({
                icon: 'error',
                text: 'No se eliminará el alumno',
                allowEscapeKey: true,
                background: "#001000",
                color: "#fff"
            })
        }
    })
}



// Fetch

if (listaDeAlumnos.length === 0) {
    fetch('api.json')
        .then(response => response.json())
        .then(response => {
            listaDeAlumnos.push(...response);
            localStorage.setItem('listaDeAlumnos', JSON.stringify(response));
        })
}


// Botón para mostrar lista

const botonMostrar = document.querySelector(".btn-mostrar");
botonMostrar.addEventListener("click", mostrarListaDeAlumnos);

// Botón para filtrar de mayor a menor nota

const botonMayorParaMenor = document.querySelector(".btn-mayorMenor");
botonMayorParaMenor.addEventListener("click", mayorParaMenor);


// Botón para filtrar de menor a mayor nota

const botonMenorParaMayor = document.querySelector(".btn-menorMayor");
botonMenorParaMayor.addEventListener("click", menorParaMayor);

// Botón para filtrar por aprobados

const botonAprobados = document.querySelector(".btn-aprobados");
botonAprobados.addEventListener("click", aprobados);

// Botón para filtrar desaprobados

const botonDesaprobados = document.querySelector(".btn-desaprobados");
botonDesaprobados.addEventListener("click", desaprobados);

// Botón para filtrar por orden alfabético

const botonAlfabeto = document.querySelector(".btn-alfabeto");
botonAlfabeto.addEventListener("click", ordenarAlfabeto);


// Botón para mostrar lista para editar

const botonEditarDom = document.querySelector(".btn-editar");
botonEditarDom.addEventListener("click", mostrarListaEditar)