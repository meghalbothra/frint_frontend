import React, { useState } from 'react';
import { Upload, ArrowRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface ResumeUploadProps {
  onUpload: (files: FileList) => void;
  onContinue: (userId: string) => void; // Update onContinue to accept userId
}

export function ResumeUpload({ onUpload, onContinue }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [isUserIdInputVisible, setIsUserIdInputVisible] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFiles(fileArray);
    onUpload(files); // Pass the files to the parent component
  };

  const handleUserIdSubmit = () => {
    if (userId.trim()) {
      onContinue(userId); // Pass the userId to parent component's onContinue
    } else {
      alert("Please enter a valid user ID.");
    }
  };

  const promptForUserId = () => {
    setIsUserIdInputVisible(true);
    const inputUserId = window.prompt("Please enter your user ID:");
    if (inputUserId) {
      setUserId(inputUserId);
      handleUserIdSubmit(); // Proceed after user ID is entered
    } else {
      alert("User ID is required.");
    }
  };

  return (
    <GlassCard className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Upload Your Resume</h2>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
                   ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-white/30'}`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600 mb-4">Drag and drop your resume here or click to browse</p>
        <input
          type="file"
          onChange={handleFileInput}
          accept=".pdf,.doc,.docx"
          className="hidden"
          id="fileInput"
          multiple
        />
        <label
          htmlFor="fileInput"
          className="inline-block bg-blue-600/90 backdrop-blur-sm text-white py-2 px-6 rounded-lg cursor-pointer
                   transition-all duration-300 hover:bg-blue-700"
        >
          Browse Files
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-2">Uploaded Files:</h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <span className="mr-2">📄</span>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isUserIdInputVisible ? (
        <div className="mt-6">
          <button
            onClick={promptForUserId}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white bg-blue-600/90 hover:bg-blue-700`}
          >
            Enter User ID
          </button>
        </div>
      ) : (
        <button
          onClick={handleUserIdSubmit}
          disabled={uploadedFiles.length === 0 || !userId.trim()}
          className={`mt-6 w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold
                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                     ${uploadedFiles.length === 0 || !userId.trim() 
                       ? 'bg-gray-300/50 cursor-not-allowed' 
                       : 'bg-blue-600/90 backdrop-blur-sm text-white hover:bg-blue-700'}`}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </GlassCard>
  );
}
