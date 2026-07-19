# Monorepo Mimarisi — Barber


## Genel Bakış

Bu repo tek bir monorepo içinde: bir backend servisi (`services/barber-service`), bir API gateway (`services/barber-gateway`), framework-bağımsız iş mantığı (`core/service-barber`), paylaşılan paketler (`packages/modules/*`), veritabanı şemaları (`db-schemas/`), testler (`test/`) ve bir React frontend (`apps/barber-web`) barındırır.

Şablonun **tek-servisli sadeleştirilmiş varyantı** uygulandı (çok-servisli mikroservis mimarisi + Redis service-discovery bilinçli olarak atlandı — tek backend servisi için gereksiz karmaşıklık olurdu).

## Klasör Haritası

```
barber/
├── core/service-barber/     # Framework-bağımsız iş mantığı (domain/application/infrastructure/interfaces)
├── services/
│   ├── barber-service/      # Çalıştırılabilir Express kabuğu (main.js → boot.js → container.js)
│   └── barber-gateway/      # Reverse proxy + güvenlik sınırı (auth secret, rate limit)
├── packages/modules/        # @barber/{config,errors,helper,middlewares}
├── db-schemas/              # Numaralı SQL şemaları + migrations/ + seed/
├── test/                    # Jest: unit + integration
├── apps/barber-web/         # React 19 + Vite frontend
└── docs/                    # Bu dosya
```

## core/ vs services/ Ayrımı

`core/service-barber/`, hiçbir HTTP/Express detayı bilmeyen saf iş mantığını barındırır:
- `domain/` — entity'ler, domain hataları
- `application/use-cases/<context>/` — iş akışları, **factory fonksiyonu** pattern'i (`make*`)
- `infrastructure/persistence/` — repository'ler (yine `make*Repository({ query })` factory'leri), şema yardımcıları
- `interfaces/http/` — domain hatalarını HTTP status'lara çeviren adaptör

`services/barber-service/`, bu çekirdeği çalıştıran ince kabuktur: `main.js` → `src/boot.js` (Express app kurulumu) → `src/container.js` (composition root — tüm `make*` çağrıları elle bağlanır).

**Neden class/DI-framework değil factory fonksiyonu**: Her `make*` fonksiyonu bağımlılıklarını parametre olarak alan saf bir closure'dır. Bağımlılık grafiği `container.js`'te tamamen elle görülebilir; testte gerçek repo yerine sahte obje geçmek trivial'dir (mock kütüphanesi gerekmez).

## packages/modules/ — Paylaşılan Paketler

- **config**: `requireEnv(name)` — eksikse boot anında throw eder (fail-fast), hardcoded secret fallback'lerini imkansız kılar.
- **errors**: `CustomError`, `handleErrors` (global Express error middleware).
- **helper**: `log`, `getCaller` (header'lardan caller context çıkarma), `routeResponse` (route wrapper).
- **middlewares**: `makeRequireAuth`, `requireType`, `makeGatewayGuard`.

## services/barber-gateway/ — Sınır Katmanı

Gateway, sadece bir reverse-proxy değil, güvenlik sınırıdır:
- `x-gateway-secret` header'ı ile backend'e sadece gateway üzerinden erişilebilir olduğunu garanti eder.
- `/api/v1/login` ve `/api/v1/register` üzerinde `express-rate-limit` (15 dakikada 20 istek) — brute-force koruması.
- Secret'lar ve backend URL'i env'den okunur, hardcode edilmez.

## db-schemas/ — Şema Yönetimi

Domain bazlı numaralı SQL dosyaları (`00-enums`, `01-iam-core`, `02-scheduling`) + üretilmiş `combined-schema.sql` + `migrations/` (tarihli, tekil) + `seed/`.

Migration geçmişi önemli bir düzeltme içerir: orijinal şema, kodun bağımlı olduğu `iam.tenant_users` tablosunu ve `appointments`/`barber_availability` tablolarındaki `tenant_id` kolonlarını hiç içermiyordu — bu, tenant'a bağlı kullanıcılar için raporların ve randevu listelerinin 500 hatası vermesine yol açıyordu. `migrations/2026-07-19-001-add-tenant-scoping.sql` bunu düzeltir.

`migrations/hash-existing-passwords.js`, login'in `bcrypt.compare` kullanmaya başlamasıyla birlikte gereken idempotent şifre migration scriptidir.

## test/ — Test Stratejisi

Jest, ESM (`--experimental-vm-modules`). `test/config/` paylaşılan test altyapısını (fake query, test-server) barındırır. `test/services/service-barber/{unit,integration}/` — unit testler `make*` factory'lere plain-object fake inject eder (mock kütüphanesi gerekmez), integration test gerçek `boot.js`'i injected fake pool ile ayağa kaldırıp supertest ile HTTP zincirini test eder.

## apps/barber-web/ — Frontend

React 19 + Vite, JSX (TypeScript kullanılmıyor). State yönetimi ikiye bölünmüş: Zustand (`store/authStore.jsx`, sadece client/UI state) + React Query (`features/*/hooks/`, tüm sunucu verisi). `shared/{axios,constant,providers,translation}/` — merkezi axios instance (base URL artık `VITE_API_URL` env'den), stabil query key'ler, `QueryProvider` (`retry:false, refetchOnWindowFocus:false`), i18n.

**Bilinçli sadeleştirmeler** (şablondan sapmalar, gerekçeli):
- Tek `@` path alias'ı korundu — çoklu alias'a (`@api`, `@features`, ...) geçiş, 60+ dosyada tutarlı çalışan bir sistemi mekanik risk karşılığında hiçbir fonksiyonel fayda sağlamadan değiştirmek olurdu.
- `components/Mui/` wrapper'ları (`MuiButton`, `MuiTextInput`, `MuiDialog`) oluşturuldu ve yeni kod için standart, ama mevcut 40+ sayfa dosyası henüz bunlara geçirilmedi — büyük ölçekli mekanik bir değişiklik, ayrı bir faz olarak bırakıldı.



## Bilinen Sınırlamalar

- DB'deki rol kodları (`owner`, `manager`) ile kodun beklediği rol kodları (`admin`, `manager_barber`) arasında tutarsızlık var — pre-existing, bu refactor kapsamında dokuzulmadı, ayrı bir karar gerektirir.
- Frontend'de ham MUI component kullanımı hâlâ yaygın (wrapper'lara geçiş tamamlanmadı).
