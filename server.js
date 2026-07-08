const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // Menggunakan port dari environment hosting

app.use(cors());

// Konfigurasi Header Khusus Unity WebGL (Mencegah Decompression Error di Browser)
app.use(express.static(path.join(__dirname, 'public/Builds'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.wasm.gz')) {
            res.set('Content-Encoding', 'gzip');
            res.set('Content-Type', 'application/wasm');
        } else if (filePath.endsWith('.js.gz')) {
            res.set('Content-Encoding', 'gzip');
            res.set('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.data.gz')) {
            res.set('Content-Encoding', 'gzip');
            res.set('Content-Type', 'application/octet-stream');
        } else if (filePath.endsWith('.wasm')) {
            res.set('Content-Type', 'application/wasm');
        }
    }
}));

// Endpoint Update otomatis dari Git (Sesuai Flowchart)
app.post('/api/update-repo', (req, res) => {
    // Di VPS, ini akan mengeksekusi pull pada folder deployment
    exec('git pull origin main', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send({ success: false, message: error.message });
        }
        res.send({ success: true, log: stdout });
    });
});

app.listen(PORT, () => {
    console.log(`Server production berjalan di port ${PORT}`);
});