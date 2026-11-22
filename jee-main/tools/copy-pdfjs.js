// Copies the PDF viewer library into www/lib so the app can show PDFs offline.
const fs = require("fs"), path = require("path");
const src = path.join(__dirname, "..", "node_modules", "pdfjs-dist", "build");
const dst = path.join(__dirname, "..", "www", "lib");
fs.mkdirSync(dst, { recursive: true });
for (const f of ["pdf.min.js", "pdf.worker.min.js"]) {
  fs.copyFileSync(path.join(src, f), path.join(dst, f));
  console.log("copied", f);
}
