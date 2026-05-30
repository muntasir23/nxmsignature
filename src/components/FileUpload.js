const FileUpload = ({ setFiles }) => {

  return (
    <input
      type="file"
      multiple
      className="w-full border p-3 rounded"
      onChange={(e) => {
        setFiles([...e.target.files]);
      }}
    />
  );
};

export default FileUpload;