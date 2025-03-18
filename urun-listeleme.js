document.addEventListener("DOMContentLoaded", function () {
  // Ürün listesini gösterecek container'ı seç
  const productsGrid = document.querySelector(".products-grid");

  // Eğer ürünler container'ı sayfada varsa işleme devam et
  if (productsGrid) {
    // Container'ı temizle (varolan demo ürünleri kaldır)
    productsGrid.innerHTML = "";

    // Her ürün için bir kart oluştur
    urunler.forEach((urun) => {
      // Ürün kartı HTML'ini oluştur
      const urunHTML = `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${urun.resim}" alt="${urun.malzemeturu}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${urun.malzemeturu}</h3>
                        <div class="product-price">₺${urun.fiyat.toLocaleString(
                          "tr-TR"
                        )}</div>
                        <div class="product-meta">
                            <div>Marka: ${urun.marka}</div>
                            <div>Stokta</div>
                        </div>
                    </div>
                </div>
            `;

      // Oluşturulan HTML'i ürünler container'ına ekle
      productsGrid.innerHTML += urunHTML;
    });
  }

  // Sidebar'da marka filtresi için benzersiz markaları al
  const markalar = [...new Set(urunler.map((urun) => urun.marka))];
  const markaListesi = document.querySelector(
    ".sidebar-section:nth-child(3) .category-list"
  );

  if (markaListesi) {
    markaListesi.innerHTML = "";
    markalar.forEach((marka) => {
      markaListesi.innerHTML += `<li><a href="#" data-marka="${marka}">${marka}</a></li>`;
    });

    // Marka filtreleme işlevselliğini ekle
    const markaLinkleri = markaListesi.querySelectorAll("a");
    markaLinkleri.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const seciliMarka = this.getAttribute("data-marka");
        filtreleMarkayaGore(seciliMarka);

        // Aktif sınıfını kaldır ve seçilen linke ekle
        markaLinkleri.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // Fiyat aralığı filtreleme için
  const fiyatLinkleri = document.querySelectorAll(
    ".sidebar-section:nth-child(2) .category-list a"
  );
  if (fiyatLinkleri) {
    fiyatLinkleri.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const fiyatText = this.textContent;
        filtreleFiyataGore(fiyatText);

        // Aktif sınıfını kaldır ve seçilen linke ekle
        fiyatLinkleri.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  const turLinkleri = document.querySelectorAll(
    ".sidebar-section:nth-child(1) .category-list a"
  );

  if (turLinkleri) {
    turLinkleri.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const tur = this.getAttribute("data-key")
        filtreleTureGore(tur);

        fiyatLinkleri.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  console.log(turLinkleri);

  // Tüm ürünler bağlantısı için listener
  const tumUrunlerLink = document.querySelector(
    ".category-list li:first-child a"
  );
  if (tumUrunlerLink) {
    tumUrunlerLink.addEventListener("click", function (e) {
      e.preventDefault();
      tumUrunleriGoster();

      // Tüm aktif sınıflarını kaldır ve bu linke ekle
      document
        .querySelectorAll(".category-list a")
        .forEach((a) => a.classList.remove("active"));
      this.classList.add("active");
    });
  }

  // Sıralama butonu için listener
  const sortButton = document.querySelector(".sort-button");
  if (sortButton) {
    sortButton.addEventListener("click", function () {
      // Basit bir sıralama seçeneği menüsü göster
      const menu = document.createElement("div");
      menu.className = "sort-menu";
      menu.style.position = "absolute";
      menu.style.backgroundColor = "white";
      menu.style.border = "1px solid #ddd";
      menu.style.borderRadius = "4px";
      menu.style.padding = "10px";
      menu.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      menu.style.zIndex = "100";

      menu.innerHTML = `
                <div style="cursor:pointer; padding:5px;" onclick="siralaFiyataGore('artan')">Fiyata Göre Artan</div>
                <div style="cursor:pointer; padding:5px;" onclick="siralaFiyataGore('azalan')">Fiyata Göre Azalan</div>
                <div style="cursor:pointer; padding:5px;" onclick="siralaAdaGore()">İsme Göre (A-Z)</div>
            `;

      // Menüyü butonun altına ekle
      const rect = this.getBoundingClientRect();
      menu.style.top = rect.bottom + window.scrollY + "px";
      menu.style.left = rect.left + "px";

      // Var olan menüyü kaldır (eğer varsa)
      const oldMenu = document.querySelector(".sort-menu");
      if (oldMenu) oldMenu.remove();

      document.body.appendChild(menu);

      // Menü dışına tıklandığında menüyü kapat
      document.addEventListener("click", function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== sortButton) {
          menu.remove();
          document.removeEventListener("click", closeMenu);
        }
      });
    });
  }
});

// Fiyata göre filtreleme fonksiyonu
function filtreleFiyataGore(fiyatAraligi) {
  const productsGrid = document.querySelector(".products-grid");
  productsGrid.innerHTML = "";

  // Fiyat aralığını parse et
  let minFiyat = 0;
  let maxFiyat = Infinity;

  if (fiyatAraligi.includes("-")) {
    const aralik = fiyatAraligi.replace(/₺/gm, "").split(" - "); // Regex olan // işaretleri içinde bulunan değerlerin tamamını g-global ile değiştirmesini sağlar
    minFiyat = parseInt(aralik[0]);
    maxFiyat = parseInt(aralik[1]);
  } else if (fiyatAraligi.includes("+")) {
    minFiyat = parseInt(fiyatAraligi.replace("₺", "").replace("+", ""));
  }

  // Ürünleri filtrele
  const filtrelenmisUrunler = urunler.filter((urun) => {
    return urun.fiyat >= minFiyat && urun.fiyat <= maxFiyat;
  });

  // Filtrelenmiş ürünleri göster
  filtrelenmisUrunler.forEach((urun) => {
    const urunHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${urun.resim}" alt="${urun.malzemeturu}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${urun.malzemeturu}</h3>
                    <div class="product-price">₺${urun.fiyat.toLocaleString(
                      "tr-TR"
                    )}</div>
                    <div class="product-meta">
                        <div>Marka: ${urun.marka}</div>
                        <div>Stokta</div>
                    </div>
                </div>
            </div>
        `;
    productsGrid.innerHTML += urunHTML;
  });
}

// Markaya göre filtreleme fonksiyonu
function filtreleMarkayaGore(marka) {
  const productsGrid = document.querySelector(".products-grid");
  productsGrid.innerHTML = "";

  // Ürünleri filtrele
  const filtrelenmisUrunler = urunler.filter((urun) => urun.marka === marka);

  // Filtrelenmiş ürünleri göster
  filtrelenmisUrunler.forEach((urun) => {
    const urunHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${urun.resim}" alt="${urun.malzemeturu}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${urun.malzemeturu}</h3>
                    <div class="product-price">₺${urun.fiyat.toLocaleString(
                      "tr-TR"
                    )}</div>
                    <div class="product-meta">
                        <div>Marka: ${urun.marka}</div>
                        <div>Stokta</div>
                    </div>
                </div>
            </div>
        `;
    productsGrid.innerHTML += urunHTML;
  });
}

// Tüm ürünleri gösterme fonksiyonu
function tumUrunleriGoster() {
  const productsGrid = document.querySelector(".products-grid");
  productsGrid.innerHTML = "";

  urunler.forEach((urun) => {
    const urunHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${urun.resim}" alt="${urun.malzemeturu}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${urun.malzemeturu}</h3>
                    <div class="product-price">₺${urun.fiyat.toLocaleString(
                      "tr-TR"
                    )}</div>
                    <div class="product-meta">
                        <div>Marka: ${urun.marka}</div>
                        <div>Stokta</div>
                    </div>
                </div>
            </div>
        `;
    productsGrid.innerHTML += urunHTML;
  });
}

// Fiyata göre sıralama fonksiyonu
function siralaFiyataGore(siralama) {
  const productsGrid = document.querySelector(".products-grid");
  const siralananUrunler = [...urunler];

  if (siralama === "artan") {
    siralananUrunler.sort((a, b) => a.fiyat - b.fiyat);
  } else {
    siralananUrunler.sort((a, b) => b.fiyat - a.fiyat);
  }

  productsGrid.innerHTML = "";

  siralananUrunler.forEach((urun) => {
    const urunHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${urun.resim}" alt="${urun.malzemeturu}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${urun.malzemeturu}</h3>
                    <div class="product-price">₺${urun.fiyat.toLocaleString(
                      "tr-TR"
                    )}</div>
                    <div class="product-meta">
                        <div>Marka: ${urun.marka}</div>
                        <div>Stokta</div>
                    </div>
                </div>
            </div>
        `;
    productsGrid.innerHTML += urunHTML;
  });

  // Sıralama menüsünü kapat
  const menu = document.querySelector(".sort-menu");
  if (menu) menu.remove();
}

// İsme göre sıralama fonksiyonu
function siralaAdaGore() {
  const productsGrid = document.querySelector(".products-grid");
  const siralananUrunler = [...urunler];

  siralananUrunler.sort((a, b) => {
    return a.malzemeturu.localeCompare(b.malzemeturu, "tr");
  });

  productsGrid.innerHTML = "";

  siralananUrunler.forEach((urun) => {
    const urunHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${urun.resim}" alt="${urun.malzemeturu}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${urun.malzemeturu}</h3>
                    <div class="product-price">₺${urun.fiyat.toLocaleString(
                      "tr-TR"
                    )}</div>
                    <div class="product-meta">
                        <div>Marka: ${urun.marka}</div>
                        <div>Stokta</div>
                    </div>
                </div>
            </div>
        `;
    productsGrid.innerHTML += urunHTML;
  });

  // Sıralama menüsünü kapat
  const menu = document.querySelector(".sort-menu");
  if (menu) menu.remove();
}

function filtreleTureGore(tur) {
  const productsGrid = document.querySelector(".products-grid");
  productsGrid.innerHTML = "";

  
  // Ürünleri filtrele
  const filtrelenmisUrunler = urunler.filter((urun) => urun.tur === tur);

  // Filtrelenmiş ürünleri göster
  filtrelenmisUrunler.forEach((urun) => {
    const urunHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${urun.resim}" alt="${urun.malzemeturu}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${urun.malzemeturu}</h3>
                    <div class="product-price">₺${urun.fiyat.toLocaleString(
                      "tr-TR"
                    )}</div>
                    <div class="product-meta">
                        <div>Marka: ${urun.marka}</div>
                        <div>Stokta</div>
                    </div>
                </div>
            </div>
        `;
    productsGrid.innerHTML += urunHTML;
  });
}
