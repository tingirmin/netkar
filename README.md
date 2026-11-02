# NetKâr v1.2 — sade kullanıcı arayüzü

Temel girişler: alış, satış, komisyon, kargo. Ek maliyetler, KDV, vergi, hedef fiyat ve komisyon matrahı **Gelişmiş seçenekler** içinde yer alır. Hesaplama ve kayıt fonksiyonları v1.1 ile aynıdır. İleri seçenekler kapalıyken de hesaplamaya uygulanmaya devam eder; etkin özellikler kullanıcıya ayrıca bildirilir.

## Windows'ta çalıştırma

Klasörde `py -m http.server 8000` çalıştırın. Tarayıcıda `http://localhost:8000/` açın. Testler için Node.js 20+ ile `npm test` çalıştırın.

## GitHub Pages

ZIP içindeki dosyaları `netkar` deposunun **kök dizinine** yükleyin (klasörün kendisini yüklemeyin). Önemli: Önceden GitHub'da oluşturduğunuz `google94d79837ccbeecbd.html` doğrulama dosyası korunmalıdır. Yayın adresi `https://tingirmin.github.io/netkar/`.

## Sınırlar

Ürün kayıtları yalnızca kullanılan tarayıcıdaki localStorage'da tutulur; veriler cihazlar arasında eşitlenmez. Para birimi değiştirmek fiyat dönüştürmez. KDV modeli tüm özel vergi ve muhasebe durumlarını kapsamaz. PDF/abonelik bulunmaz. Mobil otomatik doğrulama ortam koşullarına göre sınırlı olabilir.
