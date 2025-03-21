document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Arama çubuğuna yazıldıkça arama işlemi başlasın
    searchInput.addEventListener('input', function () {
        searchProducts();
    });

    function searchProducts() {
        const query = searchInput.value.toLowerCase().trim();
        searchResults.innerHTML = '';  // Önceki sonuçları temizle

        if (query === '') {
            searchResults.style.display = 'none';
            return;
        }

        const filteredProducts = urunler.filter(urun =>
            urun.malzemeturu.toLowerCase().includes(query) ||
            urun.marka.toLowerCase().includes(query) ||
            urun.tur.toLowerCase().includes(query)
        );

        if (filteredProducts.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        searchResults.style.display = 'block';

        filteredProducts.forEach(product => {
            const item = document.createElement('div');
            item.classList.add('search-result-item');

            item.innerHTML = `
                <img src="${product.resim}" alt="${product.malzemeturu}" class="search-result-img">
                <div>
                    <div class="search-result-title">${product.malzemeturu}</div>
                    <div class="search-result-price">${product.fiyat}₺</div>
                </div>
            `;

            item.addEventListener('click', function() {
                window.location.href = `product-detail-page.html?id=${product.id}`;
            });

            searchResults.appendChild(item);
        });
    }
});
