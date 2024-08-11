const codeReader = new ZXing.BrowserBarcodeReader();
const previewElem = document.getElementById('preview');
const startScanButton = document.getElementById('start-scan');
const saveRecordsButton = document.getElementById('save-records');
const barcodeList = document.getElementById('barcode-list');
let records = [];

startScanButton.addEventListener('click', () => {
    codeReader.decodeFromVideoDevice(null, 'preview', (result, err) => {
        if (result) {
            const li = document.createElement('li');
            li.textContent = result.text;
            barcodeList.appendChild(li);
            records.push(result.text);
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err);
        }
    });
});

saveRecordsButton.addEventListener('click', () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["条形码"]].concat(records.map(record => [record])));
    XLSX.utils.book_append_sheet(wb, ws, "Records");
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'records.xlsx';
    a.click();
    URL.revokeObjectURL(url);
});
