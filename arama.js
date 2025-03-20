document.addEventListener('DOMContentLoaded', function () {
    // Ürünler dizisinin yüklendiğinden emin ol
    if (typeof urunler === 'undefined') {
        console.error('Ürünler JSON verisi yüklenemedi!');
        return;
    }
    
    // Arama kutusunu ve butonu seç
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // Arama butonuna tıklanınca arama yap
    searchButton.addEventListener('click', function () {
        searchProducts();
    });

    // Enter tuşuna basılınca arama yap
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            searchProducts();
        }
    });

    function searchProducts() {
        const query = searchInput.value.toLowerCase().trim();
        if (query === '') return;

        // Aranan kelimeyi içeren ilk ürünü bul
        const foundProduct = urunler.find(urun =>
            urun.malzemeturu.toLowerCase().includes(query) ||
            urun.marka.toLowerCase().includes(query) ||
            (urun.tur && urun.tur.toLowerCase().includes(query))
        );

        if (foundProduct) {
            // Bulunan ürünü detay sayfasına yönlendir
            window.location.href = `product-detail-page.html?id=${foundProduct.id}`;
        } else {
            alert('Sonuç bulunamadı.');
        }
    }
});
