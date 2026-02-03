# ElorAdmin

**Elorrieta-Erreka Mari Administrazio Panela**

Angular 17 aplikazioa erabiltzaileak eta bilerak kudeatzeko.

## 🚀 Ezaugarriak

- **Rol sistema**: God (superadmin), Admin, Irakasle, Ikasle
- **Erabiltzaile kudeaketa**: CRUD eragiketak
- **Bilera kudeaketa**: Sortu, ikusi, editatu, ezabatu
- **Ordutegia**: Irakasle eta ikasleen ordutegia
- **Mapbox**: Euskadiko ikastetxeak mapan
- **i18n**: Euskara, Gaztelania, Ingelesa
- **Responsive**: Bootstrap 5

## 📁 Proiektuaren Egitura

```
ElorAdmin/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # AuthGuard, RoleGuard
│   │   │   ├── interceptors/    # AuthInterceptor
│   │   │   ├── models/          # User, Bilera, Ikastetxea
│   │   │   └── services/        # AuthService, UserService, etc.
│   │   ├── features/
│   │   │   ├── auth/            # Login
│   │   │   ├── dashboard/       # Panel nagusia
│   │   │   ├── erabiltzaileak/  # Erabiltzaile zerrenda eta formularioa
│   │   │   ├── irakasleak/      # Irakasle zerrenda eta xehetasunak
│   │   │   ├── ikasleak/        # Ikasle zerrenda eta xehetasunak
│   │   │   ├── bilerak/         # Bilera zerrenda eta formularioa
│   │   │   ├── ikastetxeak/     # Ikastetxe zerrenda maparekin
│   │   │   ├── ordutegia/       # Ordutegia taula
│   │   │   └── profila/         # Erabiltzaile profila
│   │   ├── shared/
│   │   │   └── components/      # Sidebar, Navbar, LoadingSpinner, NotFound
│   │   ├── app.component.ts     # App root component
│   │   ├── app.config.ts        # App konfigurazioa
│   │   └── app.routes.ts        # Routing
│   ├── assets/
│   │   ├── i18n/                # eu.json, es.json, en.json
│   │   └── images/              # Logo, avatarrak
│   ├── environments/            # environment.ts, environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── README.md
```

## 🛠️ Instalazioa

### Aurre-baldintzak

- Node.js 18+ edo 20+
- npm 9+
- Angular CLI 17+

### Pausoak

1. **Klonatu repositorioa**
   ```bash
   git clone https://github.com/your-repo/eloradmin.git
   cd eloradmin
   ```

2. **Mendekotasunak instalatu**
   ```bash
   npm install
   ```

3. **Mapbox token konfiguratu**

   Editatu `src/environments/environment.ts` eta gehitu zure Mapbox token:
   ```typescript
   mapboxToken: 'pk.your_mapbox_token_here'
   ```

4. **Aplikazioa abiarazi**
   ```bash
   npm start
   ```

5. **Nabigatzailean ireki**
   ```
   http://localhost:4200
   ```

## 🔐 Demo Kredentzialak

| Rola     | Email                    | Pasahitza |
|----------|--------------------------|-----------|
| God      | god@elorrieta.eus        | god123    |
| Admin    | admin@elorrieta.eus      | admin123  |
| Irakasle | irakasle@elorrieta.eus   | irakasle123 |
| Ikasle   | ikasle@elorrieta.eus     | ikasle123 |

## 📱 Rol Baimenak

| Funtzioa           | God | Admin | Irakasle | Ikasle |
|--------------------|-----|-------|----------|--------|
| Dashboard          | ✅  | ✅    | ✅       | ✅     |
| Erabiltzaileak     | ✅  | ✅    | ❌       | ❌     |
| Irakasleak         | ✅  | ✅    | ✅*      | ❌     |
| Ikasleak           | ✅  | ✅    | ✅*      | ❌     |
| Bilerak            | ✅  | ✅    | ✅       | ✅     |
| Ikastetxeak        | ✅  | ✅    | ✅       | ✅     |
| Ordutegia          | ❌  | ❌    | ✅       | ✅     |
| Profila            | ✅  | ✅    | ✅       | ✅     |

*Irakasleak bere ikasleak bakarrik ikusten ditu

## 🌍 Hizkuntza aldaketa

Aplikazioak 3 hizkuntza onartzen ditu:
- **EU** - Euskara (lehenetsia)
- **ES** - Gaztelania
- **EN** - Ingelesa

Hizkuntza aldatzeko, nabigazio barrako hizkuntza hautatzailea erabili.

## 🗺️ Mapbox Integrazio

Ikastetxe orrialdean, OpenData Euskadi-ko datuak erabiliz, Euskadiko zentro guztiak mapan erakusten dira.

Koordenatuak UTM formatutik Lat/Lon formatura bihurtzen dira.

## 📦 Produkziorako konpilatu

```bash
npm run build
```

Fitxategi konpilatuak `dist/eloradmin` karpetan sortuko dira.

## 🧪 Testak

```bash
npm test
```

## 📝 Licencia

MIT License - Elorrieta-Erreka Mari 2024

## 👥 Kontaktua

- **Eskola**: Elorrieta-Erreka Mari LHII
- **Web**: https://www.elorrieta-errekamari.hezkuntza.net
- **Email**: info@elorrieta.eus
