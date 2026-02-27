import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { motion } from "framer-motion";

interface ResumeUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

const ResumeUpload = ({ onFileSelect, selectedFile }: ResumeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative glass rounded-xl p-8 text-center cursor-pointer transition-all ${
        isDragging ? "glow-border bg-primary/5" : "hover:border-primary/40"
      }`}
      onClick={() => document.getElementById("resume-input")?.click()}
    >
      <input
        id="resume-input"
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
      {selectedFile ? (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
        </motion.div>
      ) : (
        <>
          <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-foreground font-semibold mb-1">Drop your resume here</p>
          <p className="text-sm text-muted-foreground">PDF, DOC, DOCX · Max 10MB</p>
        </>
      )}
    </div>
  );
};

export default ResumeUpload;
