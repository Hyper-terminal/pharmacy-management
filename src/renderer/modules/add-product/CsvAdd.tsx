import { Button } from '@/src/renderer/components/ui/Button';
import { FileTextIcon, SaveIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parse } from 'papaparse';
import { mapCsvToInterfaces } from '../../utils';

interface ICsvAdd {
  onSetLoader: (value: boolean) => void;
  isLoading: boolean;
}

export default function CsvAdd({ onSetLoader, isLoading }: ICsvAdd) {
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
    if (
      droppedFile?.type === 'text/csv' ||
      droppedFile?.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      setFile(droppedFile);
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (
      selectedFile?.type === 'text/csv' ||
      selectedFile?.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const parseCsv = async () => {
    if (!file) return;
    const fileToParse = file; // Use the file state instead of fileList
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = async (e: any) => {
        if (e.target && e.target.result) {
          let parsedResult: any = parse(e.target.result as any, {
            header: true,
            //@ts-expect-error - PapaParse types don't include encoding option
            encoding: 'utf-8',
            skipEmptyLines: true,
            dynamicTyping: true,
          });
          const cleanedData = [];

          for (const item of parsedResult.data) {
            let isNull = true;
            for (const key in item) {
              if (item[key] !== null) {
                isNull = false;
                break;
              }
            }
            if (isNull) {
              break;
            } else {
              cleanedData.push(item);
            }
          }
          parsedResult = cleanedData;

          const mappedDataArray = [];
          for (const item of parsedResult) {
            const mappedData = mapCsvToInterfaces(item);
            mappedDataArray.push(mappedData);
          }

          console.log({ original: parsedResult, mapped: mappedDataArray });
          resolve(mappedDataArray); // Add resolve to return the parsed data
        }
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsText(fileToParse, 'UTF-8');
    });
  };

  const addFiledata = async () => {
    if (file) {
      try {
        onSetLoader(true);
        const parsedData = await parseCsv();
        console.log(parsedData);
        const result = await window.electron.ipcRenderer.invoke(
          'import-csv',
          parsedData,
        ); // Send file to main process
        console.log(result);

        onSetLoader(false);
      } catch (error) {
        console.error('Error importing data:', error);
        onSetLoader(false);
      }
    } else {
      console.log('No file selected');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <div
        ref={dropZoneRef}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
          ${
            isDragging
              ? 'border-transparent bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
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
          <motion.div
            ref={fileIconRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="transition-all duration-300"
          >
            <div className="relative">
              <FileTextIcon
                className={`h-16 w-16 transition-colors duration-300 ${
                  isDragging
                    ? 'text-blue-500'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              {isDragging && (
                <div className="absolute inset-0 rounded-full animate-pulse bg-blue-500/20" />
              )}
            </div>
          </motion.div>
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
          <motion.label
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            htmlFor="csv-upload"
            className="relative px-6 py-2.5 rounded-md cursor-pointer group"
          >
            <div className="absolute inset-0 transition-opacity rounded-md opacity-100 animate-border bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 group-hover:opacity-90" />
            <span className="relative font-medium text-white">
              Browse Files
            </span>
          </motion.label>
        </div>
      </div>

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            ref={fileInfoRef}
            className="p-4 mt-4 duration-500 rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 dark:from-purple-500/5 dark:via-pink-500/5 dark:to-blue-500/5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20">
                  <FileTextIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </div>
                <span className="font-medium dark:text-gray-200">
                  {file.name}
                </span>
              </div>
              <div className="flex gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={addFiledata}
                    disabled={isLoading}
                    className="relative overflow-hidden group bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <SaveIcon className="w-4 h-4" />
                      {isLoading ? 'Saving...' : 'Save'}
                    </span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="relative overflow-hidden group"
                  >
                    <span className="relative z-10">Remove</span>
                    <div className="absolute inset-0 transition-transform duration-300 transform scale-x-0 bg-red-600 group-hover:scale-x-100" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
