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

  const handleExportCSV = () => {
    // Generate CSV string from basic info
    if (!data) return;
    
    let csvString = 'Metric,Value\n';
    if (data.financialData) {
      Object.entries(data.financialData).forEach(([k, v]) => {
        csvString += `${k},"${v}"\n`;
      });
    }
    if (data.technicalData) {
      Object.entries(data.technicalData).forEach(([k, v]) => {
        csvString += `${k},"${v}"\n`;
      });
    }
    
    if (csvString === 'Metric,Value\n') {
      toast.error("No tabular data to export");
      return;
    }

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'StockGPT_Data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Downloaded successfully!");
  };

  const handleCopy = () => {
    if (data.text) {
      navigator.clipboard.writeText(data.text);
      toast.success("Summary copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5 opacity-50 hover:opacity-100 transition-opacity">
      <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mr-2">Export</span>
      <button onClick={handleExportPDF} title="Download PDF" className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-md border border-zinc-800 hover:border-zinc-600 transition-all">
        <FiFileText size={12} />
      </button>
      <button onClick={handleExportCSV} title="Download CSV" className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-md border border-zinc-800 hover:border-zinc-600 transition-all">
        <FiDownload size={12} />
      </button>
      <button onClick={handleCopy} title="Copy Summary" className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-md border border-zinc-800 hover:border-zinc-600 transition-all">
        <FiCopy size={12} />
      </button>
    </div>
  );
};

export default ExportMenu;
