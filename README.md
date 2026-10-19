# @zireku/baileys

<p align="center">
   <a href="https://github.com/Zireku/baileys">
      <img src="https://img.shields.io/badge/Engine-Baileys_v7_Zireku_Edition-1e1b4b?style=for-the-badge&logo=whatsapp&logoColor=25D366" alt="Baileys Zireku Edition" />
   </a>
   <a href="https://nodejs.org">
      <img src="https://img.shields.io/badge/Node.js-%3E%3D20.0.0-1e1b4b?style=for-the-badge&logo=nodedotjs&logoColor=5FA04E" alt="Node.js 20+" />
   </a>
   <a href="https://github.com/itsliaaa/baileys">
      <img src="https://img.shields.io/badge/Forked_From-itsliaaa%2Fbaileys-302b63?style=for-the-badge&logo=github&logoColor=white" alt="Forked from itsliaaa" />
   </a>
   <a href="LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-1e1b4b?style=for-the-badge&logo=open-source-initiative&logoColor=white" alt="License MIT" />
   </a>
   <a href="#">
      <img src="https://img.shields.io/badge/Module-ESM_Only-1e1b4b?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="ESM Only" />
   </a>
</p>

`@zireku/baileys` adalah mesin WhatsApp Web API Baileys v7 yang telah dimodifikasi dan dioptimasi secara khusus oleh Zireku untuk kebutuhan bot arsitektur berkecepatan tinggi, stabilitas beban ribuan chat per detik, serta integrasi render canvas pixel-accurate.

Merupakan cabang (fork) yang ditingkatkan dari `itsliaaa/baileys` dan `WhiskeySockets/Baileys`, versi ini menghadirkan perbaikan performa tingkat rendah, efisiensi memori RAM, penanganan kegagalan socket tanpa crash proses, serta dukungan penuh untuk fitur-fitur WhatsApp modern.

---

## Modifikasi & Peningkatan Utama Zireku

| Fitur / Peningkatan | Deskripsi & Manfaat Produksi |
|---|---|
| **Memory Optimization (History Sync Bypass)** | Opsi mematikan sinkronisasi riwayat obrolan masa lalu (History Sync) untuk mencegah lonjakan RAM (OOM) pada akun bot lama dengan ribuan pesan. |
| **Crash-Guard Socket Isolation** | Penanganan error level socket yang terisolasi. Jika satu socket atau koneksi putus tiba-tiba, proses utama host tidak akan mati (crash). |
| **Accelerated Group Cryptography** | Peningkatan kecepatan kalkulasi enkripsi XEdDSA pada pesan grup beranggotakan banyak untuk meminimalkan antrean pengiriman. |
| **Newsletter Media & Channel Support** | Perbaikan menyeluruh untuk upload media newsletter (channel WhatsApp), query metadata, dan pengelolaan interaksi channel. |
| **Interactive Messages & Albums** | Dukungan siap pakai untuk pesan tombol interaktif, carousel list, album multi-gambar, dan reply template. |
| **CommonJS & ESM Loader Bridge** | Mempertahankan kompatibilitas eksekusi modul modern tanpa memecahkan dependensi wrapper downstream. |
| **Bebas Obfuscation & Telemetri** | Kode 100% transparan, mudah diaudit, tanpa skrip tersembunyi yang memberatkan CPU atau membocorkan sesi. |

---

## Instalasi

Gunakan package manager pilihan Anda untuk memasang repositori langsung dari GitHub:

```bash
# Menggunakan Yarn
yarn add github:Zireku/baileys

# Menggunakan NPM
npm install github:Zireku/baileys

# Menggunakan PNPM
pnpm add github:Zireku/baileys
```

> **Requirement:** Memerlukan runtime **Node.js versi 20.0.0 ke atas** (ESM native).

---

## Cara Penggunaan (Quick Start)

### 1. Menghubungkan Menggunakan Pairing Code

Metode praktis tanpa scan QR, cukup memasukkan kode verifikasi 8 digit pada WhatsApp ponsel Anda:

```typescript
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@zireku/baileys';
import pino from 'pino';

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session_auth');
    
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Ubuntu', 'Chrome', '20.0.04']
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = '6283899603982'; // Nomor telepon tanpa tanda +
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`Pairing code Anda: ${code}`);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('Bot berhasil terkoneksi ke WhatsApp!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const sender = m.key.remoteJid;
        const text = m.message.conversation || m.message.extendedTextMessage?.text;

        if (text === '!ping') {
            await sock.sendMessage(sender, { text: 'Pong! Bot Baileys Zireku aktif.' });
        }
    });
}

startBot();
```

---

## Mengirim Berbagai Tipe Pesan

### Pesan Teks & Mention
```typescript
await sock.sendMessage(chatId, {
    text: 'Halo @628123456789, selamat datang!',
    mentions: ['628123456789@s.whatsapp.net']
});
```

### Pesan Media (Gambar, Audio, Video, Dokumen)
```typescript
import fs from 'fs';

// Kirim Gambar dengan Caption
await sock.sendMessage(chatId, {
    image: fs.readFileSync('./image.png'),
    caption: 'Berikut adalah hasil render zireku-canvas.'
});

// Kirim Voice Note (PTT)
await sock.sendMessage(chatId, {
    audio: fs.readFileSync('./audio.mp3'),
    mimetype: 'audio/mp4',
    ptt: true
});
```

### Pesan Channel / Newsletter
```typescript
// Mengirim pesan ke Channel WhatsApp
await sock.sendMessage('120363203083379699@newsletter', {
    text: 'Update versi terbaru @zireku/baileys telah dirilis!'
});
```

---

## Struktur Folder Project

```text
├── lib/
│   ├── Defaults/         # Konfigurasi default koneksi & konstanta
│   ├── Socket/           # Handler socket (messages, groups, newsletter, registration)
│   ├── Utils/            # Enkripsi Signal, decoding media, link preview, crypto
│   ├── Types/            # TypeScript interface & enum definitions
│   └── index.js          # Entrypoint utama modul Baileys
├── WAProto/              # Protobuf schema WhatsApp Web
├── engine-requirements.js # Validator runtime Node.js >= 20
└── package.json          # Metadata paket @zireku/baileys
```

---

## Kredit & Pengakuan (Attribution)

Paket ini dibangun dan dipelihara sebagai modifikasi khusus oleh [Zireku](https://github.com/Zireku). Kami memberikan apresiasi penuh dan kredit kepada kreator upstream yang menjadi fondasi modul ini:

* **[itsliaaa/baileys](https://github.com/itsliaaa/baileys)** oleh Lia Wynn untuk fondasi perbaikan v7 dan newsletter media.
* **[WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)** & **adiwajshing** untuk arsitektur orisinal Baileys WhatsApp Web API.

---

## Lisensi

Proyek ini dirilis di bawah lisensi terbuka [MIT License](LICENSE). Bebas digunakan untuk keperluan pribadi maupun komersial.