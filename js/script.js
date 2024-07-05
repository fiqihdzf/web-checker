document.getElementById("backButton").addEventListener("click", function () {
  window.history.back();
});

document.getElementById("homeButton").addEventListener("click", function () {
  window.location.href = "index.html";
});

var jsonData;
var currentFilterNIM;
var currentFilterpassword;

function checkNilai() {
  var nimFilter = document.getElementById("nim").value;
  var passwordFilter = document.getElementById("password").value;

  // Memeriksa apakah kedua input sudah diisi
  if (!nimFilter || !passwordFilter) {
    alert("Mohon isi NIM dan Password!!.");
    return;
  }

  // Mendapatkan path file Excel dari direktori yang sama
  var filePath = "data_nilai/nilai_dsk.xlsx";

  var xhr = new XMLHttpRequest();
  xhr.open("GET", filePath, true);
  xhr.responseType = "arraybuffer";

  xhr.onload = function (e) {
    var data = new Uint8Array(xhr.response);
    var workbook = XLSX.read(data, { type: "array" });
    var sheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[sheetName];

    jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Menyimpan header
    var header = jsonData[0];

    // Menghapus header dari jsonData untuk memudahkan pemrosesan
    jsonData.shift();

    // Filter data berdasarkan NIM dan Password
    currentFilterNIM = nimFilter;
    currentFilterpassword = passwordFilter;
    var filteredData = jsonData.filter(function (row) {
      return row[0] == nimFilter && row[1] == passwordFilter;
    });

    // Cek apakah data ditemukan
    if (filteredData.length === 0) {
      displayWarning();
    } else {
      openResultWindow(header, filteredData);
    }
  };

  xhr.send();
}

function displayWarning() {
  var warningMessage = document.getElementById("warningMessage");
  var nimExists = jsonData.some(function (row) {
    return row[0] == currentFilterNIM;
  });

  if (!nimExists) {
    warningMessage.textContent = `Data tidak ditemukan untuk NIM: ${currentFilterNIM}`;
  } else {
    warningMessage.textContent = `Password Salah`;
  }
}

function openResultWindow(header, data) {
  var resultWindow = window.open("", "_blank");
  resultWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transparansi Nilai</title>
        <link rel="stylesheet" href="css/styles.css">
            <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    color: #000;
                    overflow: auto;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    height: 125%;
                    padding: 20px;
                }
                h1 {
                    font-size: 3em;
                    margin-bottom: 20px;
                    color: #000;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                    font-size: 1em;
                }
                th {
                    background-color: #ffc107;
                    color: #000;
                }
                tr:nth-child(even) {
                    background-color: #fff8e1;
                }
                tr:hover {
                    background-color: #ffe082;
                }
                .header-group {
                    background-color: #ffc107;
                    color: #000;
                }
            </style>
        </head>
        <body>
        <div class="container">
            <h1>Transparansi Nilai Praktikum Dasar Sistem Kendali</h1>
            <table>
                <tbody id="resultBody">
                    <!-- Data akan ditampilkan di sini -->
                </tbody>
            </table>
        </div>
        </body>
        </html>
    `);

  var resultBody = resultWindow.document.getElementById("resultBody");

  // Menambahkan data ke tabel sesuai format yang diinginkan
  var headerGroups = [
    ["Nama", "Kelompok"],
    ["Laporan Unit 1", "Praktikum Unit 1", "PT Unit 1", "Total Unit 1"],
    ["Laporan Unit 2", "Praktikum Unit 2", "PT Unit 2", "Total Unit 2"],
    ["Laporan Unit 3", "Praktikum Unit 3", "PT Unit 3", "Total Unit 3"],
    ["Laporan Unit 4", "Praktikum Unit 4", "PT Unit 4", "Total Unit 4"],
    ["Laporan Unit 5", "Praktikum Unit 5", "PT Unit 5", "Total Unit 5"],
    ["Laporan Unit 6", "Praktikum Unit 6", "PT Unit 6", "Total Unit 6"],
    ["Laporan Unit 7", "Praktikum Unit 7", "PT Unit 7", "Total Unit 7"],
    ["Laporan Unit 8", "Praktikum Unit 8", "PT Unit 8", "Total Unit 8"],
    ["Total Nilai", "Responsi", "Hadir Sosialisasi", "Grade", "Nilai Akhir"],
  ];

  var dataGroups = [
    [data[0][2], data[0][3]], // Nama dan Kelompok
    [data[0][4], data[0][5], data[0][6], data[0][7]], // Unit 1
    [data[0][8], data[0][9], data[0][10], data[0][11]], // Unit 2
    [data[0][12], data[0][13], data[0][14], data[0][15]], // Unit 3
    [data[0][16], data[0][17], data[0][18], data[0][19]], // Unit 4
    [data[0][20], data[0][21], data[0][22], data[0][23]], // Unit 5
    [data[0][24], data[0][25], data[0][26], data[0][27]], // Unit 6
    [data[0][28], data[0][29], data[0][30], data[0][31]], // Unit 7
    [data[0][32], data[0][33], data[0][34], data[0][35]], // Unit 8
    [data[0][36], data[0][37], data[0][40], data[0][38], data[0][39]], // Total Nilai
  ];

  for (var i = 0; i < headerGroups.length; i++) {
    var headerRow = resultWindow.document.createElement("tr");
    headerRow.className = "header-group";
    headerGroups[i].forEach(function (column) {
      var th = resultWindow.document.createElement("th");
      th.textContent = column;
      headerRow.appendChild(th);
    });
    resultBody.appendChild(headerRow);

    var dataRow = resultWindow.document.createElement("tr");
    dataGroups[i].forEach(function (cellValue) {
      var td = resultWindow.document.createElement("td");
      td.textContent = cellValue;
      dataRow.appendChild(td);
    });
    resultBody.appendChild(dataRow);
  }
}
