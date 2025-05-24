document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Form gönderimi başladı');
        
        // Form elemanlarını seç
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // Form verilerini doğrula
        if (!validateForm(nameInput, emailInput, phoneInput, subjectInput, messageInput)) {
            console.log('Form doğrulama başarısız');
            return;
        }
        
        // Manuel form gönderimi için bildirim göster
        const manualSubmitInfo = document.createElement('div');
        manualSubmitInfo.className = 'form-notification';
        manualSubmitInfo.style.backgroundColor = '#f8d7da';
        manualSubmitInfo.style.color = '#721c24';
        manualSubmitInfo.style.padding = '15px';
        manualSubmitInfo.style.marginTop = '20px';
        manualSubmitInfo.style.borderRadius = '4px';
        manualSubmitInfo.style.textAlign = 'center';
        manualSubmitInfo.innerHTML = `
            <strong>Form gönderiminde sorun oluştu!</strong><br>
            Lütfen aşağıdaki yöntemlerden biriyle bize ulaşın:<br>
            1. E-posta: <a href="mailto:serkanak231@gmail.com">serkanak231@gmail.com</a><br>
            2. Telefon: (541) 839 04 80<br>
            3. WhatsApp: <a href="https://wa.me/905418390480">WhatsApp'tan mesaj gönderin</a>
        `;
        
        // Gönderme butonunu devre dışı bırak ve "Gönderiliyor..." metnini göster
        submitButton.disabled = true;
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Gönderiliyor...';
        
        // Form verilerini topla
        const formData = new FormData();
        formData.append('name', nameInput.value);
        formData.append('email', emailInput.value);
        formData.append('phone', phoneInput.value);
        formData.append('subject', subjectInput.value);
        formData.append('message', messageInput.value);
        
        console.log('AJAX isteği gönderiliyor...');
        
        // AJAX isteği gönder
        fetch('contact-form-handler.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Ham yanıt:', response);
            return response.text();
        })
        .then(text => {
            console.log('Yanıt metni:', text);
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('JSON ayrıştırma hatası:', e);
                throw new Error('Sunucu yanıtı geçersiz.');
            }
        })
        .then(data => {
            console.log('İşlenmiş veri:', data);
            // Sonuç için bildirim göster
            showNotification(data.success, data.message);
            
            // Form başarıyla gönderildiyse, formu temizle
            if (data.success) {
                contactForm.reset();
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            // AJAX başarısız olduğunda manuel gönderim bilgisini göster
            contactForm.appendChild(manualSubmitInfo);
            showNotification(false, 'Form gönderiminde teknik bir sorun oluştu. Lütfen alternatif iletişim yöntemlerini kullanın.');
        })
        .finally(() => {
            // Gönderme butonunu tekrar etkinleştir
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    });
    
    // Form doğrulama fonksiyonu
    function validateForm(nameInput, emailInput, phoneInput, subjectInput, messageInput) {
        // Hata mesajlarını temizle
        clearErrors();
        
        let isValid = true;
        
        // Ad Soyad kontrolü
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Adınızı ve soyadınızı giriniz.');
            isValid = false;
        }
        
        // E-posta kontrolü
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'E-posta adresinizi giriniz.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Geçerli bir e-posta adresi giriniz.');
            isValid = false;
        }
        
        // Telefon kontrolü
        if (phoneInput.value.trim() === '') {
            showError(phoneInput, 'Telefon numaranızı giriniz.');
            isValid = false;
        }
        
        // Konu kontrolü
        if (subjectInput.value === '') {
            showError(subjectInput, 'Bir konu seçiniz.');
            isValid = false;
        }
        
        // Mesaj kontrolü
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Mesajınızı giriniz.');
            isValid = false;
        }
        
        return isValid;
    }
    
    // E-posta doğrulama fonksiyonu
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Hata mesajı gösterme fonksiyonu
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e63946';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
        formGroup.appendChild(errorElement);
        
        // Input'a hata sınıfı ekle
        input.style.borderColor = '#e63946';
    }
    
    // Hata mesajlarını temizleme fonksiyonu
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#ddd';
        });
    }
    
    // Bildirim gösterme fonksiyonu
    function showNotification(isSuccess, message) {
        // Eğer zaten bir bildirim varsa onu kaldır
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Yeni bildirim oluştur
        const notification = document.createElement('div');
        notification.className = 'form-notification';
        notification.textContent = message;
        
        // Başarı veya hata durumuna göre stili ayarla
        if (isSuccess) {
            notification.style.backgroundColor = '#4CAF50';
        } else {
            notification.style.backgroundColor = '#e63946';
        }
        
        // Bildirim stilini ayarla
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.marginTop = '20px';
        notification.style.borderRadius = '4px';
        notification.style.textAlign = 'center';
        
        // Bildirimi formun altına ekle
        contactForm.appendChild(notification);
        
        // 5 saniye sonra bildirimi kaldır
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
});