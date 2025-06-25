import React, { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CalculatorPage: React.FC = () => {
  const [calcValue, setCalcValue] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);

  const handleCalcInput = (val: string) => {
    if (val === 'C') {
      setCalcValue(''); setCalcResult(null);
    } else if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const res = eval(calcValue);
        setCalcResult(res.toString());
        setHistory(h => [{ expr: calcValue, result: res.toString() }, ...h]);
      } catch {
        setCalcResult('Errore');
      }
    } else {
      setCalcValue(v => v + val);
    }
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="p-2 rounded hover:bg-gray-100"><ArrowLeft className="h-6 w-6" /></Link>
          <h1 className="text-xl font-bold text-gray-900">Calcolatrice</h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-xs mx-auto">
          <div className="bg-gray-100 rounded-lg p-4 mb-2 text-right text-xl font-mono select-all min-h-[48px]">{calcResult !== null ? calcResult : calcValue || '0'}</div>
          <div className="grid grid-cols-4 gap-2">
            {[7,8,9,'/'].map(v => (
              <button key={v} className="p-3 rounded bg-white shadow hover:bg-blue-50" onClick={() => handleCalcInput(v.toString())}>{v}</button>
            ))}
            {[4,5,6,'*'].map(v => (
              <button key={v} className="p-3 rounded bg-white shadow hover:bg-blue-50" onClick={() => handleCalcInput(v.toString())}>{v}</button>
            ))}
            {[1,2,3,'-'].map(v => (
              <button key={v} className="p-3 rounded bg-white shadow hover:bg-blue-50" onClick={() => handleCalcInput(v.toString())}>{v}</button>
            ))}
            {[0,'.','=','+','C'].map(v => (
              <button key={v} className="p-3 rounded bg-white shadow hover:bg-blue-50" onClick={() => handleCalcInput(v.toString())}>{v}</button>
            ))}
          </div>
          {history.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">Cronologia</span>
                <button onClick={clearHistory} className="text-red-500 hover:text-red-700" title="Svuota cronologia"><Trash2 className="h-5 w-5" /></button>
              </div>
              <ul className="max-h-40 overflow-y-auto text-sm">
                {history.map((h, i) => (
                  <li key={i} className="flex justify-between border-b last:border-b-0 py-1">
                    <span className="font-mono text-gray-600">{h.expr}</span>
                    <span className="font-mono text-blue-700 font-semibold ml-2">= {h.result}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CalculatorPage; 