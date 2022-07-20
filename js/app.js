const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function  validarFormulario(e) {
    e.preventDefault()
    
    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ""){
        console.log('Agrega un termino de busqueda')
        mostrarAlerta('Campo vacio')
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-600', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center')
    
        alerta.innerHTML = `
         <strong class="font-bold">Error!</strong>
         <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

async function buscarImagenes() {

    const termino = document.querySelector('#termino').value;

    const key = "27894133-42ba4f4a95497c9ddf7e74641";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        totalPaginas = calcularPaginas(resultado.totalHits)
        console.log(totalPaginas)
       mostrarImagenes(resultado.hits)
    } catch (error) {
        console.log(error)
    }

}

// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for (let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }

    // Iterar sobre el arreglo de imagenes y construir HTML

    imagenes.forEach(imagen => {
        const {previewURL, likes, largeImageURL, tags} = imagen;
        console.log(imagen)
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-1 mb-1" id="contenedor">
                
                <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" >
                    <img class="w-full"  src="${previewURL}">
                        <div class="centrado" id="info">
                        <p class="text-white text-sm shadow">${tags}  🤍${likes}</p>
                        </div>
                 </a>
            </div>
        `;
    });

    //Limpiar paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

    //Generamos el nuevo HTML
    imprimirPaginador()
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const {value, done} = iterador.next()
        if(done) return

        // caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#'
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente','px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4','mt-4', 'uppercase', 'rounded',);

        boton.onclick =  () => {
            paginaActual = value;
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}