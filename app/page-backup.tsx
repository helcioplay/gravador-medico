"use client"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
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
  Instagram,
  Video,
  ArrowRight,
  Check,
  X,
  Menu,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1])

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER STICKY */}
      <motion.header
        style={{ 
          backgroundColor: useTransform(scrollY, [0, 100], ["rgba(255,255,255,0)", "rgba(255,255,255,0.95)"]),
          boxShadow: useTransform(scrollY, [0, 100], ["none", "0 4px 6px -1px rgba(0,0,0,0.1)"])
        }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <Smartphone className="w-8 h-8 text-brand-600" />
            <span className="text-xl font-black text-gray-900">Gravador Médico</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#beneficios" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Benefícios</a>
            <a href="#como-funciona" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Como Funciona</a>
            <a href="#bonus" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Bônus</a>
            <a href="#garantia" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Garantia</a>
          </nav>

          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full font-bold hover:bg-brand-700 transition-colors"
          >
            Começar Agora
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <Menu className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </motion.header>

      {/* PRIMEIRA DOBRA - HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-20 overflow-hidden">
  {/* Background com gradiente sutil */}
  <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-white" />
        
        {/* Grid decorativo */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            
            {/* 1. HEADLINE - Promessa Principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-tight px-4">
                Grave com 1 Toque,<br />
                Gere Prontuários Automáticos<br />
                <span className="text-brand-600">e Pare de Perder Tempo Digitando</span>
              </h1>
            </motion.div>

            {/* 2. SUB-HEADLINE - Reforço da Promessa */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-base sm:text-lg md:text-xl lg:text-2xl lg:text-3xl text-gray-700 max-w-4xl mx-auto font-medium px-4"
            >
              Seu celular é a porta de entrada para prontuários perfeitos sem digitar uma palavra
            </motion.p>

            {/* 3. ILUSTRAÇÃO DO PRODUTO - Mockup Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="my-8 md:my-12 px-4"
            >
              <div className="bg-gradient-to-br from-brand-600 to-brand-600 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-white/20">
                  <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
                    <Smartphone className="w-10 h-10 md:w-16 md:h-16 text-white" />
                    <ArrowRight className="w-8 h-8 md:w-12 md:h-12 text-white" />
                    <FileCheck className="w-10 h-10 md:w-16 md:h-16 text-white" />
                  </div>
                  <p className="text-white text-sm md:text-xl font-semibold text-center">
                    [MOCKUP: iPhone gravando → Prontuário gerado automaticamente]
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6 px-4"
            >
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl max-w-2xl mx-auto border-4 border-brand-600">
                <p className="text-gray-600 text-base md:text-lg line-through mb-2">De R$ 497,00</p>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-lg md:text-2xl text-gray-600">Por apenas</span>
                  <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-brand-600">R$ 37</span>
                </div>
                <p className="text-gray-600 text-sm md:text-lg font-semibold mb-6">Pagamento único • Acesso vitalício • Sem mensalidade</p>
                
                <Link
                  href="#checkpoints"
                  className="group inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-brand-600 to-brand-600 text-white px-6 sm:px-8 md:px-12 py-4 md:py-6 rounded-full text-base sm:text-lg md:text-2xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 w-full"
                >
                  <span className="text-center leading-tight">QUERO COMEÇAR AGORA</span>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>
                
                <p className="text-gray-500 text-xs md:text-sm mt-4">✓ Instalação em 10 minutos • ✓ Funciona offline</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SEGUNDA DOBRA - CHECKPOINTS */}
      <section id="checkpoints" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          
          {/* 5. CHECKPOINTS - 5 a 7 Resultados Finais */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 px-4"
          >
            <h2 className="text-3xl sm:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 md:mb-6">
              O que você vai conseguir fazer:
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16 px-4">
            {[
              {
                icon: Smartphone,
                title: "Gravação com 1 Toque no iPhone",
                description: "Sistema gratuito que funciona sem aplicativo adicional. Basta apertar REC e conversar normalmente.",
              },
              {
                icon: Brain,
                title: "IA Organiza Tudo Automaticamente",
                description: "A inteligência artificial transforma sua conversa em prontuário estruturado, técnico e completo.",
              },
              {
                icon: Clock,
                title: "Economize 2-3 Horas por Dia",
                description: "Elimine a digitação manual e recupere tempo precioso para atender mais pacientes ou descansar.",
              },
              {
                icon: FileCheck,
                title: "Prontuários Perfeitos e Padronizados",
                description: "Documentação técnica, organizada e profissional em todos os atendimentos.",
              },
              {
                icon: Shield,
                title: "100% Seguro e Ético",
                description: "Método aprovado para uso médico. Você mantém controle total sobre os dados.",
              },
              {
                icon: Zap,
                title: "Funciona Mesmo Sem Conhecimento Técnico",
                description: "Se você sabe usar WhatsApp, você consegue usar o Gravador Médico. Zero complicação.",
              },
            ].map((checkpoint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-brand-100"
              >
                <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br from-brand-600 to-brand-600 flex items-center justify-center flex-shrink-0">
                    <checkpoint.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">{checkpoint.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{checkpoint.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 6. ILUSTRAÇÃO DO PRODUTO - Novamente */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-brand-800 to-brand-900 rounded-3xl p-12 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 border-2 border-white/20">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <Smartphone className="w-20 h-20 text-white mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">1. Grave com<br />1 Toque</p>
                  </div>
                  <div>
                    <Brain className="w-20 h-20 text-white mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">2. IA Processa<br />Automaticamente</p>
                  </div>
                  <div>
                    <FileCheck className="w-20 h-20 text-white mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">3. Receba Prontuário<br />Completo</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* TERCEIRA DOBRA - COMO SERÁ A ENTREGA */}
      <section id="como-funciona" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          
          {/* 7. COMO SERÁ A ENTREGA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Como Você Vai Receber o Método
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passo a passo em <span className="font-bold text-brand-600">videoaulas + PDF + modelos prontos</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Video,
                title: "Videoaulas Práticas",
                description: "Tutoriais em vídeo mostrando exatamente como configurar e usar o método em minutos.",
              },
              {
                icon: FileCheck,
                title: "Modelos de Prontuário",
                description: "Templates prontos para copiar e colar. Adapte para sua especialidade em segundos.",
              },
              {
                icon: Brain,
                title: "Prompts de IA Testados",
                description: "Comandos exatos que fazem a IA gerar prontuários perfeitos e técnicos.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-gradient-to-br from-brand-50 to-brand-50 rounded-2xl p-8 text-center border-2 border-brand-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* QUEBRA DE OBJEÇÃO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-10 md:p-12 text-center border-2 border-amber-200"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">
              Mesmo que você não saiba NADA de tecnologia,<br />você vai conseguir aplicar
            </h3>
            <p className="text-xl text-gray-700 leading-relaxed">
              Se você consegue gravar um áudio no WhatsApp e copiar um texto,<br />
              você consegue usar o Gravador Médico. É <span className="font-bold text-amber-600">simples assim</span>.
            </p>
          </motion.div>

        </div>
      </section>

      {/* 8. APLIQUE ESSE CONHECIMENTO EM... */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Aplique em Qualquer Especialidade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              O método funciona para todos os profissionais de saúde que precisam documentar atendimentos
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-10 md:p-12 shadow-2xl"
          >
            <div className="grid md:grid-cols-4 gap-6 text-center">
              {[
                "Clínica Geral",
                "Pediatria",
                "Cardiologia",
                "Dermatologia",
                "Psiquiatria",
                "Ortopedia",
                "Ginecologia",
                "Endocrinologia",
                "Neurologia",
                "Fisioterapia",
                "Nutrição",
                "Odontologia",
                "Psicologia",
                "Enfermagem",
                "Fonoaudiologia",
                "Medicina Ocupacional",
              ].map((specialty, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-gradient-to-br from-brand-50 to-brand-50 rounded-xl p-4 border border-brand-100"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <span className="text-gray-900 font-semibold">{specialty}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-lg text-gray-600">
                <span className="font-bold text-gray-900">E muito mais...</span> O método se adapta à sua forma de trabalhar!
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 9. DEPOIMENTOS */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              O que médicos relatam após aplicar o método
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Economizo 2 horas por dia que antes gastava digitando. Agora consigo atender mais pacientes sem me estressar.",
                author: "Dra. Ana Paula",
                specialty: "Dermatologista",
              },
              {
                quote: "A parte de copiar/colar o modelo foi genial. Nunca mais esqueço de perguntar algo importante na anamnese.",
                author: "Dr. Carlos Eduardo",
                specialty: "Clínico Geral",
              },
              {
                quote: "Achei que ia ser complicado, mas em 10 minutos já estava funcionando. Valeu muito cada centavo.",
                author: "Dra. Mariana Costa",
                specialty: "Pediatra",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100"
              >
                <div className="mb-6">
                  <svg className="w-10 h-10 text-brand-600 opacity-40" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h8V14h-4c0-2.2 1.8-4 4-4V8z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-brand-600 text-sm">{testimonial.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. BÔNUS - Apresentação Detalhada */}
      <section id="bonus" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Tudo o que você precisa para um Consultório Inteligente
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Além do método principal, você recebe 3 bônus exclusivos para maximizar seus resultados
            </p>
          </motion.div>

          <div className="space-y-6 mb-12">
            {[
              {
                title: "Prontuários com Seu Nome",
                subtitle: "(Bônus Exclusivo)",
                description: "Automação para inserir Nome, CRM e Clínica no cabeçalho do documento. Configure seus dados uma única vez e todos os prontuários gerados incluirão suas informações automaticamente.",
                icon: FileCheck,
              },
              {
                title: "Uso Além da Consulta",
                subtitle: "(Bônus Produtividade)",
                description: "Transcreva e organize reuniões, aulas, congressos e áudios longos com o mesmo processo. Aplique o poder do Gravador Médico em palestras, áudios de WhatsApp e muito mais.",
                icon: Brain,
              },
              {
                title: "Backup Profissional",
                subtitle: "(Bônus Segurança)",
                description: "Estrutura recomendada para organizar seus materiais em pastas e manter o fluxo consistente. Tutorial completo para estruturar seu Google Drive com pastas automáticas por paciente.",
                icon: Shield,
              },
            ].map((bonus, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-brand-100 hover:border-brand-300 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <bonus.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{bonus.title}</h3>
                      <p className="text-brand-600 font-semibold text-sm mt-1">{bonus.subtitle}</p>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">{bonus.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. GARANTIA - Bater Forte! */}
      <section id="garantia" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-brand-800 to-brand-900 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
          >
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                <Shield className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-6">
                Garantia Incondicional de 7 Dias
              </h2>
              
              <div className="w-24 h-1 bg-white/30 mx-auto mb-8" />
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
                Implemente o método. Grave suas consultas. Gere seus prontuários.
              </p>
              
              <p className="text-2xl md:text-3xl font-bold mb-8">
                Se em 7 dias você não economizar <span className="text-amber-400">pelo menos 1 hora por dia</span>, 
                devolvemos 100% do seu dinheiro.
              </p>
              
              <p className="text-lg md:text-xl text-white/80">
                Sem perguntas. Sem burocracia. <span className="font-bold">Você não corre nenhum risco.</span>
              </p>

              <div className="mt-10 pt-10 border-t border-white/20">
                <p className="text-white/90 text-lg mb-6">
                  É só enviar um email e devolvemos seu dinheiro imediatamente.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 12. BOTÃO DE COMPRA FINAL + RECAPITULAÇÃO */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Chegou a Hora de Recuperar Seu Tempo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Junte-se a centenas de médicos que já eliminaram a digitação manual e 
              voltaram a ter tempo para o que realmente importa
            </p>
          </div>

          {/* Box de Resumo da Oferta */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gray-200 mb-8"
          >
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <span className="font-semibold text-gray-900 text-lg">Método Gravador Médico Completo</span>
                <span className="font-bold text-gray-900 text-lg">R$ 37</span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <span className="text-gray-600">+ Prontuários com Seu Nome</span>
                  <span className="ml-2 text-xs text-brand-600 font-semibold">(Bônus Exclusivo)</span>
                </div>
                <span className="text-brand-600 font-bold">INCLUSO</span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <span className="text-gray-600">+ Uso Além da Consulta</span>
                  <span className="ml-2 text-xs text-brand-600 font-semibold">(Bônus Produtividade)</span>
                </div>
                <span className="text-brand-600 font-bold">INCLUSO</span>
              </div>
              <div className="flex items-center justify-between py-4 border-b-2 border-gray-300">
                <div>
                  <span className="text-gray-600">+ Backup Profissional</span>
                  <span className="ml-2 text-xs text-brand-600 font-semibold">(Bônus Segurança)</span>
                </div>
                <span className="text-brand-600 font-bold">INCLUSO</span>
              </div>
              <div className="flex items-center justify-between pt-6">
                <span className="text-3xl font-black text-gray-900">INVESTIMENTO TOTAL:</span>
                <div className="text-right">
                  <div className="text-gray-400 line-through text-xl mb-1">R$ 497</div>
                  <div className="text-5xl font-black text-brand-600">R$ 37</div>
                </div>
              </div>
            </div>

            <Link
              href="#checkout"
              className="w-full group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-600 to-brand-600 text-white px-6 sm:px-8 md:px-12 py-4 md:py-6 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-2xl hover:shadow-brand-500/50 transition-all hover:scale-105"
            >
              <span>BAIXAR O MÉTODO AGORA</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-center text-gray-500 mt-6">
              ✓ Acesso imediato por email • ✓ Pagamento único • ✓ Garantia de 7 dias
            </p>
          </motion.div>

          {/* Badge de Urgência/Escassez (opcional) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-6 py-3 rounded-full text-sm font-bold">
              <Clock className="w-4 h-4" />
              Oferta por tempo limitado • Acesso vitalício
            </div>
          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Smartphone className="w-8 h-8 text-brand-500" />
            <span className="text-2xl font-black">Gravador Médico</span>
          </div>
          <p className="text-gray-400 mb-8">
            Grave com 1 Toque • Gere Prontuários Automáticos • Recupere Seu Tempo
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>© 2026 Gravador Médico. Todos os direitos reservados.</p>
            <p>Contato: suporte@gravadormedico.com.br</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
