import { useState, useRef } from 'react';
import { Button } from '@/src/renderer/components/ui/Button';
import { FileTextIcon } from 'lucide-react';
import { ipcRenderer } from 'electron';

export default function CsvAdd() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const dropZoneRef = useRef(null);
  const fileIconRef = useRef(null);
  const fileInfoRef = useRef(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'text/csv') {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'text/csv') {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const addFiledata = async () => {
    if (file) {
      try {
        const result = await ipcRenderer.invoke('import-csv', file); // Send file to main process
        console.log(result); // Handle success
      } catch (error) {
        console.error('Error importing data:', error);
      }
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className="mt-8">
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            ref={fileIconRef}
            className="transition-transform hover:scale-110"
          >
            <FileTextIcon className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <p className="text-xl font-medium">
              Drag and drop your CSV file here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse from your computer
            </p>
          </div>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors hover:scale-105 transform duration-200"
          >
            Browse Files
          </label>
        </div>
      </div>

      {file && (
        <div
          ref={fileInfoRef}
          className="mt-4 p-4 bg-gray-50 rounded-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-gray-500" />
              <span className="font-medium">{file.name}</span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveFile}
              className="hover:scale-105 transform transition-transform duration-200"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
