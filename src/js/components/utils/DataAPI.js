import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({ list: [] }); // Assume initial data structure

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.bybit.com/v5/market/instruments-info?category=linear');
                setData(response.data.result);
                console.log(response.data.result)
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    const filterData = (searchTerm) => {
        if (!data || !Array.isArray(data.list)) return [];
      
        const upperCaseSearchTerm = searchTerm.toUpperCase();
        return data.list.filter(item =>
          item.symbol.startsWith(upperCaseSearchTerm) && item.quoteCoin === "USDT"
        );
      };

    return (
        <DataContext.Provider value={{ data, filterData }}>
            {children}
        </DataContext.Provider>
    );
};