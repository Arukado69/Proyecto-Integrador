document.addEventListener('DOMContentLoaded', () => {
        // 1. RECUPERAR LA ORDEN CREADA EN EL PASO ANTERIOR
        const orden = JSON.parse(localStorage.getItem('ordenRecienteWoof'));

        // Seguridad: Si no hay orden reciente, regresar al inicio
        if (!orden) {
            window.location.href = '/index.html';
            return;
        }

        // 2. MOSTRAR DATOS EN PANTALLA
        document.getElementById('nombreCliente').innerText = orden.cliente.nombre;
        document.getElementById('numeroOrden').innerText = orden.id;
        document.getElementById('fechaOrden').innerText = orden.fecha;
        document.getElementById('totalPagado').innerText = orden.total;
        document.getElementById('correoCliente').innerText = orden.cliente.email;
        
        // Formatear método de pago para que se vea bonito
        const metodoMap = {
            'tarjeta': 'Tarjeta de Crédito/Débito',
            'paypal': 'PayPal',
            'oxxo': 'OXXO / Transferencia'
        };
        document.getElementById('metodoPago').innerText = metodoMap[orden.metodo] || orden.metodo;

        // 3. EFECTO CONFETTI 
        if(window.confetti) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#F2A413', '#F27405', '#95A617'] //colores de marca woof
            });
        }

        // 4. LIMPIEZA DEL CARRITO 
        // Ya se confirmó la compra, así que vaciamos el carrito del navegador.
        localStorage.removeItem('carritoWoofBarf');
        localStorage.removeItem('resumenPedido');
        localStorage.removeItem('datosEnvioWoof');
        
    });