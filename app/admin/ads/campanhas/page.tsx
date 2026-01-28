'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getAdsInsights, calculateAdsMetrics, CampaignInsight, AdsMetrics } from '@/lib/meta-marketing';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, MousePointerClick, Eye, Users, TrendingUp, AlertCircle, 
  RefreshCw, Megaphone, Target, Filter, ArrowUpDown, PlayCircle, Facebook
} from 'lucide-react';
import { motion } from 'framer-motion';

// Formatar moeda BRL
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Formatar número com separador de milhar
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(Math.round(value));
};

// Badge de status da campanha
function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    ACTIVE: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Ativa' },
    PAUSED: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pausada' },
    DELETED: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Excluída' },
    ARCHIVED: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Arquivada' },
    CAMPAIGN_PAUSED: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pausada' },
    UNKNOWN: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Desconhecido' },
  };

  const config = statusConfig[status] || statusConfig.UNKNOWN;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

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

// Opções de filtro por status
const statusFilterOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Ativas' },
  { value: 'paused', label: 'Pausadas' },
];

// Opções de ordenação
const sortOptions = [
  { value: 'spend_desc', label: 'Maior gasto' },
  { value: 'spend_asc', label: 'Menor gasto' },
  { value: 'clicks_desc', label: 'Mais cliques' },
  { value: 'ctr_desc', label: 'Melhor CTR' },
  { value: 'conversions_desc', label: 'Mais conversões' },
];

export default function CampanhasPage() {
  const [campaigns, setCampaigns] = useState<CampaignInsight[]>([]);
  const [metrics, setMetrics] = useState<AdsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('last_7d');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('spend_desc');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/ads/insights?period=${selectedPeriod}&level=campaign`);
      const data = await res.json();
      const campaignsData = Array.isArray(data) ? data : [];
      setCampaigns(campaignsData);
      setMetrics(calculateAdsMetrics(campaignsData));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod, fetchData]);

  // Filtrar e ordenar campanhas
  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];
    
    // Filtrar por status
    if (statusFilter !== 'all') {
      result = result.filter(c => {
        const status = (c as any).effective_status || 'UNKNOWN';
        if (statusFilter === 'active') return status === 'ACTIVE';
        if (statusFilter === 'paused') return status === 'PAUSED';
        return true;
      });
    }
    
    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'spend_desc': return Number(b.spend || 0) - Number(a.spend || 0);
        case 'spend_asc': return Number(a.spend || 0) - Number(b.spend || 0);
        case 'clicks_desc': return Number(b.clicks || 0) - Number(a.clicks || 0);
        case 'ctr_desc': return Number(b.ctr || 0) - Number(a.ctr || 0);
        case 'conversions_desc': return Number((b as any).conversions || 0) - Number((a as any).conversions || 0);
        default: return Number(b.spend || 0) - Number(a.spend || 0);
      }
    });
    
    return result;
  }, [campaigns, statusFilter, sortBy]);

  // Calcular totais
  const totals = useMemo(() => ({
    spend: filteredCampaigns.reduce((sum, c) => sum + Number(c.spend || 0), 0),
    impressions: filteredCampaigns.reduce((sum, c) => sum + Number(c.impressions || 0), 0),
    clicks: filteredCampaigns.reduce((sum, c) => sum + Number(c.clicks || 0), 0),
    conversions: filteredCampaigns.reduce((sum, c) => sum + Number((c as any).conversions || 0), 0),
  }), [filteredCampaigns]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Megaphone className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Campanhas</h1>
            <p className="text-gray-400">Performance por campanha</p>
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
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          >
            {statusFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>
            ))}
          </select>
          
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* KPIs Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl border border-green-500/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span className="text-sm text-green-300">Investimento</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totals.spend)}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-blue-500/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-blue-300">Impressões</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(totals.impressions)}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl border border-purple-500/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <MousePointerClick className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-purple-300">Cliques</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(totals.clicks)}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-amber-600/20 rounded-2xl border border-orange-500/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-orange-400" />
            <span className="text-sm text-orange-300">Conversões</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(totals.conversions)}</div>
        </div>
      </div>

      {/* Tabela de Campanhas */}
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-400" />
            Campanhas ({filteredCampaigns.length})
          </h2>
          <span className="text-xs text-gray-400">
            Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
          </span>
        </div>
        
        {loading ? (
          <div className="p-8 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 bg-white/10" />
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma campanha encontrada para o período selecionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left text-xs font-semibold text-gray-400 px-4 py-3">Campanha</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">Investimento</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">Impressões</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">CPM</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">Cliques</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">CTR</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">CPC</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">Conversões</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-4 py-3">CPL</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, index) => {
                  const spend = Number(campaign.spend || 0);
                  const impressions = Number(campaign.impressions || 0);
                  const clicks = Number(campaign.clicks || 0);
                  const ctr = Number(campaign.ctr || 0);
                  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
                  const cpc = clicks > 0 ? spend / clicks : 0;
                  const conversions = Number((campaign as any).conversions || 0);
                  const cpl = conversions > 0 ? spend / conversions : 0;
                  
                  return (
                    <motion.tr
                      key={campaign.campaign_id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/20">
                            <PlayCircle className="h-4 w-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{campaign.campaign_name}</p>
                            <StatusBadge status={(campaign as any).effective_status || 'UNKNOWN'} />
                          </div>
                        </div>
                      </td>
                      <td className="text-right px-4 py-3 text-green-400 font-medium">{formatCurrency(spend)}</td>
                      <td className="text-right px-4 py-3 text-gray-300">{formatNumber(impressions)}</td>
                      <td className="text-right px-4 py-3 text-gray-400">{formatCurrency(cpm)}</td>
                      <td className="text-right px-4 py-3 text-blue-400">{formatNumber(clicks)}</td>
                      <td className="text-right px-4 py-3 text-purple-400">{ctr.toFixed(2)}%</td>
                      <td className="text-right px-4 py-3 text-gray-400">{formatCurrency(cpc)}</td>
                      <td className="text-right px-4 py-3 text-orange-400 font-medium">{formatNumber(conversions)}</td>
                      <td className="text-right px-4 py-3 text-gray-400">{conversions > 0 ? formatCurrency(cpl) : '—'}</td>
                    </motion.tr>
                  );
                })}
                {/* Linha de Total */}
                <tr className="border-t-2 border-white/20 bg-white/5 font-bold">
                  <td className="px-4 py-3 text-white">Total Geral</td>
                  <td className="text-right px-4 py-3 text-green-400">{formatCurrency(totals.spend)}</td>
                  <td className="text-right px-4 py-3 text-gray-300">{formatNumber(totals.impressions)}</td>
                  <td className="text-right px-4 py-3 text-gray-400">{totals.impressions > 0 ? formatCurrency((totals.spend / totals.impressions) * 1000) : '—'}</td>
                  <td className="text-right px-4 py-3 text-blue-400">{formatNumber(totals.clicks)}</td>
                  <td className="text-right px-4 py-3 text-purple-400">{totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : 0}%</td>
                  <td className="text-right px-4 py-3 text-gray-400">{totals.clicks > 0 ? formatCurrency(totals.spend / totals.clicks) : '—'}</td>
                  <td className="text-right px-4 py-3 text-orange-400">{formatNumber(totals.conversions)}</td>
                  <td className="text-right px-4 py-3 text-gray-400">{totals.conversions > 0 ? formatCurrency(totals.spend / totals.conversions) : '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
