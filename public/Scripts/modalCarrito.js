document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const comprobanteForm = document.getElementById('comprobante-form');
    const comprarButton = document.querySelector('.boton-comprar');

    // Abrir modal al hacer clic en el botón "Comprar"
    comprarButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Manejar la subida del comprobante
    comprobanteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(comprobanteForm);
        try {
            const response = await fetch('/api/carrito/comprar', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Error al confirmar la compra.');

            const result = await response.json();
            alert(result.message || 'Compra realizada con éxito.');
            modal.style.display = 'none';
        } catch (error) {
            console.error('Error al confirmar la compra:', error);
            alert('Hubo un problema al confirmar la compra.');
        }
    });
});
