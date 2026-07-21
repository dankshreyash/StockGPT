import React from 'react';
import { FiDownload, FiFileText, FiCopy } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const ExportMenu = ({ targetRefId, data }) => {
  const handleExportPDF = async () => {
    try {
      const element = document.getElementById(targetRefId);
      if (!element) return;
      
      const canvas = await html2canvas(element, { backgroundColor: '#18181b' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('StockGPT_Analysis.pdf');
      toast.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleCopy = () => {
    if (data.text) {
      navigator.clipboard.writeText(data.text);
      toast.success("Summary copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-black/5 dark:border-white/5 opacity-50 hover:opacity-100 transition-opacity">
      <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mr-2">Export</span>
      <button onClick={handleExportPDF} title="Download PDF" className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 rounded-md border border-gray-200 dark:border-zinc-800 hover:border-zinc-600 transition-all">
        <FiFileText size={12} />
      </button>
      <button onClick={handleCopy} title="Copy Summary" className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 rounded-md border border-gray-200 dark:border-zinc-800 hover:border-zinc-600 transition-all">
        <FiCopy size={12} />
      </button>
    </div>
  );
};

export default ExportMenu;
