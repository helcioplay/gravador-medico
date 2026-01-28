'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { CampaignInsight } from '@/lib/meta-marketing';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, Eye, Activity, AlertCircle, RefreshCw, Play, StopCircle, Video
} from 'lucide-react';
import { motion } from 'framer-motion';

// Formatar moeda BRL
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Formatar número
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(Math.round(value));
};

// Opções de período
const periodOptions = [
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: 'last_7d', label: 'Últimos 7 dias' },
  { value: 'last_14d', label: 'Últimos 14 dias' },
  { value: 'last_30d', label: 'Últimos 30 dias' },
  { value: 'this_month', label: 'Este mês' },
  { value: 'last_month', label: 'Mês passado' },
  { value: 'maximum', label: 'Todo período' },
];

export default function EngajamentoPage() {
  const [ads, setAds] = useState<CampaignInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('last_7d');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/ads/insights?period=${selectedPeriod}&level=ad`);
      const data = await res.json();
      setAds(Array.isArray(data) ? data : []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar engajamento:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod, fetchData]);

  // Calcular totais de engajamento
  const totals = useMemo(() => {
    const spend = ads.reduce((sum, a) => sum + Number(a.spend || 0), 0);
    const impressions = ads.reduce((sum, a) => sum + Number(a.impressions || 0), 0);
    const reach = ads.reduce((sum, a) => sum + Number((a as any).reach || 0), 0);
    const videoViews = ads.reduce((sum, a) => sum + Number((a as any).video_views || 0), 0);
    const thruPlays = ads.reduce((sum, a) => sum + Number((a as any).video_thru_plays || 0), 0);
    const stopRate = videoViews > 0 ? (1 - (thruPlays / videoViews)) * 100 : 0;
    const retention = thruPlays > 0 && videoViews > 0 ? (thruPlays / videoViews) * 100 : 0;
    
    return { spend, impressions, reach, videoViews, thruPlays, stopRate, retention };
  }, [ads]);

  // Ordenar por investimento
  const sortedAds = useMemo(() => {
    return [...ads].sort((a, b) => Number(b.spend || 0) - Number(a.spend || 0));
  }, [ads]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Engajamento e Distribuição</h1>
            <p className="text-gray-400">Métricas de vídeo e engajamento</p>
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

      {/* KPIs de Engajamento */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl border border-green-500/30 p-4">
          <p className="text-xs text-green-300 mb-1">Investimento</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totals.spend)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-blue-500/30 p-4">
          <p className="text-xs text-blue-300 mb-1">Impressões</p>
          <p className="text-2xl font-bold text-white">{formatNumber(totals.impressions)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl border border-purple-500/30 p-4">
          <p className="text-xs text-purple-300 mb-1">Engajamento</p>
          <p className="text-2xl font-bold text-white">{formatNumber(totals.reach)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-2xl border border-red-500/30 p-4">
          <p className="text-xs text-red-300 mb-1">ThruPlays</p>
          <p className="text-2xl font-bold text-white">{formatNumber(totals.thruPlays)}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-2xl border border-yellow-500/30 p-4">
          <p className="text-xs text-yellow-300 mb-1">Stop Rate</p>
          <p className="text-2xl font-bold text-white">{totals.stopRate.toFixed(1)}%</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/20 to-teal-600/20 rounded-2xl border border-cyan-500/30 p-4">
          <p className="text-xs text-cyan-300 mb-1">Retenção de Vídeo</p>
          <p className="text-2xl font-bold text-white">{totals.retention.toFixed(1)}%</p>
        </div>
      </div>

      {/* Tabela de Criativos com métricas de engajamento */}
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Tabela de Criativos</h2>
        </div>
        
        {loading ? (
          <div className="p-8 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 bg-white/10" />
            ))}
          </div>
        ) : sortedAds.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Não há dados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Anúncio</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Campanha</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">URL do Criativo</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">Investimento</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">Impressões</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">Engajamento</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">ThruPlays</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">Stop Rate</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">Retenção de Vídeo</th>
                </tr>
              </thead>
              <tbody>
                {sortedAds.slice(0, 20).map((ad, index) => {
                  const spend = Number(ad.spend || 0);
                  const impressions = Number(ad.impressions || 0);
                  const reach = Number((ad as any).reach || 0);
                  const thruPlays = Number((ad as any).video_thru_plays || 0);
                  const videoViews = Number((ad as any).video_views || 0);
                  const stopRate = videoViews > 0 ? (1 - (thruPlays / videoViews)) * 100 : 0;
                  const retention = thruPlays > 0 && videoViews > 0 ? (thruPlays / videoViews) * 100 : 0;
                  
                  return (
                    <motion.tr
                      key={ad.ad_id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-t border-white/5 hover:bg-white/5"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-red-400" />
                          <p className="font-medium text-white text-sm">{ad.ad_name || 'Sem nome'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{ad.campaign_name}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">—</td>
                      <td className="text-right px-4 py-3 text-green-400 font-medium">{formatCurrency(spend)}</td>
                      <td className="text-right px-4 py-3 text-blue-400">{formatNumber(impressions)}</td>
                      <td className="text-right px-4 py-3 text-purple-400">{formatNumber(reach)}</td>
                      <td className="text-right px-4 py-3 text-orange-400">{formatNumber(thruPlays)}</td>
                      <td className="text-right px-4 py-3 text-yellow-400">{stopRate.toFixed(1)}%</td>
                      <td className="text-right px-4 py-3 text-cyan-400">{retention.toFixed(1)}%</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
