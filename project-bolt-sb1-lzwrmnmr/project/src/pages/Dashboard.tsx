import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Farm } from '../types/database';
import { supabase } from '../lib/supabase';
import {
  Leaf, Plus, Settings, LogOut, LayoutDashboard, Map, Trash2, Menu,
  Moon, Sun, User, ChevronLeft, ChevronRight, Search, BarChart2,
  DollarSign, Cloud, AlertTriangle, TrendingUp, Users, Calendar,
  HelpCircle, ArrowUpRight, ArrowDownRight, Droplets, Thermometer,
  Wind, CloudRain
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardProps {
  onNavigateToProfile: () => void;
  userProfile: any;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
}

interface MetricsData {
  totalArea: number;
  avgProductivity: number;
  totalRevenue: number;
  totalCosts: number;
  weatherAlerts: number;
  activeProjects: number;
}

export default function Dashboard({ onNavigateToProfile, userProfile }: DashboardProps) {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [newFarm, setNewFarm] = useState({ name: '', area: '', location: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [metrics, setMetrics] = useState<MetricsData>({
    totalArea: 0,
    avgProductivity: 0,
    totalRevenue: 0,
    totalCosts: 0,
    weatherAlerts: 2,
    activeProjects: 3
  });
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    windSpeed: 12,
    rainChance: 30
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    fetchFarms();
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDarkMode]);

  useEffect(() => {
    if (farms.length > 0) {
      const totalArea = farms.reduce((sum, farm) => sum + farm.area, 0);
      setMetrics(prev => ({
        ...prev,
        totalArea,
        avgProductivity: Math.round((Math.random() * 500 + 500) * 100) / 100, // Simulado: 500-1000 kg/ha
        totalRevenue: Math.round(totalArea * (Math.random() * 5000 + 5000)), // Simulado: R$ 5000-10000/ha
        totalCosts: Math.round(totalArea * (Math.random() * 2000 + 1000)), // Simulado: R$ 1000-3000/ha
      }));
    }
  }, [farms]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer logout');
    }
  };

  const fetchFarms = async () => {
    try {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFarms(data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar fazendas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('farms').insert([
        {
          name: newFarm.name,
          area: parseFloat(newFarm.area),
          location: newFarm.location,
        },
      ]);

      if (error) throw error;

      toast.success('Fazenda adicionada com sucesso!');
      setShowAddFarm(false);
      setNewFarm({ name: '', area: '', location: '' });
      fetchFarms();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar fazenda');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFarm = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta fazenda?')) return;

    try {
      const { error } = await supabase
        .from('farms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Fazenda excluída com sucesso!');
      fetchFarms();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir fazenda');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementação futura: Integração com IA para pesquisa avançada
    toast.success('Pesquisa inteligente será implementada em breve!');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Botão do menu móvel */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Overlay para fechar o menu em dispositivos móveis */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0.1 }}
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-8 h-8 text-green-500" />
                <span className="text-xl font-bold text-gray-800 dark:text-white">AgroCacau</span>
              </div>

              {/* Seção de Perfil */}
              <button
                onClick={onNavigateToProfile}
                className="w-full flex items-center gap-3 p-3 mb-6 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center overflow-hidden">
                    {userProfile?.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {userProfile?.display_name || userProfile?.full_name || 'Usuário'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {userProfile?.professional_title || 'Agricultor'}
                  </span>
                </div>
              </button>
              
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Map className="w-5 h-5" />
                  Mapa
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="w-5 h-5" />
                  Configurações
                </button>
              </nav>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-5 h-5" />
                    Modo Claro
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    Modo Escuro
                  </>
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>

            {/* Botão para recolher a sidebar em telas maiores */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-white dark:bg-gray-800 items-center justify-center rounded-r-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'} p-4 md:p-8`}>
        {/* Barra de Pesquisa com IA */}
        <div className="mb-8 mt-12 md:mt-0">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por fazendas, relatórios ou faça perguntas à IA..."
              className="w-full px-4 py-3 pl-12 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500/50 dark:text-white"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <span className="text-xs text-gray-400">Powered by AI</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
          </form>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Map className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-400 dark:text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metrics.totalArea} ha
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Área Total Cultivada
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-400 dark:text-gray-500">Média</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metrics.avgProductivity} kg/ha
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Produtividade Média
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs">+12%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              R$ {metrics.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receita Estimada
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <ArrowDownRight className="w-4 h-4" />
                <span className="text-xs">2 alertas</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              R$ {metrics.totalCosts.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Custos Estimados
            </p>
          </motion.div>
        </div>

        {/* Previsão do Tempo e Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Previsão do Tempo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Temperatura</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{weather.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Umidade</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{weather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Wind className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vento</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{weather.windSpeed} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <CloudRain className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chuva</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{weather.rainChance}%</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Alertas
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Risco de pragas detectado
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">
                  Fazenda São João - Setor 3
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Previsão de chuva forte
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Próximas 48 horas
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Lista de Fazendas */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Minhas Fazendas</h2>
            <button
              onClick={() => setShowAddFarm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nova Fazenda</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : farms.length === 0 ? (
            <div className="text-center py-12">
              <Leaf className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Você ainda não possui fazendas cadastradas.</p>
              <button
                onClick={() => setShowAddFarm(true)}
                className="mt-4 text-green-500 hover:underline"
              >
                Adicionar primeira fazenda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {farms.map((farm) => (
                <motion.div
                  key={farm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{farm.name}</h3>
                    <button
                      onClick={() => handleDeleteFarm(farm.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p>Área: {farm.area} hectares</p>
                    <p>Localização: {farm.location}</p>
                    <div className="pt-4 flex justify-between items-center text-sm">
                      <span className="text-green-500 dark:text-green-400">
                        Produtividade: {Math.round(Math.random() * 500 + 500)} kg/ha
                      </span>
                      <span className="text-blue-500 dark:text-blue-400">
                        Safra em andamento
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add Farm Modal */}
        <AnimatePresence>
          {showAddFarm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nova Fazenda</h2>
                <form onSubmit={handleAddFarm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome da Fazenda
                    </label>
                    <input
                      type="text"
                      value={newFarm.name}
                      onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Área (hectares)
                    </label>
                    <input
                      type="number"
                      value={newFarm.area}
                      onChange={(e) => setNewFarm({ ...newFarm, area: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Localização
                    </label>
                    <input
                      type="text"
                      value={newFarm.location}
                      onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                      required
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddFarm(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-70"
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  ); }