import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Bar,
  ResponsiveContainer,
  LabelList
} from 'recharts';

// Custom Candlestick component for rendering each candlestick
const CustomCandlestick = (props) => {
  const { x, y, width, open, close, low, high } = props;
  const isGreen = close > open;
  const color = isGreen ? "#26a69a" : "#ef5350";
  const bodyHeight = Math.max(1, Math.abs(open - close));
  const bodyY = isGreen ? y + (high - close) : y + (high - open);
  const lineY = y + (high - low);

  return (
    <g>
      <line
        x1={x + width / 2}
        y1={y}
        x2={x + width / 2}
        y2={y + lineY}
        stroke={color}
        strokeWidth={1}
      />
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={bodyHeight}
        fill={color}
        stroke={color}
      />
      <LabelList
        dataKey="open"
        position="insideTopLeft"
        fill="#000"
        fontSize={12}
        offset={10}
        stroke="none"
      />
    </g>
  );
};

// Enhanced Candlestick Chart component
const EnhancedCandlestickChart = ({ data }) => (
  <div className="bg-gray-900 p-4 rounded-lg">
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
          stroke="#718096"
          tickLine={false}
        />
        <YAxis
          type="number"
          domain={[0, 'dataMax']}
          stroke="#718096"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#2D3748',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#E2E8F0'
          }}
          itemStyle={{ color: '#E2E8F0' }}
          labelStyle={{ color: '#A0AEC0' }}
          formatter={(value, name, props) => {
            const { payload } = props;
            return [
              `${name}: ${value.toFixed(2)}`,
              `Open: ${payload.open.toFixed(2)}`,
              `High: ${payload.high.toFixed(2)}`,
              `Low: ${payload.low.toFixed(2)}`,
              `Close: ${payload.close.toFixed(2)}`
            ];
          }}
        />
        <ReferenceLine yAxisId="price" y={0} stroke="#718096" strokeDasharray="3 3" />
        <Bar
          yAxisId="price"
          dataKey="high"
          shape={<CustomCandlestick />}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

const FundamentalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/fundamentals/search?ticker=${encodeURIComponent(searchTerm)}`);
      setStockData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching data. Please try again.');
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 text-purple-900 transition-colors duration-300">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 font-poppins text-center">Stock Fundamentals</h1>

        <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter stock symbol"
              className="flex-grow p-2 border border-purple-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-2 rounded-r-md hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
            >
              <Search size={24} />
            </button>
          </div>
        </form>

        {loading && <p className="text-center font-lato">Loading...</p>}
        {error && <p className="text-center text-red-500 font-lato">{error}</p>}

        {stockData && (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-poppins">{stockData.name} ({stockData.ticker})</h2>
            <div className="grid grid-cols-2 gap-4 font-montserrat mb-6">
              <div>
                <p className="font-semibold">Current Price:</p>
                <p>${parseFloat(stockData.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-semibold">Price Change:</p>
                <p className={`flex items-center ${parseFloat(stockData.priceChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {parseFloat(stockData.priceChange) >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                  ${Math.abs(parseFloat(stockData.priceChange)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Market Cap:</p>
                <p>${parseFloat(stockData.keyPoints.marketCap).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold">P/E Ratio:</p>
                <p>{parseFloat(stockData.keyPoints.stockPE).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-semibold">Book Value:</p>
                <p>${parseFloat(stockData.keyPoints.bookValue).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-semibold">Dividend Yield:</p>
                <p>{(parseFloat(stockData.keyPoints.dividendYield) * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="font-semibold">ROE:</p>
                <p>{(parseFloat(stockData.keyPoints.roe) * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="font-semibold">High/Low:</p>
                <p>{stockData.keyPoints.highLow}</p>
              </div>
            </div>

            {stockData.candlestickData && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 font-poppins text-white">Price Chart</h3>
                <EnhancedCandlestickChart data={stockData.candlestickData} />
              </div>
            )}

            {stockData.about && (
              <div className="mt-4">
                <p className="font-semibold">About:</p>
                <p className="text-sm">{stockData.about}</p>
              </div>
            )}

            {stockData.news && stockData.news.feed && (
              <div className="mt-4">
                <p className="font-semibold">Latest News:</p>
                <ul className="list-disc list-inside">
                  {stockData.news.feed.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-sm mt-2">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundamentalsPage;
