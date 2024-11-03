document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.getElementById('inputBuscar');
    const searchButton = document.getElementById('btnBuscar');
    const container = document.getElementById('contenedor');

    async function searchNASAImages(query) {
        try {
            
            container.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>`;

            const response = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }

            const data = await response.json();
            
            const images = data.collection.items.filter(item => 
                item.links?.some(link => link.render === 'image') &&
                item.data?.[0]?.media_type === 'image'
            );

            if (images.length === 0) {
                container.innerHTML = `
                    <div class="alert alert-info" role="alert">
                        No se encontraron imágenes para: "${query}"
                    </div>`;
                return;
            }

            container.innerHTML = `
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                    ${images.map(item => {
                        const imageUrl = item.links.find(link => link.render === 'image').href;
                        const imageData = item.data[0];
                        return `
                            <div class="col">
                                <div class="card h-100">
                                    <img src="${imageUrl}" class="card-img-top" alt="${imageData.title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${imageData.title}</h5>
                                        <p class="card-text"><small class="text-muted">
                                            ${new Date(imageData.date_created).toLocaleDateString()}
                                        </small></p>
                                        <p class="card-text">${imageData.description}</p>
                                    </div>
                                </div>
                            </div>`;
                    }).join('')}
                </div>`;

        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Ocurrió un error al buscar las imágenes. Por favor, intenta de nuevo.
                </div>`;
        }
    }

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchNASAImages(searchTerm);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchNASAImages(searchTerm);
            }
        }
    });
});