import React, { useEffect,useState, useRef  } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import News from './components/News';
import Chart from './components/Chart';
import { useLocalStorage } from './components/hooks/useLocalStorage';
import {DataProvider} from './components/utils/DataAPI';

export default function App() {
  const [isChildWindow, setIsChildWindow] = useLocalStorage('isChildWindow', false);
  const [isNewsVisible, setIsNewsVisible] = useLocalStorage('isNewsVisible', true);
  const [layout, setLayout] = useLocalStorage('appLayout', []);
  const [charts, setCharts] = useLocalStorage('charts', []);
  const chartsRef = useRef(charts);
  chartsRef.current = charts;

  const toggleChart = () => {
    const newChart = {
      id: uuidv4(),
      isVisible: true,
      remountCounter: 0, // Initialize remountCounter
    };
    setCharts(charts => [...charts, newChart]);
  };

  const hideChart = (id) => {
    setCharts(charts => charts.map(chart =>
      chart.id === id ? { ...chart, isVisible: false } : chart
    ));
  };


  useEffect(() => {

    const makeChartVisible = (chartId) => {
      console.log(`Remounting chart with ID: ${chartId}`);
      setCharts(chartsRef.current.map(chart =>
        chart.id === chartId ? { ...chart, remountCounter: chart.remountCounter + 1, isVisible: true } : chart
      ));
    };

    window.ipcRenderer?.on('make-news-visible', () => setIsNewsVisible(true));
    window.ipcRenderer?.on('chart-window-closed', makeChartVisible);

    return () => {
      window.ipcRenderer?.removeListener('make-news-visible', () => setIsNewsVisible(true));
      window.ipcRenderer?.removeListener('chart-window-closed', makeChartVisible);
    };
  }, []);

  return (
    <DataProvider>
    <div>
      <Header
        toggleNews={() => setIsNewsVisible(v => !v)}
        toggleChart={toggleChart}
      />
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        draggableCancel=".no-drag"
      >
        {isNewsVisible && (
          <div key="news">
            <News
              onPopOut={() => setIsNewsVisible(v => !v)}
              isChildWindow={isChildWindow}
            />
          </div>
        )}
        {charts.filter(chart => chart.isVisible).map((chart) => (
          <div key={`${chart.id}-${chart.remountCounter}`}>
            <Chart
              chartId={chart.id}
              onPopOut={() => hideChart(chart.id)}
              isChildWindow={isChildWindow}
              
            />
          </div>
        ))}
      </GridLayout>
    </div>
    </DataProvider>
  );
}
