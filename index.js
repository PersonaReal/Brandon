const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de la Cafetería del CRUI funcionando');
});

const productos = [
{ id: 1, nombre: 'Café con leche', precio: 1800, categoria: 'bebida' },
{ id: 2, nombre: 'Medialuna', precio: 900, categoria: 'comida' },
{ id: 3, nombre: 'Tostado de jamón y queso', precio: 3500, categoria: 'comida' },
{ id: 4, nombre: 'Agua mineral', precio: 1200, categoria: 'bebida' }
];

app.get('/api/productos', (req, res) => {
    res.json(productos);
});

app.get('/api/productos/:id', (req, res) => {
   
    const productoId = Number(req.params.id);
    
    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        return res.status(404).json({ error: "[404] Producto no encontrado" });
    }

    res.json(producto);
});

app.post('/api/productos', (req, res) => {
    const { nombre, precio, categoria } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: "[estado HTTP 400] Debe tener nombre" });
    }

    if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ error: "[estado HTTP 400] El precio debe ser un número y ser mayor a 0" });
    }

    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        precio: precio,
        categoria: categoria 
    };

    productos.push(nuevoProducto);

    res.status(201).json(nuevoProducto);
});

app.delete('/api/productos/:id', (req, res) => {
   
    const productoId = Number(req.params.id);

    const indice = productos.findIndex(p => p.id === productoId);

    if (indice === -1) {
        return res.status(404).json({ error: "[404] No se encontr\ó el producto, intente nuevamente." });
    }

    productos.splice(indice, 1);

    res.status(200).json({ mensaje: `[200]Producto con ID ${productoId} eliminado correctamente` });
});

app.put('/api/productos/:id', (req, res) => {
    const productoId = Number(req.params.id);
    const { nombre, precio, categoria } = req.body;

    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        return res.status(404).json({ error: "[404] Producto no encontrado." });
    } else if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: "[estado HTTP 400] Debe tener nombre y debe ser texto." });
    } else if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ error: "[estado HTTP 400] El precio debe ser un número y ser mayor a 0." });
    }

    producto.nombre = nombre;
    producto.precio = precio;
    producto.categoria = categoria || producto.categoria;

    res.status(200).json(producto);
});


app.listen(PORT, () => {
    console.log(`Servidor transmitiendo en el puerto ${PORT}`);
});