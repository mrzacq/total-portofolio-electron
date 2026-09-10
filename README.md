# Total Portofolio

Aplikasi desktop (Electron + React) untuk mencatat dan memantau portofolio aset pribadi — total kekayaan, distribusi alokasi per aset, dan progres terhadap target.

## Fitur

- Tambah, edit, top up, dan hapus aset
- Ringkasan total portofolio dan jumlah aset
- Distribusi aset dalam donut chart beserta legend
- Tabel rincian kepemilikan dengan persentase terhadap total
- Export dan import data portofolio dalam format JSON
- Data disimpan secara lokal di perangkat (localStorage), tidak ada server/backend

## Tech Stack

- [Electron](https://www.electronjs.org/) — shell aplikasi desktop
- [React 19](https://react.dev/) + [Vite](https://vite.dev/) — UI dan tooling dev
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Recharts](https://recharts.org/) — donut chart
- [Lucide React](https://lucide.dev/) — icon set

## Menjalankan Secara Lokal

```bash
npm install

# Jalankan sebagai web app (browser) dengan HMR
npm run dev

# Jalankan sebagai aplikasi Electron (dev)
npm run electron:dev
```

## Build

```bash
# Build bundle web (output ke dist/)
npm run build

# Build installer aplikasi desktop (output ke release/)
npm run electron:build
```

## Struktur Proyek

```
electron/        Proses utama & preload script Electron
src/
  components/    Komponen UI (form aset, chart, tabel, modal, dll.)
  hooks/         Logic state aset (useAssets)
  utils/         Helper format angka & file import/export
  styles/        Tema dan palet warna
```
