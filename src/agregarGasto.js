import { v4 as uuidv4 } from 'uuid';
import { cerrarFormularioGasto } from './;eventoFormularioGasto';
import cargarGastos from './cargarGastos';

const formulario = document.querySelector('#formulario-gasto, form');
const descripcion = formulario.descripcion;
const precio = formulario.precio;

const expresionRegular = /^[a-zA-Z0-9\_\- ]{4,30}$/;
const expresionRegularPrecio = /^\d+(\.\d+)?$/;

const comprobarDescripcion = () => {
    if (!expresionRegular.test(descripcion.value)) {
        descripcion.classList.add('formulario-gasto__input--error');

        formulario.descripcion.parentElement
            .querySelector('.formulario-gasto__leyenda')
            .classList.add('formulario-gasto__leyenda--active');
        return false;
    } else {
        descripcion.classList.remove('formulario-gasto__input--error');
        formulario.descripcion.parentElement
            .querySelector('.formulario-gasto__leyenda')
            .classList.remove('formulario-gasto__leyenda--active');
        return true;
    }
};

const comprobarPrecio = () => {
    if (!expresionRegularPrecio.test(precio.value)) {
        precio.classList.add('formulario-gasto__input--error');

        formulario.precio.parentElement
            .querySelector('.formulario-gasto__leyenda')
            .classList.add('formulario-gasto__leyenda--active');
        return false;
    } else {
        precio.classList.remove('formulario-gasto__input--error');

        formulario.precio.parentElement
            .querySelector('.formulario-gasto__leyenda')
            .classList.remove('formulario-gasto__leyenda--active');
        return true;
    }

}

//Event listener para cuando el input descripcion pierde el focus 
descripcion.addEventListener('blur', (e) => comprobarDescripcion());
//EventListener para cuando el input tiene un error y el usuario empieza a rscribir para corregirlo
descripcion.addEventListener('keyup', (e) => {
    if ([...e.target.classList].includes('formulario-gasto__input--error')) {
        comprobarDescripcion();
    }
})
//EventListener para cuando el input del precio pierde el focus
precio.addEventListener('blur', (e) => comprobarPrecio());
//EventListener para cuando el input tiene un error y el usuario empieza a rscribir para corregirlo
precio.addEventListener('keyup', (e) => {
    if ([...e.target.classList].includes('formulario-gasto__input--error')) {
        comprobarPrecio();
    }
})

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    //Si ambos devuelven true, se ejecuta el codigo
    if (comprobarDescripcion() && comprobarPrecio()) {
        const nuevoGasto = {
            id: uuidv4(), // esta funcion le da un id unico 
            fecha: new Date(),
            descripcion: descripcion.value,
            precio: descripcion.precio
        }
        const gastosGuardados = JSON.parse(window.localStorage.getItem('gastos'));
        console.log(gastosGuardados);

        //Comprobamos si hay gastos
        if (gastosGuardados) {
            //Creamos una nueva lista de gastos que incluya el nuevo
            const nuevosGastos = [...gastosGuardados, nuevoGasto]
            window.localStorage.setItem('gastos', JSON.stringify(nuevosGastos));
        } else {
            //Agregamos el primer gasto
            window.localStorage.setItem('gastos', JSON.stringify([{ ...nuevoGasto }]));
        }//En local storage no podemos guardar arreglos, solo cadenas de texto. con json los convertimos y a eso lo convertimos en un nuevo arreglo
        descripcion.value = '';
        precio.value = '';
        cargarGastos();
        cerrarFormularioGasto();

    }
})