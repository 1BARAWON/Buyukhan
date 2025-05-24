<?php
// Hata raporlamayı etkinleştir
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Bir log dosyasına hata kaydetme fonksiyonu
function logError($message) {
    $logFile = 'form_errors.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

try {
    // Gelen verileri logla
    logError("Form verisi alındı: " . json_encode($_POST));
    
    // Form verilerini güvenli bir şekilde al
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
    
    // Zorunlu alanları kontrol et
    if (empty($name) || empty($email) || empty($phone) || empty($subject) || empty($message)) {
        throw new Exception('Lütfen tüm alanları doldurunuz.');
    }
    
    // E-posta adresini doğrula
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Geçerli bir e-posta adresi giriniz.');
    }
    
    // Konu başlığını belirle
    $subjectMap = [
        'product' => 'Ürün Bilgisi',
        'order' => 'Sipariş Takibi',
        'technical' => 'Teknik Destek',
        'return' => 'İade ve Değişim',
        'other' => 'Diğer'
    ];
    
    $subjectText = isset($subjectMap[$subject]) ? $subjectMap[$subject] : 'İletişim Formu';
    
    // E-posta içeriğini oluştur
    $emailContent = "BÜYÜKHAN İletişim Formu\n\n";
    $emailContent .= "Adı Soyadı: $name\n";
    $emailContent .= "E-posta: $email\n";
    $emailContent .= "Telefon: $phone\n";
    $emailContent .= "Konu: {$subjectMap[$subject]}\n\n";
    $emailContent .= "Mesaj:\n$message\n";
    
    // E-posta gönderme işlemi yerine sadece kaydedelim
    // Bu, sunucu mail ayarlarından bağımsız çalışacak
    $formDataFile = 'form_submissions.txt';
    $formData = "------------------------------\n";
    $formData .= date('Y-m-d H:i:s') . "\n";
    $formData .= $emailContent . "\n";
    
    if (file_put_contents($formDataFile, $formData, FILE_APPEND)) {
        logError("Form verisi başarıyla kaydedildi");
        echo json_encode(['success' => true, 'message' => 'Mesajınız başarıyla alındı. En kısa sürede size dönüş yapacağız.']);
    } else {
        logError("Form verisi kayıt sırasında hata");
        throw new Exception('Form verisi kaydedilemedi.');
    }
    
    // Mail ayarları ve gönderimi (yorum satırına alındı, test için)
    /*
    $to = "serkanak231@gmail.com";
    $mailSubject = "BÜYÜKHAN İletişim Formu - $subjectText";
    $headers = "From: $email" . "\r\n" .
        "Reply-To: $email" . "\r\n" .
        "X-Mailer: PHP/" . phpversion();
    
    // E-postayı gönder
    $mailSent = mail($to, $mailSubject, $emailContent, $headers);
    
    if ($mailSent) {
        logError("E-posta başarıyla gönderildi");
        echo json_encode(['success' => true, 'message' => 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.']);
    } else {
        logError("E-posta gönderimi başarısız");
        throw new Exception('E-posta gönderilirken bir hata oluştu.');
    }
    */
    
} catch (Exception $e) {
    logError("Hata: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>