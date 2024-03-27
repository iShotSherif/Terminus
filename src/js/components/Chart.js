import React, { useEffect, useState, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import HeaderComponent from './HeaderComponent';
import './styles/Chart.css';
import { fetchCandlestickData } from './utils/KlineAPI';
import { useData } from './utils/DataAPI';


const Chart = ({ chartId, isChildWindow: isChildWindowProp, onPopOut, symbol  }) => {
  const isChildWindow = isChildWindowProp || window.ipcRenderer?.isChildWindow || false;
  const chartContainerRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [isInChildWindow, setIsInChildWindow] = useState(false);
  const { filterData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [candlestickSeries, setCandlestickSeries] = useState(null);

  const handlePopOutClick = () => {
    setIsInChildWindow(true);
    window.ipcRenderer.send('pop-out-chart', { chartId, symbol: searchTerm });
    onPopOut(chartId);
  };

  const handleCloseNewsClick = () => {
    if (isChildWindow) {
      window.ipcRenderer.send('reopen-chart-in-main', chartId);
      window.close();
    } else {
      onPopOut && onPopOut(chartId);
    }
  };

  useEffect(() => {
    const handleMakeChartVisible = () => {
      setIsInChildWindow(false);
    };

    window.ipcRenderer.on('make-chart-visible', handleMakeChartVisible);

    return () => {
      window.ipcRenderer.removeListener('make-chart-visible', handleMakeChartVisible);
    };
  }, []);

    useEffect(() => {
      const filtered = filterData(searchTerm);
      setFilteredCoins(filtered);
    }, [searchTerm, filterData]);
    
    const handleSearch = (event) => {
      const searchValue = event.target.value;
      setSearchTerm(searchValue);
      setShowSearchResults(true);
    };
  
    // Modified to fetch and render chart data on coin selection
    const handleCoinSelect = (coin) => {
      setShowSearchResults(false);
      setSearchTerm(coin.symbol);
      
      if (!chart) {
        console.error("Chart is not initialized.");
        return;
      }
  
      fetchCandlestickData(coin.symbol)
        .then(candlestickData => {
          if (!candlestickSeries) {
            console.error("Candlestick series is not initialized.");
            return;
          }
          candlestickSeries.setData(candlestickData);
          chart.timeScale().fitContent();
          const priceScale = coin.priceScale;
          candlestickSeries.applyOptions({
            priceFormat: {
              type: 'price',
              precision: priceScale,
              minMove: 1 / Math.pow(10, priceScale),
            },
          });
        })
        .catch(error => {
          console.error("Error fetching candlestick data:", error);
        });
    };

  useEffect(() => {
    if (chartContainerRef.current) {
      const chartOptions = {
        layout: {
          textColor: 'white',
          background: { type: 'solid', color: '#333' },
        },
      };
  
      const newChart = createChart(chartContainerRef.current, chartOptions);
      setChart(newChart);
  
      const newCandlestickSeries = newChart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
  
      setCandlestickSeries(newCandlestickSeries);
    }
  
    return () => {
      if (chart) {
        chart.remove();
        setChart(null);
      }
    };
  }, []);

  useEffect(() => {
    if (searchTerm && candlestickSeries) {
      console.log('Fetching candlestick data for searchTerm:', searchTerm);
      fetchCandlestickData(symbol || searchTerm).then(data => {
        candlestickSeries.setData(data);
        chart.timeScale().fitContent();
      }).catch(error => {
        console.error("Error fetching candlestick data:", error);
        // Handle error (e.g., show a notification to the user)
      });
    }
  }, [candlestickSeries, chart, symbol]);

  useEffect(() => {
    if (!chart) return;

    const resizeChart = () => {
      const { width, height } = chartContainerRef.current.getBoundingClientRect();
      chart.applyOptions({ width, height });
    };

    if (isChildWindow) {
      const handleResize = () => {
        const { innerWidth, innerHeight } = window;
        const adjustedHeight = innerHeight - 100;
        const adjustedWidth = innerWidth - 10;
        chart.applyOptions({ width: adjustedWidth, height: adjustedHeight });
      };
    
      // Attach the event listener
      window.addEventListener('resize', handleResize);
      // Call the resize handler immediately to apply the size adjustment
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    
    } else {
      const resizeObserver = new ResizeObserver(() => {
        resizeChart();
      });

      resizeObserver.observe(chartContainerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [chart, isChildWindow]);


  return (
    <div className={`chart-container ${!isChildWindow ? 'overflow-hidden' : ''}`}>
      <HeaderComponent
        title="Chart"
        onPopOut={!isChildWindow ? handlePopOutClick : undefined}
        onClose={handleCloseNewsClick}
        isChildWindow={isChildWindow}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        filteredCoins={filteredCoins}
        onCoinSelect={handleCoinSelect}
        showSearchResults={showSearchResults}
      />
      <div
        ref={chartContainerRef}
        id={chartId}
        className="no-drag chart"
      ></div>
    </div>
  );
};

export default Chart;