# NetKâr — Statik MVP

## Dosya yapısı
- `index.html`: Arayüz ve SEO meta verileri.
- `styles.css`: Responsive açık/koyu temalar.
- `calc.js`: Saf hesaplama motoru ve doğrulama.
- `i18n.js`: Türkçe ve İngilizce metinler.
- `app.js`: Canlı hesaplama, ürün işlemleri, yerel saklama.
- `tests/calc.test.js`: Otomatik hesaplama testleri.
- `robots.txt`, `sitemap.xml`: SEO başlangıç dosyaları.

## Windows'ta çalıştırma
1. ZIP'i bir klasöre çıkartın.
2. Python kuruluysa klasörde Komut İstemi açın ve `py -m http.server 8000` yazın.
3. Tarayıcıdan `http://localhost:8000` açın.
4. Alternatif olarak VS Code içindeki Live Server'ı kullanın. HTML dosyasını çift tıklayarak `file://` ile açmayın; ES modülleri kısıtlanabilir.

## Testler
Node.js 20+ kuruluysa klasörde `npm test` çalıştırın. `npm install` gerekli değildir.

## Ücretsiz yayınlama
GitHub'da public bir repository oluşturun. ZIP içindeki dosyaları repository köküne yükleyin. Settings > Pages > Deploy from a branch > `main` / `(root)` ayarlayın. GitHub Pages'in verdiği HTTPS adresini kullanın. Alan adı kesinleşince `sitemap.xml` dosyasına gerçek tam URL'ler, HTML'e canonical ve OG URL eklenecektir.

## Hesaplama sözleşmesi
- Bütün fiyat ve maliyetler seçilen tek para birimindedir; kur dönüşümü yapılmaz.
- İndirimli satış = satış fiyatı × (1 − indirim%).
- Vergi etkinse satış üzerinden basit kesinti = indirimli satış × vergi%. **Bu KDV hesaplaması değildir.** KDV dahil/hariç fiyatların dönüşümü veya indirilecek KDV modellenmez.
- Komisyon matrahı seçilir: (1) indirimli satış tutarı, (2) satış vergisi düşüldükten sonraki satış tutarı.
- Sabit maliyetler = alış + kargo + paketleme + diğer giderler + reklam.
- Toplam gider = sabit maliyetler + komisyon + etkinleştirilmiş vergi.
- Net kâr = indirimli satış − toplam gider.
- Kâr marjı = net kâr / indirimli satış.
- Kâr oranı = net kâr / sabit maliyetler.
- Başabaş tahsilat fiyatı = sabit maliyetler / (1 − etkin vergi yüzdesi − etkin komisyon yüzdesi).
- Hedef net kâr tahsilat fiyatı = (sabit maliyetler + hedef net kâr) / aynı katsayı.
- Bu iki fiyat indirim sonrası tahsilat fiyatlarıdır. Hedefe ulaşmak için indirim öncesi liste fiyatı ayrıca gösterilir. Sıfır bölen veya mümkün olmayan durumlar `Hesaplanamaz` olur.

## Güvenlik, gizlilik ve bilinen sınırlar
- Üçüncü taraf script, API, analitik/izleme ve ödeme yoktur.
- Ürün adları `textContent` ile gösterilir; HTML kodu çalıştırılmaz.
- Ürün kayıtları `localStorage` üzerinde ve bu tarayıcıya özeldir; tarayıcı verileri silinirse kayıtlar kaybolur. Ortak bilgisayarlarda kayıtlara erişilebilir.
- Ücretsiz ürün sınırı 10'dur. Sunucu olmadığı için bu sınır ticari yetkilendirme değildir; premium özellikler sunulmaz.
- PDF oluşturma, gelişmiş ürün karşılaştırma, gerçek satış geçmişi ve tarih bazlı raporlama bu sürümde yoktur.
- Farklı para birimlerindeki ürün toplamları ayrı ayrı gösterilir; gerçek kur dönüşümü yoktur.
- Ürünlerin kayıt tarihi tutulur; satış tarihi veya satılan adet takibi yapılmaz.
- Dil değişimi istemci tarafındadır; ayrı URL ve hreflang SEO sonraki sürüm kapsamındadır.
- `sitemap.xml` alan adı seçilene kadar boş bir iskelettir.
- Hesaplamalarda JavaScript Number kullanılır; hassas muhasebe defter kaydı için ondalık sabit nokta hesaplamasına geçilmelidir.

## Yol haritası
1. KDV dahil/hariç modları, pazaryeri komisyon matrahlarının ayrı kuralları.
2. Sipariş/satış miktarı, CSV ve tarih bazlı raporlar.
3. PDF raporları ve gelişmiş karşılaştırmalar.
4. Üyelik, veritabanı, sunucu tarafı hesap ve plan doğrulaması.
5. Ödeme webhook'uyla doğrulanan premium yetki.
6. Ayrı TR/EN URL'ler, canonical/hreflang, üretim sitemap'i ve mobil E2E testleri.
