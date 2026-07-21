import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import StockCard from './StockCard';
import AnalysisCard from './AnalysisCard';
import PeerComparisonCard from './PeerComparisonCard';
import NewsSentimentCard from './NewsSentimentCard';
import TechnicalCard from './TechnicalCard';
import FinancialCard from './FinancialCard';
import ChartCard from './ChartCard';
import ForecastCard from './ForecastCard';
import RiskAnalysisCard from './RiskAnalysisCard';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-4`}
    >
      <div
        id={`bubble-${message.id}`}
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-green-600 text-white rounded-tr-sm'
            : 'bg-gray-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-sm border border-gray-300 dark:border-zinc-700/50 shadow-sm'
        }`}
      >
        {message.text && (
          <div className="prose dark:prose-invert max-w-none text-sm prose-p:leading-relaxed prose-pre:bg-gray-100 dark:prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-zinc-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
          </div>
        )}
        
        {message.stockData && !message.comparisonData && (
          <div className="mt-3">
            <StockCard data={message.stockData} />
          </div>
        )}

        {message.chartData && (
          <div className="mt-3">
            <ChartCard data={message.chartData} />
          </div>
        )}

        {message.technicalData && (
          <div className="mt-3">
            <TechnicalCard data={message.technicalData} />
          </div>
        )}

        {message.financialData && (
          <div className="mt-3">
            <FinancialCard data={message.financialData} />
          </div>
        )}

        {message.analysisData && (
          <>
            <div className="mt-3">
              <AnalysisCard data={message.analysisData} />
            </div>
            {message.analysisData.forecast && (
              <div className="mt-3">
                <ForecastCard data={message.analysisData} />
              </div>
            )}
            {message.analysisData.risk_analysis && (
              <div className="mt-3">
                <RiskAnalysisCard data={message.analysisData} />
              </div>
            )}
          </>
        )}

        {message.comparisonData && (
          <div className="mt-3">
            <PeerComparisonCard data={message.comparisonData} />
          </div>
        )}

        {message.newsData && (
          <div className="mt-3">
            <NewsSentimentCard data={message.newsData} />
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default MessageBubble;
