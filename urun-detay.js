document.addEventListener('DOMContentLoaded', function() {
    // URL'den ürün ID'sini al
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // ID yoksa işlemi durdur
    if (!productId) {
        console.error('Ürün ID bulunamadı');
        return;
    }
    
    // Ürünler dizisinde ID'ye göre ürünü bul
    const product = urunler.find(urun => urun.id == productId);
    
    // Ürün bulunamazsa işlemi durdur
    if (!product) {
        console.error('Ürün bulunamadı');
        return;
    }
    
    // Sayfa başlığını güncelle
    document.title = `BÜYÜKHAN - ${product.malzemeturu}`;
    
    // Ürün bilgilerini güncelle
    const productTitle = document.querySelector('.product-info h1');
    if (productTitle) productTitle.textContent = product.malzemeturu;
    
    const productPrice = document.querySelector('.product-price');
    if (productPrice) productPrice.textContent = `₺${product.fiyat.toLocaleString('tr-TR')}`;
    
    const productBrand = document.querySelector('.meta-item:nth-child(1) div:nth-child(2)');
    if (productBrand) productBrand.textContent = product.marka;
    
    const productCode = document.querySelector('.meta-item:nth-child(2) div:nth-child(2)');
    if (productCode) productCode.textContent = `URN-${product.id}`;
    
    // Ana ürün görselini güncelle
    const mainImage = document.querySelector('.main-image img');
    if (mainImage) mainImage.src = product.resim;
    
    // Breadcrumb (navigasyon yolu) güncelleme
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (breadcrumbContainer) {
        breadcrumbContainer.innerHTML = `
            <a href="index.html">Anasayfa</a> <span>/</span> 
            <a href="products.html">Ürünler</a> <span>/</span> 
            <a href="products.html?tur=${encodeURIComponent(product.tur)}">${product.tur.charAt(0).toUpperCase() + product.tur.slice(1)}</a> <span>/</span>
            <a href="#">${product.malzemeturu}</a>
        `;
    }

    // Ürün detayları sekmesini güncelle
    const productDetails = document.querySelector('.tab-content.active p');
    if (productDetails) {
        productDetails.textContent = `${product.marka} ${product.malzemeturu}, ${product.tur} kategorisinde yer alan kaliteli bir üründür.`;
    }
});
