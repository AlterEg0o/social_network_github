import '../fileUploader/fileUploader.css'
import { useState } from 'react';

export default function FileUploader(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragging, setDragging] = useState(false);
  
    const handleDragEnter = (event) => {
      event.preventDefault();
      setDragging(true);
    };
  
    const handleDragOver = (event) => {
      event.preventDefault();
      setDragging(true);
    };
  
    const handleDragLeave = (event) => {
      event.preventDefault();
      setDragging(false);
    };
  
    const handleDrop = (event) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      console.log('Selected file:', file);
      // Perform further processing with the selected file
    };
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      console.log('Selected file:', file);
      
    };
  
    return (
      <div
        className={`drop-area ${dragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" onChange={handleFileChange} />
        {selectedFile ? (
          <p>Selected file: {selectedFile.name}</p>
        ) : (
          <p>Drag and drop or click to select a file</p>
        )}
      </div>
    );
  }
  