
//Pagina index

document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login-button");

  loginButton.addEventListener("click", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();

    // Validar el nombre del usuario
    const nombreValido = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/.test(nombre);

    if (!nombreValido) {
      swal("Error", "Ingresa un nombre válido (solo letras y espacios)", "error");
      return;
    }

    // Guardar el nombre del usuario en el almacenamiento local
    const nombreUsuario = nombre;
    localStorage.setItem("nombreUsuario", nombreUsuario);

    window.location.href = "pages/principal.html";
  });
});




//Usuario - Dia fecha y hora

document.addEventListener("DOMContentLoaded", function () {
  const usuarioNombre = document.querySelector(".usuario-nombre");
  
  // Recupera el nombre del usuario desde localStorage
  const nombreUsuario = localStorage.getItem("nombreUsuario");

  // Inserta el nombre en el contenedor
  usuarioNombre.textContent = nombreUsuario || "Usuario no registrado";

  // Formatea la fecha y hora
  const fechaHora = document.querySelector(".fecha-hora");
  const fecha = new Date();
  const opcionesFecha = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const opcionesHora = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
  const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);

  // Inserta la fecha y hora formateada en el contenedor
  fechaHora.textContent = `Fecha: ${fechaFormateada} - Hora: ${horaFormateada}`;
});





//levanta los datos del data.json y los carga en la tabla de stock

function fetchAndRenderStock() {
  const url = 'data.json';

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const table = document.querySelector('table');
      data.stock.forEach((item) => {
        const row = table.insertRow();
        row.insertCell(0).textContent = item.Codigo;
        row.insertCell(1).textContent = item.Marca;
        row.insertCell(2).textContent = item.Modelo;
        row.insertCell(3).textContent = item.Caracteristicas;
        row.insertCell(4).textContent = item.Memoria_interna;
        row.insertCell(5).textContent = item.Sistema_operativo;
        row.insertCell(6).textContent = '$' + item.Precio;
        row.insertCell(7).textContent = item.Stock;
      });
    })
    .catch((error) => console.log('Error:', error));
}

document.addEventListener("DOMContentLoaded", function () {
  fetchAndRenderStock();
});




// Variables
let data = [];

// Obtiene los elementos del formulario
const operacionSelect = document.getElementById('operacion');
const productoCodigoSelect = document.getElementById('producto-codigo');
const productoModeloInput = document.getElementById('producto-modelo');
const productoStockSpan = document.getElementById('producto-stock');
const productoPrecioSpan = document.getElementById('producto-precio');
const cantidadInput = document.getElementById('cantidad');
const agregarButton = document.getElementById('agregar');
const procesarButton = document.getElementById('procesar');
const cancelarButton = document.getElementById('cancelar');
const salirButton = document.getElementById('salir');
const productoImagen = document.getElementById('producto-imagen');


// Función para cargar los datos desde el archivo JSON
function cargarDatosJSON() {
    fetch('../pages/data.json')
        .then((response) => response.json())
        .then((jsonData) => {
            data = jsonData.stock;
            llenarListaDesplegableCodigos();
        })
        .catch((error) => {
            console.error('Error al cargar los datos del archivo JSON:', error);
            data = [];
        });
}



// Llena la lista desplegable de códigos
function llenarListaDesplegableCodigos() {
    data.forEach((producto) => {
        const option = document.createElement('option');
        option.value = producto.Codigo;
        option.text = producto.Codigo;
        productoCodigoSelect.appendChild(option);
    });


    // Actualiza la información del producto seleccionado
    actualizarInfoProducto();
}


// Obtener los datos del producto seleccionado
function obtenerDatosProducto(codigo) {
    return data.find((producto) => producto.Codigo === codigo);
}


// Actualizar la información del producto seleccionado
function actualizarInfoProducto() {
    const codigoSeleccionado = productoCodigoSelect.value;
    const productoSeleccionado = obtenerDatosProducto(codigoSeleccionado);

    if (productoSeleccionado) {
        productoModeloInput.value = productoSeleccionado.Modelo;
        productoStockSpan.textContent = productoSeleccionado.Stock;
        productoPrecioSpan.textContent = productoSeleccionado.Precio;

        // Carga la imagen del producto
        productoImagen.src = `../assets/articulos/${codigoSeleccionado}.png`;
    } else {
        // Si no se selecciona un producto, mostrar la imagen por defecto
        productoModeloInput.value = '';
        productoStockSpan.textContent = '';
        productoPrecioSpan.textContent = '';
        productoImagen.src = '../assets/articulos/STANDBY.png';
    }
}


// Agrega datos al formulario
function agregarDatos() {
    const operacion = operacionSelect.value;
    const codigo = productoCodigoSelect.value;
    const modelo = productoModeloInput.value;
    const stock = parseInt(productoStockSpan.textContent);
    const precio = parseFloat(productoPrecioSpan.textContent);
    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert('La cantidad debe ser un número entero positivo.');
        return;
    }

    if (operacion === 'INGRESO') {
        data.find((producto) => producto.Codigo === codigo).Stock += cantidad;
    } else if (operacion === 'EGRESO') {
        if (cantidad > stock) {
            alert('La cantidad de egreso no puede ser mayor que el stock disponible.');
            return;
        }
        data.find((producto) => producto.Codigo === codigo).Stock -= cantidad;
    }

    cantidadInput.value = '';

    actualizarInfoProducto();
}



// Procesar y guardar los datos en el archivo JSON
function procesarDatos() {
    const dataJSON = JSON.stringify({ stock: data });

    fetch('../pages/data.json', {
        method: 'POST',
        body: dataJSON,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((jsonData) => {
            if (jsonData.success) {
                alert('Los datos se han procesado y guardado en el archivo JSON.');
                document.getElementById('movimientos-form').reset();
                actualizarInfoProducto();
            } else {
                alert('Error al guardar los datos en el archivo JSON.');
            }
        })
        .catch((error) => {
            console.error('Error al guardar los datos en el archivo JSON:', error);
        });
}



// Limpiar el formulario
function limpiarFormulario() {
    document.getElementById('movimientos-form').reset();
    actualizarInfoProducto();
}


// Función para salir y redirigir a principal.html
function salir() {
    window.location.href = '../pages/principal.html';
}

// Event listeners
agregarButton.addEventListener('click', agregarDatos);
procesarButton.addEventListener('click', procesarDatos);
cancelarButton.addEventListener('click', limpiarFormulario);
salirButton.addEventListener('click', salir);
productoCodigoSelect.addEventListener('change', actualizarInfoProducto);

// Llama a la función para cargar los datos al cargar la página
cargarDatosJSON();