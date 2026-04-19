const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const uploadsFilePath = path.join(__dirname, "../data/uploads.json");
const latestReadingsFilePath = path.join(__dirname, "../data/latestReadings.json");

const {
  isCsvFile,
  validateCsvColumns,
  validateRow,
} = require("../utils/csvValidator");

const { saveAlertsFromRows } = require("./alertController");

function readUploads() {
  try {
    const fileData = fs.readFileSync(uploadsFilePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading uploads.json:", error);
    return [];
  }
}

function writeUploads(data) {
  fs.writeFileSync(uploadsFilePath, JSON.stringify(data, null, 2), "utf-8");
}

function writeLatestReadings(data) {
  fs.writeFileSync(
    latestReadingsFilePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

function getNextUploadId(uploads) {
  if (!uploads.length) return 1;
  const maxId = Math.max(...uploads.map((item) => Number(item.id) || 0));
  return maxId + 1;
}

const getUploads = (req, res) => {
  try {
    const uploads = readUploads();
    res.json(uploads);
  } catch (error) {
    console.error("Error getting uploads:", error);
    res.status(500).json({ message: "Could not load uploads." });
  }
};

const uploadCsvFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded.",
    });
  }

  if (!isCsvFile(req.file)) {
    return res.status(400).json({
      message: "Only CSV files are allowed.",
    });
  }

  const rows = [];
  const rowErrors = [];
  let headersChecked = false;
  let fileValidationFailed = false;
  let responseSent = false;
  let rowNumber = 1;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("headers", (headers) => {
      try {
        const validation = validateCsvColumns(headers);

        if (!validation.isValid && !responseSent) {
          fileValidationFailed = true;
          responseSent = true;

          return res.status(400).json({
            message: "CSV format is invalid.",
            missingColumns: validation.missingColumns,
          });
        }

        headersChecked = true;
      } catch (error) {
        console.error("Header validation error:", error);

        if (!responseSent) {
          responseSent = true;
          return res.status(500).json({
            message: "Error validating CSV headers.",
          });
        }
      }
    })
    .on("data", (row) => {
      try {
        if (fileValidationFailed) return;

        rowNumber += 1;
        const errors = validateRow(row, rowNumber);

        if (errors.length > 0) {
          rowErrors.push(...errors);
        }

        rows.push(row);
      } catch (error) {
        console.error("Row processing error:", error);
      }
    })
    .on("end", () => {
      try {
        if (fileValidationFailed || responseSent) return;

        if (!headersChecked) {
          responseSent = true;
          return res.status(400).json({
            message: "Could not read CSV headers.",
          });
        }

        if (rowErrors.length > 0) {
          responseSent = true;
          return res.status(400).json({
            message: "CSV row validation failed.",
            rowErrors,
          });
        }

        const uploads = readUploads();
const users = ["Benji", "Rahool", "Tashi", "Kushal"];

const randomUser = users[Math.floor(Math.random() * users.length)];

const newUpload = {
  id: uploads.length > 0 ? uploads[0].id + 1 : 1,
  fileName: req.file.originalname,
  status: "Validated",
  uploadedAt: new Date().toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }),
  totalRows: rows.length,
  user: randomUser, // NEW
};
        
        uploads.unshift(newUpload);
        writeUploads(uploads);
        writeLatestReadings(rows);

        let alerts = [];
        if (typeof saveAlertsFromRows === "function") {
          alerts = saveAlertsFromRows(rows);
        } else {
          console.warn("saveAlertsFromRows is not available from alertController");
        }

        responseSent = true;
        return res.status(200).json({
          message: "CSV uploaded, validated, and processed successfully.",
          fileName: req.file.originalname,
          storedAs: req.file.filename,
          size: req.file.size,
          totalRows: rows.length,
          preview: rows.slice(0, 3),
          uploadRecord: newUpload,
          alertsGenerated: alerts.length,
          alertsPreview: alerts.slice(0, 3),
        });
      } catch (error) {
        console.error("Upload finalization error:", error);

        if (!responseSent) {
          responseSent = true;
          return res.status(500).json({
            message: "Server error while finalizing upload.",
            error: error.message,
          });
        }
      }
    })
    .on("error", (error) => {
      console.error("CSV parsing error:", error);

      if (!responseSent) {
        responseSent = true;
        return res.status(500).json({
          message: "Error parsing CSV file.",
        });
      }
    });
};

module.exports = {
  getUploads,
  uploadCsvFile,
};