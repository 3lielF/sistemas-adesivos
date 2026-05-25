import React, { useState, useEffect } from 'react';
import { 
  Crosshair, ShieldAlert, Zap, Activity, Layers, Syringe, 
  Sparkles, FlaskConical, Target, Terminal, Swords, HeartPulse, Shield, Flame, PowerOff
} from 'lucide-react';

// Estilos de animação Arcade/HUD injetados no documento
const customStyles = `
  @keyframes shake-heavy {
    0%, 100% { transform: translateX(0) translateY(0); }
    20% { transform: translateX(-10px) translateY(5px); }
    40% { transform: translateX(10px) translateY(-5px); }
    60% { transform: translateX(-10px) translateY(-5px); }
    80% { transform: translateX(10px) translateY(5px); }
  }
  .animate-damage {
    animation: shake-heavy 0.3s cubic-bezier(.36,.07,.19,.97) both;
  }
  @keyframes float-up-fade {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
  }
  .animate-floating-text {
    animation: float-up-fade 1s ease-out forwards;
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  .scanline-effect::after {
    content: "";
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 10px;
    background: rgba(0, 255, 255, 0.1);
    opacity: 0.5;
    animation: scanline 8s linear infinite;
    pointer-events: none;
    z-index: 50;
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.5); }
    50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.9); }
  }
  .glow-box {
    animation: pulse-glow 2s infinite;
  }
  @keyframes type {
    from { width: 0; }
    to { width: 100%; }
  }
  .typing-effect {
    overflow: hidden;
    white-space: nowrap;
    animation: type 2s steps(40, end);
  }
`;

const gameData = [
  {
    id: 1,
    title: "NÍVEL 1: Molhamento Tático",
    icon: <Target className="w-8 h-8 text-cyan-400" />,
    narrative: "> ALVO: DENTE 16. O Sr. Silva perdeu a restauração. Precisamos criar uma nova interface perfeita. \n> INICIANDO SCAN FÍSICO DO SUBSTRATO...",
    question: "Qual configuração física garante que o adesivo (líquido) molhe perfeitamente a cavidade (sólido)?",
    options: [
      { text: "Alta tensão superficial do adesivo + Baixa energia de superfície do dente.", isCorrect: false },
      { text: "Alta energia de superfície do dente + Baixa tensão superficial do adesivo.", isCorrect: true },
      { text: "Anular ambas as energias para gerar vácuo e evitar bolhas.", isCorrect: false }
    ],
    explanation: "A energia de superfície (sólido) deve ser ALTA para atrair o líquido. A tensão superficial (líquido) deve ser BAIXA para ele escoar."
  },
  {
    id: 2,
    title: "NÍVEL 2: Desafio de Tecidos",
    icon: <Layers className="w-8 h-8 text-purple-400" />,
    narrative: "> SCAN CONCLUÍDO. A cavidade atinge esmalte e dentina profunda. CUIDADO: Terrenos com propriedades distintas.",
    question: "Taticamente, qual a principal diferença que afeta a ancoragem nestes dois tecidos?",
    options: [
      { text: "Esmalte é ~96% inorgânico e seco. Dentina possui muita matéria orgânica (colágeno) e fluidos.", isCorrect: true },
      { text: "A dentina é mais inorgânica que o esmalte, repelindo monômeros hidrofílicos.", isCorrect: false },
      { text: "Não há diferença tática. Ambos requerem a mesma hidroxiapatita artificial.", isCorrect: false }
    ],
    explanation: "O esmalte (96% mineral) aceita bem adesão micromecânica seca. A dentina (úmida e orgânica) exige o uso de primers hidrofílicos para lidar com a água."
  },
  {
    id: 3,
    title: "NÍVEL 3: Ataque Ácido (Esmalte)",
    icon: <Syringe className="w-8 h-8 text-rose-500" />,
    narrative: "> EQUIPANDO: ÁCIDO FOSFÓRICO 37%. \n> ALVO: MARGENS DE ESMALTE (15 a 30s).",
    question: "Qual o dano estrutural esperado que beneficia nossa missão de ancoragem?",
    options: [
      { text: "Criação de escudo de cálcio sobre os prismas.", isCorrect: false },
      { text: "Dissolução seletiva dos prismas, gerando microporosidades para formação de 'tags' resinosos.", isCorrect: true },
      { text: "Clareamento interno do tecido para camuflagem óptica da resina.", isCorrect: false }
    ],
    explanation: "O ataque ácido gera um padrão de microporosidades (como favo de mel). A resina flui para dentro, polimeriza e cria retenção micromecânica."
  },
  {
    id: 4,
    title: "NÍVEL 4: Barreira Inimiga (Smear Layer)",
    icon: <ShieldAlert className="w-8 h-8 text-orange-400" />,
    narrative: "> ALERTA: A broca deixou detritos. LAMA DENTINÁRIA DETECTADA. \n> ESTRATÉGIA: SISTEMA CONVENCIONAL DE 3 PASSOS.",
    question: "Como o ataque ácido convencional neutraliza a Smear Layer e prepara a dentina?",
    options: [
      { text: "Funde a Smear Layer à dentina, endurecendo o assoalho.", isCorrect: false },
      { text: "Destrói a Smear Layer, abre os túbulos e remove minerais, expondo a rede de colágeno.", isCorrect: true },
      { text: "Desvia da Smear Layer, atacando apenas bactérias infiltradas.", isCorrect: false }
    ],
    explanation: "O ataque ácido total (etch-and-rinse) dissolve a smear layer e desmineraliza a dentina superficial, destravando a rede de colágeno."
  },
  {
    id: 5,
    title: "NÍVEL 5: Formação da Aliança (Hibridização)",
    icon: <FlaskConical className="w-8 h-8 text-indigo-400" />,
    narrative: "> COLÁGENO EXPOSTO. \n> APLICANDO: PRIMER E ADESIVO.",
    question: "Como estes dois agentes trabalham em equipe para formar a Camada Híbrida?",
    options: [
      { text: "Primer (Anfifílico) infiltra a umidade e expulsa a água. Adesivo (Hidrofóbico) entra na rede e copolimeriza.", isCorrect: true },
      { text: "Primer (Hidrofóbico) tranca os túbulos. Adesivo (Hidrofílico) puxa água da polpa para hidratar a resina.", isCorrect: false },
      { text: "Ambos cristalizam a dentina, transformando-a em esmalte artificial.", isCorrect: false }
    ],
    explanation: "O Primer compatibiliza a dentina úmida com a resina. O Adesivo entra nos espaços vazios da rede de colágeno. Juntos formam a Camada Híbrida."
  },
  {
    id: 6,
    title: "NÍVEL 6: Tática Autocondicionante",
    icon: <Zap className="w-8 h-8 text-teal-400" />,
    narrative: "> MUDANÇA DE CARGA: SISTEMA AUTOCONDICIONANTE SELECIONADO. \n> ÁCIDO PRÉVIO NA DENTINA: CANCELADO.",
    question: "Como essa tática lida com a Barreira da Smear Layer de forma diferente?",
    options: [
      { text: "Vaporiza a Smear Layer com luz halógena.", isCorrect: false },
      { text: "Possui monômeros ácidos que infiltram, não são lavados, e incorporam a Smear Layer na camada híbrida.", isCorrect: true },
      { text: "Aplica ácido três vezes seguidas para derreter a lama.", isCorrect: false }
    ],
    explanation: "Autocondicionantes (Self-Etch) desmineralizam e infiltram ao mesmo tempo. Não lavamos a cavidade. A smear layer vira parte da adesão, diminuindo chance de colágeno solto."
  },
  {
    id: 7,
    title: "NÍVEL 7: O Ponto Fraco",
    icon: <Crosshair className="w-8 h-8 text-pink-400" />,
    narrative: "> ALERTA: O SISTEMA AUTOCONDICIONANTE/UNIVERSAL É FRACO CONTRA ESMALTE INTACTO.",
    question: "Qual manobra tática você deve executar para contornar essa fraqueza?",
    options: [
      { text: "Evitar tocar o esmalte com qualquer material.", isCorrect: false },
      { text: "Técnica do Condicionamento Seletivo: Atacar apenas o esmalte com ácido fosfórico prévio.", isCorrect: true },
      { text: "Aquecer a seringa a 50°C para aumentar a acidez do Universal.", isCorrect: false }
    ],
    explanation: "Como Universais/Self-Etch têm pH brando, eles falham no esmalte. O 'Condicionamento Seletivo' (só no esmalte) garante selamento marginal de excelência."
  },
  {
    id: 8,
    title: "NÍVEL 8: Power-Up Químico (10-MDP)",
    icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
    narrative: "> ITEM RARO EQUIPADO: MONÔMERO 10-MDP. \n> INICIANDO PROTOCOLO DE 'NANO-LAYERING'.",
    question: "Qual o poder especial deste monômero na interface de adesão?",
    options: [
      { text: "Congela a resina na luz LED instantaneamente.", isCorrect: false },
      { text: "Desliga a sensibilidade dos nervos pulpares.", isCorrect: false },
      { text: "Cria ligação química primária (Sais de Cálcio-MDP) com o cálcio que o sistema brando não destruiu, blindando contra a água.", isCorrect: true }
    ],
    explanation: "O 10-MDP faz adesão química direta com o cálcio. Como sistemas universais preservam parte do cálcio da dentina, o MDP se liga a ele formando uma barreira insolúvel fortíssima."
  },
  {
    id: 9,
    title: "NÍVEL 9: Estratégia de Inserção",
    icon: <Activity className="w-8 h-8 text-emerald-400" />,
    narrative: "> ADESÃO: 100%. \n> INICIANDO FASE RESTAURADORA. PERIGO: FORÇAS DE CONTRAÇÃO DE POLIMERIZAÇÃO (FATOR C).",
    question: "Como depositar a resina para evitar que ela encolha e 'arranque' seu adesivo da parede?",
    options: [
      { text: "Inserção em técnica monobloco (tudo de uma vez) para contrair uniformemente.", isCorrect: false },
      { text: "Técnica Incremental (pequenos incrementos oblíquos) e fotoativação controlada para reduzir estresse.", isCorrect: true },
      { text: "Misturar o adesivo com a massa da resina e injetar.", isCorrect: false }
    ],
    explanation: "Toda resina encolhe ao polimerizar. Inserir em pequenos incrementos diminui a tensão nas paredes cavitárias (reduz as forças do Fator C), preservando o selamento."
  },
  {
    id: 10,
    title: "CHEFE FINAL: As Enzimas MMPs",
    icon: <Swords className="w-10 h-10 text-red-500 animate-pulse" />,
    narrative: "> ALERTA MÁXIMO! INIMIGO ENDÓGENO DETECTADO NA BASE DA CAMADA HÍBRIDA! \n> ENZIMAS ACORDARAM COM O ÁCIDO.",
    question: "Se a sua resina não englobou todas as fibras de colágeno, qual o golpe letal desferido pelas Metaloproteinases (MMPs) e Catepsinas com o tempo?",
    options: [
      { text: "Elas oxidam a resina, deixando o dente cinza e frágil.", isCorrect: false },
      { text: "Elas atacam as bactérias, porém destroem a polpa no processo.", isCorrect: false },
      { text: "Elas realizam hidrólise (degradação/quebra) das fibras de colágeno expostas, soltando a restauração ao longo dos anos.", isCorrect: true }
    ],
    explanation: "O ácido ativa as MMPs da própria dentina. Se o colágeno desmineralizado não for totalmente envolvido/protegido pela resina adesiva, as MMPs quebram esse colágeno (hidrólise), causando a falha tardia da restauração."
  }
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [integrity, setIntegrity] = useState(0);
  const [attemptsCurrentPhase, setAttemptsCurrentPhase] = useState(0);
  
  // Efeitos visuais
  const [screenDamage, setScreenDamage] = useState(false);
  const [floatingText, setFloatingText] = useState(null); // { text, color, key }
  const [feedback, setFeedback] = useState(null); // null, 'success', 'error'
  const [shakingOption, setShakingOption] = useState(null);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const phaseIndex = currentStep - 1;
  const currentPhase = gameData[phaseIndex];
  const maxPhases = gameData.length;

  const triggerFloatingText = (text, color) => {
    setFloatingText({ text, color, key: Date.now() });
    setTimeout(() => setFloatingText(null), 1000);
  };

  const handleStart = () => {
    setCurrentStep(1);
    setXp(0);
    setStreak(0);
    setMultiplier(1);
    setIntegrity(0);
    setFeedback(null);
  };

  const handleAnswer = (option, idx) => {
    if (feedback === 'success') return;

    if (option.isCorrect) {
      // Cálculo Arcade: Base 100 * multiplicador - penalidades
      const basePoints = 100;
      const penalty = attemptsCurrentPhase * 50;
      const earnedXp = Math.max(10, (basePoints * multiplier) - penalty);
      
      setXp(prev => prev + earnedXp);
      setStreak(prev => prev + 1);
      
      // Aumenta multiplicador a cada 3 acertos seguidos
      if ((streak + 1) % 3 === 0 && multiplier < 4) {
        setMultiplier(prev => prev + 1);
        triggerFloatingText("COMBO UP! MULTIPLIER TÁ ON!", "text-purple-400");
      } else {
        triggerFloatingText(`CRITICAL HIT! +${earnedXp}XP`, "text-cyan-400");
      }
      
      const qualityBoost = attemptsCurrentPhase === 0 ? 10 : (attemptsCurrentPhase === 1 ? 5 : 2);
      setIntegrity(prev => Math.min(100, prev + qualityBoost));
      
      setFeedback('success');
    } else {
      // Erro = Dano
      setAttemptsCurrentPhase(prev => prev + 1);
      setFeedback('error');
      setStreak(0);
      setMultiplier(1);
      
      setScreenDamage(true);
      setTimeout(() => setScreenDamage(false), 300);
      
      setShakingOption(idx);
      setTimeout(() => setShakingOption(null), 400);
      
      triggerFloatingText("MISS! COMBO BROKEN!", "text-red-500");
    }
  };

  const nextPhase = () => {
    setFeedback(null);
    setAttemptsCurrentPhase(0);
    setCurrentStep(prev => prev + 1);
  };

  const getRank = () => {
    if (integrity >= 95 && xp >= 2500) return { rank: "S", title: "Lenda da Hibridização", desc: "Perfeição tática. Suas restaurações resistirão a décadas de forças mastigatórias.", color: "text-yellow-400", bg: "bg-yellow-400/20", border: "border-yellow-400" };
    if (integrity >= 80) return { rank: "A", title: "Operador Clínico de Elite", desc: "Excelente domínio bioquímico. A interface adesiva está altamente selada.", color: "text-cyan-400", bg: "bg-cyan-400/20", border: "border-cyan-400" };
    if (integrity >= 60) return { rank: "B", title: "Combatente Convencional", desc: "Missão cumprida com sucesso, mas a longo prazo as MMPs podem achar brechas.", color: "text-green-400", bg: "bg-green-400/20", border: "border-green-400" };
    return { rank: "C", title: "Recruta do Ácido Fosfórico", desc: "Integridade estrutural comprometida. Retorne ao simulador e estude os manuais (slides).", color: "text-orange-500", bg: "bg-orange-500/20", border: "border-orange-500" };
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 font-mono overflow-x-hidden selection:bg-cyan-500/30 scanline-effect transition-colors duration-200 ${screenDamage ? 'bg-red-950 animate-damage' : ''}`}>
      
      {/* HUD HEADER */}
      <div className="fixed top-0 w-full z-40 bg-slate-900/90 backdrop-blur-md border-b border-cyan-500/30 p-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex justify-between items-center text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="font-bold tracking-widest text-cyan-400 hidden sm:inline">HUD CLINICAL O.S.</span>
        </div>
        
        {currentStep > 0 && currentStep <= maxPhases && (
          <div className="flex flex-1 mx-4 max-w-md items-center gap-3">
            <HeartPulse className={`w-5 h-5 ${integrity > 30 ? 'text-green-400' : 'text-red-500 animate-pulse'}`} />
            <div className="w-full h-3 bg-slate-800 rounded-sm border border-slate-700 overflow-hidden relative">
              <div 
                className={`h-full transition-all duration-500 ${integrity > 70 ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : integrity > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${integrity}%` }}
              />
            </div>
            <span className="font-bold w-12 text-right">{integrity}%</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          {streak > 2 && (
            <div className="flex items-center gap-1 text-purple-400 animate-pulse font-bold">
              <Flame className="w-4 h-4" /> x{multiplier}
            </div>
          )}
          <div className="bg-slate-800 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-bold tracking-widest">
            {xp.toString().padStart(5, '0')} XP
          </div>
          
          {currentStep > 0 && currentStep <= maxPhases && (
            <button 
              onClick={() => setCurrentStep(0)}
              className="bg-red-950/50 hover:bg-red-900 border border-red-500/50 text-red-400 p-1.5 md:px-3 md:py-1 rounded transition-all flex items-center gap-2 group ml-2"
              title="Abortar Missão"
            >
              <PowerOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline font-bold tracking-widest text-[10px] md:text-xs">ABORTAR</span>
            </button>
          )}
        </div>
      </div>

      {/* FLOATING TEXT OVERLAY */}
      {floatingText && (
        <div key={floatingText.key} className={`fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-2xl md:text-4xl font-black pointer-events-none drop-shadow-[0_0_10px_rgba(0,0,0,1)] animate-floating-text ${floatingText.color}`}>
          {floatingText.text}
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4 relative z-10">
        
        {/* START SCREEN */}
        {currentStep === 0 && (
          <div className="border border-cyan-500/50 bg-slate-900/80 p-8 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
            
            <div className="flex justify-center mb-6">
              <div className="glow-box p-6 bg-slate-800 border-2 border-cyan-400 rounded-full">
                <Terminal className="w-16 h-16 text-cyan-400" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-center text-white mb-2 tracking-tight">OPERAÇÃO: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ADESÃO TOTAL</span></h1>
            <h2 className="text-center text-cyan-500 font-bold tracking-widest mb-8 text-sm md:text-base">SIMULADOR CLÍNICO DE ALTA PRECISÃO</h2>
            
            <div className="bg-black/50 border-l-4 border-cyan-500 p-6 rounded mb-10 font-mono text-sm md:text-base text-cyan-100">
              <p className="typing-effect mb-2">{">"} CONEXÃO ESTABELECIDA...</p>
              <p className="typing-effect mb-2" style={{animationDelay: '0.5s'}}>{">"} PACIENTE: SR. SILVA. DENTE 16 COMPROMETIDO.</p>
              <p className="typing-effect mb-4" style={{animationDelay: '1s'}}>{">"} MISSÃO: RESTAURAR E SELAR A INTERFACE COM 100% DE SUCESSO.</p>
              
              <ul className="space-y-2 mt-4 border-t border-cyan-900 pt-4 text-slate-300">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-400"/> Sobreviva a 10 Estágios Táticos Baseados no Protocolo Adesivo.</li>
                <li className="flex items-center gap-2"><Flame className="w-4 h-4 text-purple-400"/> Acerte em sequência para ativar o Multiplicador de XP.</li>
                <li className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-500"/> Erros reduzem a integridade final da Camada Híbrida.</li>
              </ul>
            </div>
            
            <div className="text-center">
              <button 
                onClick={handleStart}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-cyan-600 border border-cyan-400 hover:bg-cyan-500 transition-all uppercase tracking-widest overflow-hidden"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative flex items-center gap-2">INICIAR SIMULAÇÃO <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform" /></span>
              </button>
            </div>
          </div>
        )}

        {/* GAME PHASE SCREEN */}
        {currentStep > 0 && currentStep <= maxPhases && (
          <div className="space-y-6">
            
            {/* Phase Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-3">
                {currentPhase.icon}
                <h2 className="text-xl md:text-2xl font-black tracking-widest text-white uppercase shadow-cyan-500/50 drop-shadow-md">
                  {currentPhase.title}
                </h2>
              </div>
              <span className="text-slate-500 font-bold tracking-widest">
                {currentStep.toString().padStart(2, '0')} / {maxPhases.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Narrative Box */}
            <div className="bg-slate-800/80 border border-slate-600 p-5 rounded-sm shadow-inner relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <p className="whitespace-pre-line text-cyan-200 font-mono text-sm md:text-base leading-relaxed">
                {currentPhase.narrative}
              </p>
            </div>

            {/* Question */}
            <div className="py-4">
              <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                {currentPhase.question}
              </h3>
            </div>

            {/* Options Grid */}
            <div className="grid gap-4">
              {currentPhase.options.map((option, idx) => {
                const isSuccessPhase = feedback === 'success';
                const isCorrectAnswer = option.isCorrect;
                const isSelectedError = feedback === 'error' && shakingOption === idx;
                const isFadedError = isSuccessPhase && !isCorrectAnswer;

                return (
                  <button
                    key={idx}
                    onClick={() => !isSuccessPhase && handleAnswer(option, idx)}
                    disabled={isSuccessPhase}
                    className={`text-left p-5 border transition-all duration-200 relative group
                      ${isSuccessPhase && isCorrectAnswer 
                        ? 'border-cyan-400 bg-cyan-900/40 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                        : ''}
                      ${isSelectedError 
                        ? 'border-red-500 bg-red-900/40 text-red-200 animate-shake' 
                        : ''}
                      ${!isSuccessPhase && !isSelectedError 
                        ? 'border-slate-700 bg-slate-900 hover:border-cyan-500 hover:bg-slate-800 text-slate-300' 
                        : ''}
                      ${isFadedError ? 'opacity-30 border-slate-800 bg-slate-900' : ''}
                    `}
                  >
                    {/* Hover UI bracket effect */}
                    {!isSuccessPhase && !isSelectedError && (
                      <>
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-transparent group-hover:border-cyan-400 transition-colors"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-transparent group-hover:border-cyan-400 transition-colors"></div>
                      </>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 w-6 h-6 border flex items-center justify-center shrink-0 font-bold text-xs
                        ${isSuccessPhase && isCorrectAnswer ? 'border-cyan-400 text-cyan-400 bg-cyan-950' : 'border-slate-600'}
                        ${isSelectedError ? 'border-red-500 text-red-500 bg-red-950' : ''}
                      `}>
                        {isSuccessPhase && isCorrectAnswer ? 'OK' : idx + 1}
                      </div>
                      <span className="leading-relaxed font-sans font-medium">{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ERROR FEEDBACK */}
            {feedback === 'error' && (
              <div className="bg-red-950/80 border border-red-500/50 p-6 mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                <h4 className="font-black text-red-400 mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> AVISO DO SISTEMA: CORREÇÃO TÁTICA NECESSÁRIA
                </h4>
                <p className="text-red-200 font-sans leading-relaxed mb-4">{currentPhase.explanation}</p>
                <button 
                  onClick={() => setFeedback(null)}
                  className="bg-red-900/50 hover:bg-red-800 border border-red-500 text-red-100 px-6 py-2 uppercase tracking-widest text-sm font-bold transition-colors"
                >
                  Recalibrar e Tentar Novamente
                </button>
              </div>
            )}

            {/* SUCCESS FEEDBACK */}
            {feedback === 'success' && (
              <div className="bg-cyan-950/80 border border-cyan-500/50 p-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400"></div>
                <div className="flex-1">
                  <h4 className="font-black text-cyan-400 mb-2 flex items-center gap-2 tracking-widest">
                    <Target className="w-5 h-5" /> ALVO NEUTRALIZADO
                  </h4>
                  <p className="text-cyan-100 font-sans leading-relaxed text-sm md:text-base">{currentPhase.explanation}</p>
                </div>
                <button 
                  onClick={nextPhase}
                  className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-8 uppercase tracking-widest transition-all glow-box flex items-center justify-center gap-2 shrink-0 border border-cyan-300"
                >
                  {currentStep === maxPhases ? 'EXTRAIR RELATÓRIO' : 'PRÓXIMO ALVO'} 
                  <Crosshair className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* RESULTS SCREEN */}
        {currentStep > maxPhases && (() => {
          const { rank, title, desc, color, bg, border } = getRank();
          return (
            <div className={`border-2 ${border} bg-slate-900/90 p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
              <div className={`absolute top-0 left-0 w-full h-2 ${bg.replace('/20', '')}`}></div>
              
              <h2 className="text-2xl text-slate-400 font-bold tracking-widest mb-8">MISSÃO CONCLUÍDA</h2>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-10">
                {/* Score Stats */}
                <div className="text-left space-y-4 font-mono w-full md:w-1/2">
                  <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                    <span className="text-slate-400 text-sm">PONTUAÇÃO TOTAL:</span>
                    <span className="text-3xl font-black text-cyan-400">{xp}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                    <span className="text-slate-400 text-sm">INTEGRIDADE DA INTERFACE:</span>
                    <span className={`text-2xl font-black ${integrity >= 80 ? 'text-green-400' : 'text-orange-400'}`}>{integrity}%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                    <span className="text-slate-400 text-sm">AMEAÇA MMPs:</span>
                    <span className="text-lg font-bold text-slate-300">{integrity >= 80 ? 'NEUTRALIZADA' : 'POTENCIAL DE RISCO'}</span>
                  </div>
                </div>

                {/* Rank Badge */}
                <div className={`w-40 h-40 rounded-lg border-4 ${border} ${bg} flex flex-col items-center justify-center transform rotate-3 shadow-2xl`}>
                  <span className="text-xs font-bold tracking-widest text-slate-300 mb-1">RANK TÁTICO</span>
                  <span className={`text-7xl font-black ${color} drop-shadow-lg`}>{rank}</span>
                </div>
              </div>

              <div className="bg-black/40 border border-slate-700 p-6 mb-10 text-left">
                <h3 className={`text-xl font-black uppercase mb-2 ${color}`}>{title}</h3>
                <p className="text-slate-300 font-sans leading-relaxed">{desc}</p>
              </div>

              <button 
                onClick={handleStart}
                className="bg-transparent hover:bg-slate-800 border-2 border-cyan-500 text-cyan-400 font-black py-4 px-10 uppercase tracking-widest transition-all w-full md:w-auto"
              >
                REINICIAR SIMULADOR DE COMBATE
              </button>
            </div>
          );
        })()}

      </div>

      {/* FOOTER */}
      <footer className="relative z-10 pb-6 pt-12 text-center text-slate-500 text-xs font-mono">
        <p>
          Desenvolvido por{' '}
          <a 
            href="https://github.com/3lielF/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-500 hover:text-cyan-300 hover:underline transition-colors font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
          >
            Eliel filho
          </a>
        </p>
      </footer>
    </div>
  );
}
