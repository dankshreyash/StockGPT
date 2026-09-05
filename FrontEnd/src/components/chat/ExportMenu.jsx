import React from 'react';
import { FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const ExportMenu = ({ targetRefId, label }) => {
  const handleExportPDF = async () => {
    try {
      const element = document.getElementById(targetRefId);
      if (!element) {
        toast.error("Could not find content to export");
        return;
      }

      toast.loading("Generating PDF...", { id: 'pdf-export' });

      const canvas = await html2canvas(element, {
        backgroundColor: '#18181b',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pxWidth = canvas.width;
      const pxHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: pxHeight > pxWidth ? 'portrait' : 'landscape',
        unit: 'px',
        format: [pxWidth, pxHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pxWidth, pxHeight);
      pdf.save(`StockGPT_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded!", { id: 'pdf-export' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Failed to generate PDF", { id: 'pdf-export' });
    }
  };

  return (
    <button
      onClick={handleExportPDF}
      title={label || "Download as PDF"}
      className="flex items-center gap-1.5 px-2 py-1 mt-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 bg-gray-100 dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-green-300 dark:hover:border-green-800 transition-all"
    >
      <FiDownload size={12} />
      Download PDF
    </button>
  );
};

export default ExportMenu;
