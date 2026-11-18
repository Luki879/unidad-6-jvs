// ===================================================
// 1. CLASE Y BASE DE DATOS (MóDULO 5)
// ===================================================

class Producto {
    constructor(id, nombre, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    sumarIva() {
        return this.precio * 1.21;
    }

    vender(cantidad) {
        if (cantidad <= this.stock) {
            this.stock -= cantidad;
            return true;
        }
        return false;
    }
}

// Array de objetos instanciados
const productos = [
    new Producto(1, "Remera", 15000, 10),
    new Producto(2, "Pantalón de Jean", 25000, 8),
    new Producto(3, "Zapatillas", 40000, 5),
    new Producto(4, "Buzo", 30000, 12),
    new Producto(5, "Campera", 60000, 4)
];

// ===================================================
// 2. FUNCIONES DE ORDEN SUPERIOR (PRE-ENTREGA 6)
// ===================================================

// A. RECORRIDO (forEach)
function mostrarCatalogoCompleto(lista) {
    console.log("=== CATÁLOGO COMPLETO DE PRODUCTOS ===");
    lista.forEach((prod) => {
        console.log(`[ID ${prod.id}] ${prod.nombre} | Precio: $${prod.precio} | Stock: ${prod.stock} unidades`);
    });
}

// B. TRANSFORMACIÓN (map) -> Genera lista formateada con precios con IVA
function obtenerPreciosConIva(lista) {
    return lista.map((prod) => {
        return {
            nombre: prod.nombre,
            precioBase: prod.precio,
            precioConIva: prod.sumarIva()
        };
    });
}

// C. TRANSFORMACIÓN (reduce) -> Calcula el valor total acumulado en el inventario
function calcularValorTotalInventario(lista) {
    return lista.reduce((acumulador, prod) => acumulador + (prod.precio * prod.stock), 0);
}

// D. BÚSQUEDA (find) -> Busca un producto específico por nombre exacto (insensible a mayúsculas)
function buscarProductoPorNombre(lista, nombreBuscado) {
    return lista.find((prod) => prod.nombre.toLowerCase() === nombreBuscado.toLowerCase());
}

// E. BÚSQUEDA / FILTRADO (filter) -> Filtra productos por un precio máximo ingresado
function filtrarPorPrecioMaximo(lista, precioMax) {
    return lista.filter((prod) => prod.precio <= precioMax);
}

// F. BÚSQUEDA / VALIDACIÓN (some) -> Verifica si hay algún producto agotado
function hayProductosSinStock(lista) {
    return lista.some((prod) => prod.stock === 0);
}

// ===================================================
// 3. EJECUCIÓN E INTERACCIÓN CON EL USUARIO
// ===================================================

// Muestra el catálogo inicial en la consola
mostrarCatalogoCompleto(productos);

// Demostración de transformaciones en consola
console.log("=== LISTA DE PRECIOS CON IVA (map) ===");
console.table(obtenerPreciosConIva(productos));

const valorTotalStock = calcularValorTotalInventario(productos);
console.log(`=== VALOR TOTAL INVERTIDO EN STOCK (reduce): $${valorTotalStock} ===`);

// Bucle interactivo con el usuario
let menuContinuar = true;

while (menuContinuar) {
    let opcion = prompt(
        "¿Qué acción querés realizar?\n" +
        "1 - Buscar un producto por nombre (find)\n" +
        "2 - Filtrar productos por presupuesto máximo (filter)\n" +
        "3 - Realizar una compra\n" +
        "4 - Ver reporte total del inventario (reduce)\n" +
        "Escribí CANCELAR o el número de opción:"
    );

    if (opcion === null) {
        menuContinuar = false;
        break;
    }

    switch (opcion.trim()) {
        case "1": {
            let busqueda = prompt("Ingresá el nombre del producto que querés buscar:");
            if (busqueda) {
                let encontrado = buscarProductoPorNombre(productos, busqueda);
                if (encontrado) {
                    alert(`¡Encontrado!\n${encontrado.nombre} - Precio: $${encontrado.precio} | Stock: ${encontrado.stock}`);
                    console.log("Producto hallado con find():", encontrado);
                } else {
                    alert(`El producto "${busqueda}" no existe en el catálogo.`);
                }
            }
            break;
        }

        case "2": {
            let presupuesto = parseFloat(prompt("Ingresá tu presupuesto máximo ($):"));
            if (!isNaN(presupuesto) && presupuesto > 0) {
                let filtrados = filtrarPorPrecioMaximo(productos, presupuesto);
                if (filtrados.length > 0) {
                    let mensaje = `Productos disponibles por $${presupuesto} o menos:\n\n`;
                    filtrados.forEach((p) => {
                        mensaje += `- ${p.nombre}: $${p.precio}\n`;
                    });
                    alert(mensaje);
                    console.log("Productos filtrados con filter():", filtrados);
                } else {
                    alert(`No hay productos con precio menor o igual a $${presupuesto}.`);
                }
            } else {
                alert("Presupuesto no válido.");
            }
            break;
        }

        case "3": {
            let menuCompra = "Seleccioná el número de producto para comprar:\n";
            productos.forEach((p, index) => {
                menuCompra += `${index + 1} - ${p.nombre} ($${p.precio}) [Stock: ${p.stock}]\n`;
            });

            let seleccion = parseInt(prompt(menuCompra));
            if (!isNaN(seleccion) && seleccion >= 1 && seleccion <= productos.length) {
                let prodSeleccionado = productos[seleccion - 1];
                let cantidad = parseInt(prompt(`¿Cuántas unidades de "${prodSeleccionado.nombre}" querés?`));

                if (!isNaN(cantidad) && cantidad > 0) {
                    if (prodSeleccionado.vender(cantidad)) {
                        let total = prodSeleccionado.precio * cantidad;
                        alert(`¡Compra exitosa!\nProducto: ${prodSeleccionado.nombre}\nCantidad: ${cantidad}\nTotal: $${total}\nStock restante: ${prodSeleccionado.stock}`);
                        console.log(`Venta realizada. Stock actualizado de ${prodSeleccionado.nombre}: ${prodSeleccionado.stock}`);
                    } else {
                        alert(`Stock insuficiente. Solo quedan ${prodSeleccionado.stock} unidades.`);
                    }
                } else {
                    alert("Cantidad inválida.");
                }
            } else {
                alert("Opción no válida.");
            }
            break;
        }

        case "4": {
            let totalActualizado = calcularValorTotalInventario(productos);
            alert(`El valor total acumulado del inventario actual es de: $${totalActualizado}`);
            console.log("Reporte de valor total (reduce):", totalActualizado);
            break;
        }

        default:
            alert("Opción no reconocida.");
            break;
    }

    let respuesta = prompt("¿Querés hacer otra consulta?\nEscribí SI o NO");
    if (!respuesta || respuesta.toLowerCase() !== "si") {
        menuContinuar = false;
    }
}

console.log("=== ESTADO FINAL DEL CATÁLOGO DESPUÉS DE LA INTERACCIÓN ===");
mostrarCatalogoCompleto(productos);
alert("Gracias por usar el simulador.");