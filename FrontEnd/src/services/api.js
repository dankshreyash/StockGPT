import axios from 'axios';
import { generateId } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const sendMessageToAgent = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      message: message
    });
    
    const data = response.data;
    
    // Construct the agent response structure based on the API response
    return {
      id: generateId(),
      sender: 'agent',
      type: data.type,
      text: data.text || data.message || "Here's the information:",
      stockData: data.stockData || (data.type === 'stock' ? data : null),
      chartData: data.chartData || null,
      analysisData: data.analysisData || null,
      comparisonData: data.comparisonData || null,
      newsData: data.newsData || null,
      technicalData: data.technicalData || null,
      financialData: data.financialData || null,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('API Error:', error);
    const message = error.response?.data?.message || 'Sorry, I encountered an error communicating with the server.';
    return {
      id: generateId(),
      sender: 'agent',
      type: 'error',
      text: message,
      stockData: null,
      timestamp: new Date().toISOString(),
    };
  }
};

export const getTrendingPrompts = async () => {
  try {
    const response = await axios.get(`${API_URL}/trending-prompts`);
    return response.data.prompts;
  } catch (error) {
    console.error('Failed to fetch trending prompts:', error);
    return [
      "HPCL",
      "Reliance",
      "TCS",
      "Compare HPCL vs BPCL",
      "Why did Infosys fall?"
    ];
  }
};
