import { useRef, useState } from "react";
import { uploadCsv } from "../../services/uploadService";
import CsvPreviewTable from "./CsvPreviewTable";

function UploadDropzone({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadPreview, setUploadPreview] = useState([]);
  const [uploadRows, setUploadRows] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  function handleSelectClick() {
    fileInputRef.current.click();
  }

  async function processFile(file) {
    if (!file) return;

    setSelectedFileName(file.name);
    setUploadMessage("");
    setUploadError("");
    setUploadPreview([]);
    setUploadRows(null);
    setValidationErrors([]);
    setIsUploading(true);

    try {
      const result = await uploadCsv(file);
      setUploadMessage(`Success: ${result.fileName} uploaded and validated.`);
      setUploadRows(result.totalRows);
      setUploadPreview(result.preview || []);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error(error);
      setUploadError(error.message || "Upload failed.");
      setValidationErrors(
        error.details?.rowErrors ||
          error.details?.missingColumns?.map(
            (column) => `Missing required column: ${column}`
          ) ||
          []
      );
    } finally {
      setIsUploading(false);
      setIsDragActive(false);
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    await processFile(file);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragActive(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDragActive(false);
  }

  async function handleDrop(event) {
    event.preventDefault();
    setIsDragActive(false);

    const file = event.dataTransfer.files[0];
    await processFile(file);
  }

  return (
    <div
      className={`upload-dropzone ${isDragActive ? "drag-active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-icon">☁</div>
      <h3>Drag and drop a CSV to upload</h3>
      <p>or</p>

      <button className="btn btn-secondary" type="button" onClick={handleSelectClick}>
        Select file
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden-file-input"
      />

      <div className="progress-bar upload-progress">
        <div
          className="progress-fill"
          style={{ width: isUploading ? "70%" : uploadMessage ? "100%" : "35%" }}
        ></div>
      </div>

      {selectedFileName && (
        <p className="helper-text">
          <strong>Selected file:</strong> {selectedFileName}
        </p>
      )}

      {uploadMessage && <p className="upload-success">{uploadMessage}</p>}
      {uploadError && <p className="upload-error">{uploadError}</p>}

      {uploadRows !== null && (
        <p className="helper-text">
          <strong>Rows parsed:</strong> {uploadRows}
        </p>
      )}

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h4>Validation Issues</h4>
          <ul>
            {validationErrors.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {uploadPreview.length > 0 && (
        <div className="upload-preview">
          <h4>Preview</h4>
          <CsvPreviewTable rows={uploadPreview} />
        </div>
      )}

      {!uploadMessage && !uploadError && (
        <p className="helper-text">
          Validation status and upload progress will appear here.
        </p>
      )}
    </div>
  );
}

export default UploadDropzone;