# Shoe Lab kurulumu

## 1. Cloudflare Worker proxy'yi yayımla

Bilgisayarında Node.js kurulu olmalı.

Bu klasörde terminal aç:

```bash
npm install -D wrangler
npx wrangler login
npx wrangler deploy
```

Komut sonunda buna benzer bir adres verir:

```text
https://shoe-lab-proxy.<hesabin>.workers.dev
```

## 2. HTML dosyasına Worker adresini yaz

`shoe-lab.html` dosyasını Not Defteri veya VS Code ile aç.

Şunu bul:

```js
const PROXY_URL="PASTE_YOUR_WORKER_URL_HERE";
```

Şöyle değiştir:

```js
const PROXY_URL="https://shoe-lab-proxy.<hesabin>.workers.dev";
```

Dosyayı kaydet ve çift tıklayarak tarayıcıda aç.

## 3. Kullanım

1. RunRepeat ayakkabı inceleme linkini yapıştır.
2. `Ayakkabıyı çek` düğmesine bas.
3. Bulunan değerleri kontrol et.
4. `Kaydet` düğmesine bas.
5. Soldan ayakkabıları seçerek karşılaştır.
6. Notlarını ekle.
7. `JSON` ile tam yedek, `ChatGPT` ile Markdown export al.

## Notlar

- Veriler tarayıcının localStorage alanında tutulur.
- Tarayıcı verilerini temizlersen kayıtlar silinebilir; ara sıra JSON yedeği al.
- Proxy güvenlik amacıyla yalnızca `runrepeat.com` adreslerini çeker.
- RunRepeat sayfa yapısını değiştirirse bazı alanlar boş kalabilir. Düzenleme ekranından eksik değerleri elle ekleyebilirsin.
