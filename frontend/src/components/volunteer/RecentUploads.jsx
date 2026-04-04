function RecentUploads({ uploads }) {
  return (
    <ul className="data-list">
      {uploads.map((upload) => (
        <li key={upload.id}>
          <strong>{upload.fileName}</strong>
          <br />
          <span>{upload.status}</span>
          <br />
          {upload.totalRows !== undefined && (
            <>
              <small>Rows: {upload.totalRows}</small>
              <br />
            </>
          )}
          <small>{upload.uploadedAt}</small>
        </li>
      ))}
    </ul>
  );
}

export default RecentUploads;