import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { Sprout, Mail, Lock, Eye, EyeOff, LineChart, Smartphone, Leaf, BarChart3, Users, Cloud, Zap, MessageSquare, Heart, Facebook, Twitter, Instagram, Linkedin as LinkedIn, Plus, Minus, ArrowRight } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setUserProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Login realizado com sucesso!');
      } else {
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Cadastro realizado com sucesso! Verifique seu email.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro na autenticação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToProfile = () => {
    setCurrentPage('profile');
  };

  const handleNavigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      title: "Análise Avançada",
      description: "Monitore todos os aspectos da sua produção com gráficos detalhados e insights em tempo real."
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Gestão de Equipe",
      description: "Gerencie sua equipe, atribua tarefas e acompanhe o progresso de cada colaborador."
    },
    {
      icon: <Cloud className="w-8 h-8 text-green-500" />,
      title: "Dados na Nuvem",
      description: "Acesse seus dados de qualquer lugar, com backup automático e sincronização em tempo real."
    },
    {
      icon: <Zap className="w-8 h-8 text-green-500" />,
      title: "Automação",
      description: "Automatize tarefas repetitivas e aumente a eficiência da sua fazenda."
    }
  ];

  const faqs = [
    {
      question: "Como começar a usar o AgroCacau?",
      answer: "Basta criar uma conta gratuita e começar a cadastrar sua fazenda. Nosso processo é simples e intuitivo."
    },
    {
      question: "O sistema funciona offline?",
      answer: "Sim, você pode usar o AgroCacau mesmo sem internet. Os dados serão sincronizados automaticamente quando a conexão for restabelecida."
    },
    {
      question: "Posso gerenciar múltiplas fazendas?",
      answer: "Sim, você pode cadastrar e gerenciar quantas fazendas desejar em uma única conta."
    }
  ];

  if (session) {
    if (currentPage === 'profile') {
      return <Profile onNavigateBack={handleNavigateToDashboard} />;
    }
    return <Dashboard 
      onNavigateToProfile={handleNavigateToProfile} 
      userProfile={userProfile}
    />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      {/* Botão de Login Flutuante */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2"
      >
        <span>Login</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Hero Section com Formulário */}
      <div className="bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-green-300 via-green-500 to-green-600">
        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center min-h-screen gap-12">
          {/* Seção de Boas-vindas */}
          <div className="lg:w-1/2 text-white">
            <div className="mb-6">
              <Sprout className="w-16 h-16 mb-4" />
              <h1 className="text-4xl font-bold mb-4">AgroCacau</h1>
              <div className="text-xl h-24">
                <Typewriter
                  options={{
                    strings: [
                      'Gestão inteligente para sua fazenda de cacau',
                      'Monitore sua produção em tempo real',
                      'Tome decisões baseadas em dados',
                      'Aumente sua produtividade'
                    ],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Análises Detalhadas</h3>
                  <p className="text-white/80">Acompanhe métricas e tendências</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Acesso Mobile</h3>
                  <p className="text-white/80">Gerencie de qualquer lugar</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Sustentabilidade</h3>
                  <p className="text-white/80">Práticas agrícolas responsáveis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Login/Cadastro */}
          <div className="lg:w-1/2 max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                </h2>
                <p className="text-gray-600">
                  {isLogin
                    ? 'Entre para continuar gerenciando sua fazenda'
                    : 'Comece a gerenciar sua fazenda de forma inteligente'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/50"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirme a Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Carregando...
                    </div>
                  ) : isLogin ? (
                    'Entrar'
                  ) : (
                    'Cadastrar'
                  )}
                </button>
              </form>

              <div className="mt-6">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  {isLogin
                    ? 'Não tem uma conta? Cadastre-se'
                    : 'Já tem uma conta? Entre'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Seção de Recursos */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Recursos que Transformam sua Gestão
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={false}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <Minus className="w-5 h-5 text-green-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-green-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Suporte */}
      <section className="py-20 bg-green-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Precisa de Ajuda?</h2>
          <p className="mb-8 text-lg">Nossa equipe está pronta para ajudar você a ter a melhor experiência possível</p>
          <button className="bg-white text-green-500 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
            <MessageSquare className="w-5 h-5" />
            Fale Conosco
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
              <p className="text-gray-400">
                Transformando a gestão de fazendas de cacau com tecnologia e inovação.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Siga-nos</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-green-500 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-green-500 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-green-500 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-green-500 transition-colors">
                  <LinkedIn className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2024 AgroCacau. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;