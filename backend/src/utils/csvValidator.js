const REQUIRED_COLUMNS = [
  "siteName",
  "latitude",
  "longitude",
  "date",
  "time",
  "pH",
  "turbidity",
  "dissolvedOxygen",
  "temperature",
  "eColi",
];

function isCsvFile(file) {
  if (!file) return false;

  const isMimeTypeCsv =
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel";

  const isExtensionCsv = file.originalname.toLowerCase().endsWith(".csv");

  return isMimeTypeCsv || isExtensionCsv;
}

function validateCsvColumns(headers) {
  const missingColumns = REQUIRED_COLUMNS.filter(
    (column) => !headers.includes(column)
  );

  return {
    isValid: missingColumns.length === 0,
    missingColumns,
  };
}

function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function isValidNumber(value) {
  return !Number.isNaN(Number(value));
}

function validateRow(row, rowNumber) {
  const errors = [];

  REQUIRED_COLUMNS.forEach((column) => {
    if (isEmpty(row[column])) {
      errors.push(`Row ${rowNumber}: Missing value for "${column}"`);
    }
  });

  if (!isEmpty(row.latitude) && !isValidNumber(row.latitude)) {
    errors.push(`Row ${rowNumber}: Latitude must be a valid number`);
  }

  if (!isEmpty(row.longitude) && !isValidNumber(row.longitude)) {
    errors.push(`Row ${rowNumber}: Longitude must be a valid number`);
  }

  if (!isEmpty(row.pH) && !isValidNumber(row.pH)) {
    errors.push(`Row ${rowNumber}: pH must be a valid number`);
  }

  if (!isEmpty(row.turbidity) && !isValidNumber(row.turbidity)) {
    errors.push(`Row ${rowNumber}: Turbidity must be a valid number`);
  }

  if (!isEmpty(row.dissolvedOxygen) && !isValidNumber(row.dissolvedOxygen)) {
    errors.push(`Row ${rowNumber}: Dissolved Oxygen must be a valid number`);
  }

  if (!isEmpty(row.temperature) && !isValidNumber(row.temperature)) {
    errors.push(`Row ${rowNumber}: Temperature must be a valid number`);
  }

  if (!isEmpty(row.eColi) && !isValidNumber(row.eColi)) {
    errors.push(`Row ${rowNumber}: E. coli must be a valid number`);
  }

  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);
  const ph = Number(row.pH);
  const turbidity = Number(row.turbidity);
  const dissolvedOxygen = Number(row.dissolvedOxygen);
  const temperature = Number(row.temperature);
  const eColi = Number(row.eColi);

  if (!Number.isNaN(latitude) && (latitude < -90 || latitude > 90)) {
    errors.push(`Row ${rowNumber}: Latitude must be between -90 and 90`);
  }

  if (!Number.isNaN(longitude) && (longitude < -180 || longitude > 180)) {
    errors.push(`Row ${rowNumber}: Longitude must be between -180 and 180`);
  }

  if (!Number.isNaN(ph) && (ph < 0 || ph > 14)) {
    errors.push(`Row ${rowNumber}: pH must be between 0 and 14`);
  }

  if (!Number.isNaN(turbidity) && turbidity < 0) {
    errors.push(`Row ${rowNumber}: Turbidity cannot be negative`);
  }

  if (!Number.isNaN(dissolvedOxygen) && dissolvedOxygen < 0) {
    errors.push(`Row ${rowNumber}: Dissolved Oxygen cannot be negative`);
  }

  if (!Number.isNaN(eColi) && eColi < 0) {
    errors.push(`Row ${rowNumber}: E. coli cannot be negative`);
  }

  if (!Number.isNaN(temperature) && (temperature < -10 || temperature > 60)) {
    errors.push(`Row ${rowNumber}: Temperature looks out of expected range`);
  }

  return errors;
}

module.exports = {
  isCsvFile,
  validateCsvColumns,
  validateRow,
  REQUIRED_COLUMNS,
};