
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan 1',
    revenue: 4000,
    repayments: 2400,
  },
  {
    name: 'Jan 5',
    revenue: 3000,
    repayments: 1398,
  },
  {
    name: 'Jan 10',
    revenue: 2000,
    repayments: 9800,
  },
  {
    name: 'Jan 15',
    revenue: 2780,
    repayments: 3908,
  },
  {
    name: 'Jan 20',
    revenue: 1890,
    repayments: 4800,
  },
  {
    name: 'Jan 25',
    revenue: 2390,
    repayments: 3800,
  },
  {
    name: 'Jan 30',
    revenue: 3490,
    repayments: 4300,
  },
];

const Chart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
        <YAxis stroke="rgba(255,255,255,0.5)" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(26, 31, 44, 0.8)', 
            borderColor: 'rgba(139, 92, 246, 0.5)',
            borderRadius: '8px',
            color: '#fff' 
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#8B5CF6" 
          fill="url(#colorRevenue)" 
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="repayments" 
          stroke="#0EA5E9" 
          fill="url(#colorRepayments)" 
          fillOpacity={0.3}
        />
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorRepayments" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
