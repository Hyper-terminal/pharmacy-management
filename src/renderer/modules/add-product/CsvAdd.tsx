import { Button } from '@/src/renderer/components/ui/Button';
import { FileTextIcon } from 'lucide-react';
import { useRef, useState } from 'react';

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

  // const addFiledata = async () => {
  //   if (file) {
  //     try {
  //       const result = await ipcRenderer.invoke('import-csv', file); // Send file to main process
  //       console.log(result); // Handle success
  //     } catch (error) {
  //       console.error('Error importing data:', error);
  //     }
  //   } else {
  //     console.log('No file selected');
  //   }
  // };

  return (
    <div className="mt-8">
      <div
        ref={dropZoneRef}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
          ${isDragging
            ? "border-transparent bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Animated border on drag */}
        {isDragging && (
          <div className="absolute inset-0 rounded-lg animate-border bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 [mask:linear-gradient(white,white) padding-box,linear-gradient(white,white)]">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        )}

        <div className="relative flex flex-col items-center gap-6">
          <div
            ref={fileIconRef}
            className={`transition-all duration-300 transform ${
              isDragging ? "scale-110" : "hover:scale-110"
            }`}
          >
            <div className="relative">
              <FileTextIcon className={`h-16 w-16 transition-colors duration-300 ${
                isDragging
                  ? "text-blue-500"
                  : "text-gray-400 dark:text-gray-500"
              }`} />
              {isDragging && (
                <div className="absolute inset-0 rounded-full animate-pulse bg-blue-500/20" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-medium dark:text-gray-200">
              Drag and drop your CSV file here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
            className="relative px-6 py-2.5 rounded-md cursor-pointer group"
          >
            <div className="absolute inset-0 transition-opacity rounded-md opacity-100 animate-border bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 group-hover:opacity-90" />
            <span className="relative font-medium text-white">Browse Files</span>
          </label>
        </div>
      </div>

      {file && (
        <div
          ref={fileInfoRef}
          className="p-4 mt-4 duration-500 rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 dark:from-purple-500/5 dark:via-pink-500/5 dark:to-blue-500/5 backdrop-blur-sm animate-in fade-in-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20">
                <FileTextIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </div>
              <span className="font-medium dark:text-gray-200">{file.name}</span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveFile}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Remove</span>
              <div className="absolute inset-0 transition-transform duration-300 transform scale-x-0 bg-red-600 group-hover:scale-x-100" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
