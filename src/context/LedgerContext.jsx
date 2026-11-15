import { createContext, useEffect, useReducer, useState } from 'react';

export const LedgerContext = createContext();

const STORAGE_KEY = 'ledger-entries';
const RATES_KEY = 'ledger-rates';
const RATES_URL =
  'https://api.frankfurter.dev/v1/latest?base=KRW&symbols=USD,JPY,EUR,CNY,GBP';

function todayLocal() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function readRatesCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(RATES_KEY));
    if (saved && saved.rates && saved.ratesDate && saved.fetchedOn) return saved;
  } catch {

  }
  return null;
}

function init() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}


function ledgerReducer(entries, action) {
  switch (action.type) {
    case 'ADD':
      return [...entries, action.payload];
    case 'UPDATE': 
      return entries.map((e) =>
        e.id === action.payload.id ? { ...e, ...action.payload } : e
      );
    case 'DELETE': 
      return entries.filter((e) => e.id !== action.payload);
    default:
      throw new Error(`알 수 없는 액션: ${action.type}`);
  }
}

export function LedgerProvider({ children }) {
  const [entries, dispatch] = useReducer(ledgerReducer, [], init);

  const [fx, setFx] = useState(() => {
    const cache = readRatesCache();
    if (cache && cache.fetchedOn === todayLocal()) {
      return { rates: cache.rates, ratesDate: cache.ratesDate, ratesStatus: 'ok' };
    }
    return { rates: {}, ratesDate: '', ratesStatus: 'loading' };
  });


  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
     
    }
  }, [entries]);


  useEffect(() => {
    const cache = readRatesCache();
    if (cache && cache.fetchedOn === todayLocal()) return;

    let isCancelled = false;

    const loadRates = async () => {
      try {
        const response = await fetch(RATES_URL);
        if (!response.ok) throw new Error('환율 응답 오류');
        const data = await response.json();
        if (!data.rates || !data.date) throw new Error('환율 데이터 형식 오류');

      
        const rates = {};
        for (const [code, perWon] of Object.entries(data.rates)) {
          if (typeof perWon === 'number' && perWon > 0) rates[code] = 1 / perWon;
        }
        if (isCancelled) return;

        setFx({ rates, ratesDate: data.date, ratesStatus: 'ok' });
        try {
          localStorage.setItem(
            RATES_KEY,
            JSON.stringify({ fetchedOn: todayLocal(), rates, ratesDate: data.date })
          );
        } catch {
          
        }
      } catch {
        if (!isCancelled) setFx({ rates: {}, ratesDate: '', ratesStatus: 'error' });
      }
    };

    loadRates();

    return () => {
      isCancelled = true; 
    };
  }, []);

  return (
    <LedgerContext.Provider
      value={{
        entries,
        dispatch,
        rates: fx.rates,
        ratesDate: fx.ratesDate,
        ratesStatus: fx.ratesStatus,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}
