"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Shield,
  Smartphone,
  Brain,
  Zap,
  Gift,
  Star,
  ChevronRight,
  Play,
  Users,
  TrendingUp,
  BarChart3,
  MessageSquare,
  FileCheck,
  Headphones,
  Video,
  ArrowRight,
  Check,
  Menu,
  Mic,
  Wand2,
  Lock,
  Rocket,
  Award,
  Infinity as InfinityIcon,
  Download,
  Globe,
} from "lucide-react"
import Link from "next/link"

// Componente de partículas flutuantes
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
              className="absolute w-1 h-1 bg-brand-500/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Componente de ícone 3D flutuante
const FloatingIcon = ({ icon: Icon, delay = 0, duration = 3 }: any) => {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotateY: [0, 180, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className="absolute"
    >
      <div className="relative">
  <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl blur-xl opacity-50" />
  <div className="relative bg-gradient-to-br from-brand-400 to-brand-600 p-4 rounded-2xl shadow-2xl border border-white/20">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

// Componente de card 3D com hover effect
const Card3D = ({ children, className = "" }: any) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]))
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]))

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - rect.left - rect.width / 2)
        y.set(e.clientY - rect.top - rect.height / 2)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      
      {/* Cursor glow effect */}
      <div 
        className="fixed w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Animated grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000,transparent)]" />
      
      <FloatingParticles />

      {/* HEADER FUTURISTA */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
    className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-brand-500/20"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500 rounded-xl blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-xl">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-brand-400 to-brand-400 bg-clip-text text-transparent">
              Gravador Médico
            </span>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-8">
            {["Benefícios", "Como Funciona", "Bônus", "Garantia"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-300 hover:text-brand-400 font-medium transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-400 to-brand-400 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-brand-500/50 hover:shadow-brand-500/80 transition-all"
            >
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <Menu className="w-6 h-6 text-brand-400" />
          </button>
        </div>
      </motion.header>

      {/* HERO SECTION FUTURISTA */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
        
        {/* Ícones 3D flutuantes ao redor */}
        <div className="absolute inset-0 hidden lg:block">
          <div className="relative w-full h-full">
            <div className="absolute top-20 left-20">
              <FloatingIcon icon={Mic} delay={0} duration={4} />
            </div>
            <div className="absolute top-40 right-32">
              <FloatingIcon icon={Brain} delay={0.5} duration={3.5} />
            </div>
            <div className="absolute bottom-40 left-40">
              <FloatingIcon icon={Smartphone} delay={1} duration={4.5} />
            </div>
            <div className="absolute bottom-32 right-20">
              <FloatingIcon icon={FileCheck} delay={1.5} duration={3} />
            </div>
            <div className="absolute top-1/3 left-10">
              <FloatingIcon icon={Zap} delay={2} duration={3.8} />
            </div>
            <div className="absolute top-1/2 right-10">
              <FloatingIcon icon={Shield} delay={2.5} duration={4.2} />
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            
            {/* Badge de novidade */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500/20 to-brand-500/20 border border-brand-500/30 px-6 py-3 rounded-full backdrop-blur-xl"
            >
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span className="text-brand-400 font-semibold">Tecnologia do Futuro Disponível Hoje</span>
            </motion.div>

            {/* Headline principal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight">
                  <span className="inline-block bg-gradient-to-r from-white via-brand-200 to-white bg-clip-text text-transparent">
                  Grave com 1 Toque,
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-brand-400 via-brand-400 to-brand-400 bg-clip-text text-transparent animate-gradient">
                  Gere Prontuários Automáticos
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  e Pare de Perder Tempo
                </span>
              </h1>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-light"
            >
              Seu iPhone é a porta de entrada para{" "}
              <span className="text-brand-400 font-semibold">prontuários perfeitos</span> sem digitar uma palavra
            </motion.p>

            {/* Mockup 3D futurista */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="my-16 relative"
            >
              <div className="relative max-w-4xl mx-auto">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl blur-3xl opacity-30" />
                
                {/* Card principal */}
                <Card3D className="relative bg-gradient-to-br from-gray-900/90 via-brand-900/30 to-gray-900/90 rounded-3xl p-8 md:p-16 backdrop-blur-xl border border-brand-500/30 shadow-2xl">
                  <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl" />
                    
                    <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                      {/* iPhone mockup */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-brand-500 rounded-3xl blur-xl opacity-50" />
                        <div className="relative w-48 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-3 border-2 border-gray-700 shadow-2xl">
                          <div className="w-full h-full bg-gradient-to-br from-brand-950 to-gray-900 rounded-2xl flex flex-col items-center justify-center gap-4 p-6">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Mic className="w-16 h-16 text-brand-400" />
                            </motion.div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 bg-brand-400 rounded-full"
                                  animate={{ 
                                    height: [20, Math.random() * 40 + 20, 20] 
                                  }}
                                  transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                  }}
                                />
                              ))}
                            </div>
                            <p className="text-brand-400 text-xs font-semibold">Gravando...</p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Arrow with particles */}
                      <div className="relative">
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ArrowRight className="w-16 h-16 text-brand-400" />
                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0, 1, 0], x: [0, 30, 60] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute top-1/2 left-1/2 w-2 h-2 bg-brand-400 rounded-full"
                        />
                      </div>

                      {/* Document mockup */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-brand-500 rounded-2xl blur-xl opacity-50" />
                        <div className="relative w-56 bg-gradient-to-br from-white to-brand-50 rounded-2xl p-6 shadow-2xl border border-brand-200">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                                <FileCheck className="w-8 h-8 text-brand-600" />
                              <span className="text-gray-900 font-bold text-sm">Prontuário Gerado</span>
                            </div>
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: i * 0.2 + 1, duration: 0.5 }}
                                className="h-2 bg-gradient-to-r from-brand-200 to-brand-300 rounded-full"
                                style={{ width: `${100 - i * 15}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Card3D>
              </div>
            </motion.div>

            {/* Price Box Premium */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <Card3D className="relative group">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                
                <div className="relative bg-gradient-to-br from-gray-900/95 via-brand-900/20 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border-2 border-brand-500/50 shadow-2xl">
                  
                  {/* Badge de desconto */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <motion.div
                      animate={{ rotate: [-3, 3, -3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg"
                    >
                      92% de desconto • Apenas hoje
                    </motion.div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <p className="text-gray-400 text-lg line-through">De R$ 497,00</p>
                    
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-2xl text-gray-400">Por apenas</span>
                      <div className="relative">
                        <div className="absolute inset-0 bg-brand-400 blur-2xl opacity-50" />
                        <span className="relative text-7xl md:text-8xl font-black bg-gradient-to-r from-brand-400 to-brand-400 bg-clip-text text-transparent">
                          R$ 37
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-6 text-brand-400 text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>Pagamento único</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <InfinityIcon className="w-5 h-5" />
                        <span>Acesso vitalício</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        <span>Sem mensalidade</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group/btn relative w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full blur-xl opacity-75 group-hover/btn:opacity-100 transition-opacity" />
                      <Link
                        href="#beneficios"
                        className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl"
                      >
                        <Rocket className="w-6 h-6" />
                        <span>QUERO COMEÇAR AGORA</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ArrowRight className="w-6 h-6" />
                        </motion.div>
                      </Link>
                    </motion.button>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-400" />
                        <span>Instalação em 10 minutos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-brand-400" />
                        <span>Funciona offline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CHECKPOINTS SECTION */}
      <section id="beneficios" className="relative py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-12 h-12 text-brand-400" />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-brand-400 bg-clip-text text-transparent">
                O que você vai conseguir fazer
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Transforme sua prática médica com tecnologia de ponta
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Gravação com 1 Toque no iPhone",
                description: "Sistema gratuito que funciona sem aplicativo adicional. Basta apertar REC e conversar normalmente.",
                gradient: "from-brand-500 to-brand-600",
              },
              {
                icon: Brain,
                title: "IA Organiza Tudo Automaticamente",
                description: "A inteligência artificial transforma sua conversa em prontuário estruturado, técnico e completo.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Clock,
                title: "Economize 2-3 Horas por Dia",
                description: "Elimine a digitação manual e recupere tempo precioso para atender mais pacientes ou descansar.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: FileCheck,
                title: "Prontuários Perfeitos e Padronizados",
                description: "Documentação técnica, organizada e profissional em todos os atendimentos.",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: Shield,
                title: "100% Seguro e Ético",
                description: "Método aprovado para uso médico. Você mantém controle total sobre os dados.",
                gradient: "from-brand-600 to-brand-500",
              },
              {
                icon: Zap,
                title: "Funciona Mesmo Sem Conhecimento Técnico",
                description: "Se você sabe usar WhatsApp, você consegue usar o Gravador Médico. Zero complicação.",
                gradient: "from-yellow-500 to-orange-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card3D className="h-full group">
                  <div className="relative h-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-brand-500/50 transition-all duration-500 overflow-hidden">
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Floating icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative mb-6"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur-xl opacity-50`} />
                      <div className={`relative bg-gradient-to-br ${item.gradient} p-4 rounded-2xl shadow-2xl`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-500/20 to-transparent rounded-bl-3xl" />
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* COMO FUNCIONA - Ilustração 3D */}
      <section id="como-funciona" className="relative py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-400 to-brand-400 bg-clip-text text-transparent">
                Como Funciona
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Linha conectora animada */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent hidden lg:block" />
            
            <div className="grid lg:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  icon: Mic,
                  number: "01",
                  title: "Grave com 1 Toque",
                  description: "Abra o app nativo do iPhone e aperte REC durante a consulta",
                },
                {
                  icon: Wand2,
                  number: "02",
                  title: "IA Processa Automaticamente",
                  description: "Nossa inteligência artificial transcreve e organiza tudo em segundos",
                },
                {
                  icon: Download,
                  number: "03",
                  title: "Baixe o Prontuário Pronto",
                  description: "Receba o documento completo, formatado e pronto para usar",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <Card3D className="group">
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 border-2 border-brand-500/30 hover:border-brand-500 transition-all duration-500">
                      
                      {/* Number badge */}
                      <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-2xl">
                        {step.number}
                      </div>

                      {/* Icon */}
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                        className="mb-8"
                      >
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-brand-500 rounded-2xl blur-2xl opacity-50" />
                          <div className="relative bg-gradient-to-br from-brand-400 to-brand-600 p-6 rounded-2xl">
                            <step.icon className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-transparent to-gray-950">
        <div className="container mx-auto max-w-7xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-brand-400 bg-clip-text text-transparent">
                Aplique esse conhecimento em...
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Clínica Geral", "Pediatria", "Cardiologia", "Dermatologia",
              "Psiquiatria", "Ortopedia", "Ginecologia", "Neurologia",
              "Endocrinologia", "Urologia", "Oftalmologia", "Gastroenterologia",
              "Pneumologia", "Reumatologia", "Nefrologia", "Oncologia",
            ].map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700/50 group-hover:border-brand-500/50 transition-all text-center">
                  <p className="text-white font-semibold group-hover:text-brand-400 transition-colors">
                    {specialty}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-400 to-brand-400 bg-clip-text text-transparent">
                O que médicos estão dizendo
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dra. Mariana Silva",
                specialty: "Cardiologista • São Paulo",
                text: "Economizo 3 horas por dia que antes gastava digitando. Agora uso esse tempo para estudar e estar com minha família.",
                rating: 5,
              },
              {
                name: "Dr. Roberto Mendes",
                specialty: "Pediatra • Rio de Janeiro",
                text: "Meus prontuários ficaram muito mais completos e profissionais. A IA capta detalhes que eu esqueceria de anotar.",
                rating: 5,
              },
              {
                name: "Dra. Juliana Costa",
                specialty: "Psiquiatra • Brasília",
                text: "Consigo focar 100% no paciente durante a consulta. Não preciso mais ficar olhando para a tela do computador.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card3D className="h-full group">
                  <div className="relative h-full bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-brand-500/50 transition-all">
                    
                    {/* Quote icon */}
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <MessageSquare className="w-16 h-16 text-brand-400" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed mb-8 relative z-10">
                      "{testimonial.text}"
                    </p>

                    <div>
                      <p className="text-white font-bold text-lg">{testimonial.name}</p>
                      <p className="text-brand-400 text-sm">{testimonial.specialty}</p>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* BÔNUS */}
  <section id="bonus" className="relative py-32 px-4 bg-gradient-to-b from-transparent to-brand-950/20">
        <div className="container mx-auto max-w-7xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Gift className="w-16 h-16 text-yellow-400" />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Bônus Exclusivos
              </span>
            </h2>
            <p className="text-xl text-gray-400">Além do sistema completo, você também recebe:</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Prontuários com Seu Nome",
                description: "Todos os documentos gerados já vêm com seu nome e CRM configurados",
                value: "R$ 97",
              },
              {
                icon: Video,
                title: "Uso Além da Consulta",
                description: "Crie relatórios, resumos de artigos, e-mails profissionais e muito mais",
                value: "R$ 147",
              },
              {
                icon: Lock,
                title: "Backup Profissional",
                description: "Sistema de backup automático para nunca perder nenhum prontuário",
                value: "R$ 197",
              },
            ].map((bonus, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card3D className="h-full group">
                  <div className="relative h-full bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl rounded-2xl p-8 border-2 border-yellow-500/30 hover:border-yellow-500 transition-all overflow-hidden">
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity" />

                    {/* Bonus badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Bônus {index + 1}
                    </div>

                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="mb-6"
                    >
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-yellow-500 rounded-2xl blur-xl opacity-50" />
                        <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl">
                          <bonus.icon className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    <div className="mb-4">
                      <p className="text-yellow-400 text-3xl font-black mb-2">
                        {bonus.value}
                      </p>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {bonus.title}
                      </h3>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      {bonus.description}
                    </p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

          {/* Total value */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Card3D>
                  <div className="inline-block bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-brand-500/50">
                    <p className="text-gray-400 text-lg mb-2">Valor Total dos Bônus:</p>
                    <p className="text-5xl font-black text-yellow-400 line-through mb-4">R$ 441</p>
                    <p className="text-2xl text-brand-400 font-bold">GRÁTIS para você hoje!</p>
              </div>
            </Card3D>
          </motion.div>

        </div>
      </section>

      {/* GARANTIA */}
      <section id="garantia" className="relative py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card3D className="group">
              <div className="relative bg-gradient-to-br from-brand-900/30 to-brand-900/30 backdrop-blur-xl rounded-3xl p-12 border-2 border-brand-500/50 text-center overflow-hidden">
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 opacity-0 group-hover:opacity-10 transition-opacity" />

                {/* Shield icon */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative inline-block mb-8"
                >
                  <div className="absolute inset-0 bg-brand-500 rounded-full blur-3xl opacity-50" />
                  <div className="relative bg-gradient-to-br from-brand-400 to-brand-600 p-8 rounded-full">
                    <Shield className="w-20 h-20 text-white" />
                  </div>
                </motion.div>

                <h2 className="text-5xl md:text-6xl font-black mb-6">
                  <span className="bg-gradient-to-r from-brand-400 to-brand-400 bg-clip-text text-transparent">
                    Garantia de 7 Dias
                  </span>
                </h2>

                <p className="text-2xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
                  Experimente por 7 dias completos. Se não economizar pelo menos 2 horas por dia ou não ficar satisfeito por qualquer motivo, devolvemos 100% do seu dinheiro.
                </p>

                <div className="inline-block bg-brand-500/20 border border-brand-500/50 rounded-xl p-6">
                  <p className="text-brand-400 text-lg font-bold">
                    Sem perguntas. Sem burocracia. Sem complicação.
                  </p>
                </div>
              </div>
            </Card3D>
          </motion.div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-white to-brand-400 bg-clip-text text-transparent">
                Chegou a sua vez de trabalhar menos e viver mais
              </span>
            </h2>

            <Card3D className="group">
              <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-12 border-2 border-brand-500/50">
                
                <div className="space-y-8">
                  <div>
                    <p className="text-gray-400 text-lg line-through mb-2">De R$ 938</p>
                    <div className="flex items-baseline justify-center gap-4 mb-2 flex-wrap">
                      <span className="text-3xl text-gray-400">Por apenas</span>
                      <span className="text-6xl md:text-8xl font-black bg-gradient-to-r from-brand-400 to-brand-400 bg-clip-text text-transparent">
                        R$ 37
                      </span>
                    </div>
                    <p className="text-brand-400 font-semibold text-xl">
                      Sistema Completo + 3 Bônus Exclusivos
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-full group/button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full blur-2xl opacity-75 group-hover/button:opacity-100 transition-opacity" />
                    <Link
                      href="/dashboard"
                      className="relative flex items-center justify-center gap-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 md:px-12 py-6 md:py-8 rounded-full text-xl md:text-3xl font-black shadow-2xl flex-wrap"
                    >
                      <Rocket className="w-6 md:w-8 h-6 md:h-8" />
                      <span className="text-center">SIM, EU QUERO TRANSFORMAR MINHA PRÁTICA</span>
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-6 md:w-8 h-6 md:h-8" />
                      </motion.div>
                    </Link>
                  </motion.button>

                  <div className="space-y-4">
                    {[
                      "✓ Acesso imediato após o pagamento",
                      "✓ Instalação guiada passo a passo",
                      "✓ Suporte prioritário por 30 dias",
                      "✓ Garantia incondicional de 7 dias",
                    ].map((item, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="text-gray-300 text-lg flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5 text-brand-400 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.p>
                    ))}
                  </div>
                </div>
              </div>
            </Card3D>

            <p className="text-gray-500 text-sm">
              Pagamento seguro processado por Mercado Pago • Seus dados estão protegidos
            </p>
          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500 rounded-xl blur-lg opacity-50" />
                <div className="relative bg-gradient-to-br from-brand-400 to-brand-600 p-3 rounded-xl">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-brand-400 to-brand-400 bg-clip-text text-transparent">
                Gravador Médico
              </span>
            </div>
            
            <p className="text-gray-400 max-w-2xl mx-auto">
              Revolucione sua prática médica com inteligência artificial. Economize tempo, melhore a qualidade dos seus prontuários e foque no que realmente importa: seus pacientes.
            </p>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 flex-wrap">
              <a href="#" className="hover:text-brand-400 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-brand-400 transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-brand-400 transition-colors">Contato</a>
            </div>

            <p className="text-gray-600 text-sm">
              © 2026 Gravador Médico. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
