'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { CampaignInsight, calculateAdsMetrics } from '@/lib/meta-marketing';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, Eye, TrendingUp, RefreshCw, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Formatar moeda BRL
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Formatar número compacto
const formatNumberCompact = (value: number) => {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + ' mil';
  if (value >= 1000) return (value / 1000).toFixed(1) + ' mil';
  return value.toString();
};

// Opções de período
const periodOptions = [
  { value: 'last_7d', label: 'Últimos 7 dias' },
  { value: 'last_14d', label: 'Últimos 14 dias' },
  { value: 'last_30d', label: 'Últimos 30 dias' },
  { value: 'this_month', label: 'Este mês' },
  { value: 'last_month', label: 'Mês passado' },
  { value: 'maximum', label: 'Todo período' },
];

export default function HistoricoPage() {
  const [campaigns, setCampaigns] = useState<CampaignInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('last_30d');

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/ads/insights?period=${selectedPeriod}&level=campaign`);
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod, fetchData]);

  // Calcular totais
  const totals = useMemo(() => {
    const spend = campaigns.reduce((sum, c) => sum + Number(c.spend || 0), 0);
    const impressions = campaigns.reduce((sum, c) => sum + Number(c.impressions || 0), 0);
    const clicks = campaigns.reduce((sum, c) => sum + Number(c.clicks || 0), 0);
    const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
    return { spend, impressions, clicks, cpm };
  }, [campaigns]);

  // Dados simulados para gráficos (agrupados por mês)
  const chartData = useMemo(() => {
    // Na prática, a API deveria retornar dados por dia/mês
    // Aqui vamos simular alguns pontos
    const months = ['jan. de 2025', 'fev. de 2025', 'mar. de 2025', 'abr. de 2025', 'mai. de 2025', 'jun. de 2025', 'jul. de 2025', 'ago. de 2025'];
    return months.map((month, i) => ({
      month,
      investimento: Math.random() * 2500 + 200,
      impressoes: Math.random() * 100000 + 10000,
      cpm: Math.random() * 40 + 15,
    }));
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Histórico</h1>
            <p className="text-gray-400">Evolução das métricas ao longo do tempo</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>
            ))}
          </select>
          
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Seção Investimento */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Investimento</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl border border-green-500/30 p-5">
            <p className="text-sm text-green-300 mb-1">Investimento</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(totals.spend)}</p>
          </div>
          <div className="md:col-span-3 bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl border border-white/10 p-4">
            <div className="h-48">
              {loading ? (
                <Skeleton className="h-full bg-white/10" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorInvestimento" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#84cc16" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      formatter={(value) => [formatCurrency(Number(value || 0)), 'Investimento']}
                    />
                    <Area type="monotone" dataKey="investimento" stroke="#84cc16" strokeWidth={2} fillOpacity={1} fill="url(#colorInvestimento)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seção Impressões */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Impressões</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-blue-500/30 p-5">
            <p className="text-sm text-blue-300 mb-1">Impressões</p>
            <p className="text-3xl font-bold text-white">{formatNumberCompact(totals.impressions)}</p>
          </div>
          <div className="md:col-span-3 bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl border border-white/10 p-4">
            <div className="h-48">
              {loading ? (
                <Skeleton className="h-full bg-white/10" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      formatter={(value) => [formatNumberCompact(Number(value || 0)), 'Impressões']}
                    />
                    <Line type="monotone" dataKey="impressoes" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seção CPM */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">CPM</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl border border-purple-500/30 p-5">
            <p className="text-sm text-purple-300 mb-1">CPM</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(totals.cpm)}</p>
          </div>
          <div className="md:col-span-3 bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl border border-white/10 p-4">
            <div className="h-48">
              {loading ? (
                <Skeleton className="h-full bg-white/10" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} tickFormatter={(v) => `R$${v.toFixed(0)}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      formatter={(value) => [formatCurrency(Number(value || 0)), 'CPM']}
                    />
                    <Line type="monotone" dataKey="cpm" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
