import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  TrendingUp,
  TrendingDown,
  Box,
  Globe,
  Truck,
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  History,
  ArrowLeft,
  Calendar,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Briefcase,
  Wallet,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  Activity,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  DollarSign,
  Percent,
  FileText,
  Landmark,
  X,
  CreditCard,
  Shield,
  BellRing,
  Map as MapIcon,
  Plane,
  Ship,
  Bot,
  Image as ImageIcon,
  Sparkles,
  BrainCircuit,
  Send,
  Paperclip,
  Loader2,
  Zap,
  Check,
  Network,
  Share2,
  Copy,
  Trophy,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Logo } from './Logo';
import { Metric, Order, UserRole } from '../types';

// --- Mock Data ---

const chartData = [
  { name: 'Mon', revenue: 4000, orders: 240 },
  { name: 'Tue', revenue: 3000, orders: 139 },
  { name: 'Wed', revenue: 2000, orders: 980 },
  { name: 'Thu', revenue: 2780, orders: 390 },
  { name: 'Fri', revenue: 1890, orders: 480 },
  { name: 'Sat', revenue: 2390, orders: 380 },
  { name: 'Sun', revenue: 3490, orders: 430 },
];

const metrics: Metric[] = [
  { label: 'Total Revenue', value: '$54,239', change: '+12.5%', isPositive: true },
  { label: 'Active Orders', value: '1,245', change: '+5.2%', isPositive: true },
  { label: 'Return Rate', value: '2.4%', change: '-0.4%', isPositive: true },
  { label: 'Avg. Shipping', value: '3.2 Days', change: '-12%', isPositive: true },
];

const allOrders: Order[] = [
  { id: '#ORD-7782', product: 'Wireless Earbuds Pro', customer: 'Alex M.', date: 'Oct 24, 2023', status: 'Pending', amount: '$129.00' },
  { id: '#ORD-7781', product: 'Smart Watch Series 5', customer: 'Sarah K.', date: 'Oct 24, 2023', status: 'Shipped', amount: '$299.00' },
  { id: '#ORD-7780', product: 'Gaming Keyboard RGB', customer: 'Mike R.', date: 'Oct 23, 2023', status: 'Delivered', amount: '$89.00' },
  { id: '#ORD-7779', product: 'USB-C Docking Station', customer: 'Jessica T.', date: 'Oct 23, 2023', status: 'Shipped', amount: '$149.00' },
  { id: '#ORD-7778', product: '4K Monitor', customer: 'David L.', date: 'Oct 22, 2023', status: 'Delivered', amount: '$499.00' },
  { id: '#ORD-7777', product: 'Laptop Stand', customer: 'Emily W.', date: 'Oct 22, 2023', status: 'Delivered', amount: '$45.00' },
];

// --- 6-Level Referral Data ---
const referralLevels = [
    { level: 1, label: 'Direct Partners', percent: 5.0, members: 12, volume: 1200000, earnings: 60000, color: 'text-amber-500', bar: 'bg-amber-500' },
    { level: 2, label: 'Level 2', percent: 2.5, members: 45, volume: 3500000, earnings: 87500, color: 'text-blue-400', bar: 'bg-blue-500' },
    { level: 3, label: 'Level 3', percent: 1.25, members: 128, volume: 8900000, earnings: 111250, color: 'text-green-400', bar: 'bg-green-500' },
    { level: 4, label: 'Level 4', percent: 0.75, members: 312, volume: 18400000, earnings: 138000, color: 'text-purple-400', bar: 'bg-purple-500' },
    { level: 5, label: 'Level 5', percent: 0.50, members: 756, volume: 35600000, earnings: 178000, color: 'text-pink-400', bar: 'bg-pink-500' },
    { level: 6, label: 'Level 6', percent: 0.25, members: 1420, volume: 62000000, earnings: 155000, color: 'text-slate-400', bar: 'bg-slate-500' },
];

const totalNetworkEarnings = referralLevels.reduce((acc, curr) => acc + curr.earnings, 0);
const totalNetworkSize = referralLevels.reduce((acc, curr) => acc + curr.members, 0);

// --- PLAN PRESENTATION DATA ---
const PLAN_DATA = [
    { level: 'L1', invest: '51,111', profit: '7,667', r20: '31,800', r10: '40,500', r7: '55,650', r5: '82,500', r2: '75,000', r1: '1,65,000', totalProfit: '7,667', totalComm: '4,50,450', admin: '4,05,405', deduct: '45,045' },
    { level: 'L2', invest: '10,60,000', profit: '1,59,000', r20: '81,000', r10: '79,500', r7: '1,15,500', r5: '1,87,500', r2: '3,30,000', r1: '45,000', totalProfit: '1,59,000', totalComm: '8,38,500', admin: '7,54,650', deduct: '83,850' },
    { level: 'L3', invest: '27,00,000', profit: '4,05,000', r20: '1,59,000', r10: '1,65,000', r7: '2,62,500', r5: '8,25,000', r2: '90,000', r1: '12,000', totalProfit: '4,05,000', totalComm: '15,13,500', admin: '13,62,150', deduct: '1,51,350' },
    { level: 'L4', invest: '53,00,000', profit: '7,95,000', r20: '3,30,000', r10: '3,75,000', r7: '11,55,000', r5: '2,25,000', r2: '24,000', r1: '11,250', totalProfit: '7,95,000', totalComm: '21,20,250', admin: '19,08,225', deduct: '2,12,025' },
    { level: 'L5', invest: '1,10,00,000', profit: '16,50,000', r20: '7,50,000', r10: '16,50,000', r7: '3,15,000', r5: '60,000', r2: '22,500', r1: '33,750', totalProfit: '16,50,000', totalComm: '28,31,250', admin: '25,48,125', deduct: '2,83,125' },
    { level: 'L6', invest: '2,50,00,000', profit: '37,50,000', r20: '33,00,000', r10: '4,50,000', r7: '84,000', r5: '56,250', r2: '67,500', r1: '9,00,000', totalProfit: '37,50,000', totalComm: '48,57,750', admin: '43,71,975', deduct: '4,85,775' },
    { level: 'L7', invest: '11,00,00,000', profit: '1,65,00,000', r20: '9,00,000', r10: '1,20,000', r7: '78,750', r5: '1,68,750', r2: '18,00,000', r1: '2,25,000', totalProfit: '1,65,00,000', totalComm: '32,92,500', admin: '29,63,250', deduct: '3,29,250' },
    { level: 'L8', invest: '3,00,00,000', profit: '45,00,000', r20: '2,40,000', r10: '1,12,500', r7: '2,36,250', r5: '45,000', r2: '4,50,000', r1: '79,500', totalProfit: '45,00,000', totalComm: '56,18,250', admin: '50,56,425', deduct: '5,61,825' },
    { level: 'L9', invest: '80,00,000', profit: '12,00,000', r20: '2,25,000', r10: '3,37,500', r7: '63,00,000', r5: '11,25,000', r2: '1,59,000', r1: '1,12,500', totalProfit: '12,00,000', totalComm: '82,59,000', admin: '74,33,100', deduct: '8,25,900' },
    { level: 'L10', invest: '75,00,000', profit: '11,25,000', r20: '6,75,000', r10: '90,00,000', r7: '15,75,000', r5: '3,97,500', r2: '2,25,000', r1: '15,000', totalProfit: '11,25,000', totalComm: '1,18,87,500', admin: '1,06,98,750', deduct: '11,88,750' },
    { level: 'L11', invest: '2,25,00,000', profit: '33,75,000', r20: '1,80,00,000', r10: '22,50,000', r7: '5,56,500', r5: '5,62,500', r2: '30,000', r1: '-', totalProfit: '33,75,000', totalComm: '2,13,99,000', admin: '1,92,59,100', deduct: '21,39,900' },
    { level: 'L12', invest: '60,00,00,000', profit: '9,00,00,000', r20: '45,00,000', r10: '7,95,000', r7: '7,87,500', r5: '75,000', r2: '-', r1: '-', totalProfit: '9,00,00,000', totalComm: '61,57,500', admin: '55,41,750', deduct: '6,15,750' },
    { level: 'L13', invest: '15,00,00,000', profit: '2,25,00,000', r20: '15,90,000', r10: '11,25,000', r7: '1,05,000', r5: '-', r2: '-', r1: '-', totalProfit: '2,25,00,000', totalComm: '28,20,000', admin: '25,38,000', deduct: '2,82,000' },
    { level: 'L14', invest: '5,30,00,000', profit: '79,50,000', r20: '22,50,000', r10: '1,50,000', r7: '-', r5: '-', r2: '-', r1: '-', totalProfit: '79,50,000', totalComm: '24,00,000', admin: '21,60,000', deduct: '2,40,000' },
    { level: 'L15', invest: '7,50,00,000', profit: '1,12,50,000', r20: '3,00,000', r10: '-', r7: '-', r5: '-', r2: '-', r1: '-', totalProfit: '1,12,50,000', totalComm: '3,00,000', admin: '2,70,000', deduct: '30,000' },
    { level: 'TOTAL', invest: '1,11,11,11,111', profit: '16,66,66,667', r20: '3,33,31,800', r10: '1,66,50,000', r7: '1,16,26,650', r5: '82,65,000', r2: '32,73,000', r1: '15,99,000', totalProfit: '16,66,66,667', totalComm: '7,47,45,450', admin: '6,72,70,905', deduct: '74,74,545' },
];

const ROYALTY_DATA = [
    { rank: 'BRONZE', target: '50 LAKH', royalty: '1.00%' },
    { rank: 'SILVER', target: '1 CRORE', royalty: '0.75%' },
    { rank: 'GOLD', target: '5 CRORE', royalty: '0.50%' },
    { rank: 'PLATINUM', target: '25 CRORE', royalty: '0.35%' },
    { rank: 'DIAMOND', target: '75 CRORE', royalty: '0.25%' },
    { rank: 'AMBASSADOR', target: '100 CRORE', royalty: '0.15%' },
    { rank: 'TOTAL', target: '', royalty: '3%', isTotal: true },
];

const EXPENSE_DATA = [
    { label: 'TOTAL RETURNS', type: 'STATIC', val: '25%' },
    { label: 'YEARLY GIFTS', type: 'Flexible', val: '3%' },
    { label: 'OFFICE EXPENSE', type: 'Flexible', val: '3%' },
    { label: 'MARKETING EXPENSE', type: 'STATIC', val: '10%' },
    { label: 'COMPANY EXPANSION', type: 'STATIC', val: '10%' },
    { label: 'MILIND PATIL', type: '', val: '10%' },
    { label: 'ROSHAN KARNEKAR', type: '', val: '10%' },
    { label: 'TOTAL', type: '', val: '70%', isTotal: true },
];

// --- PMS Prop Trading Data ---

interface PMSClient {
    id: string;
    name: string;
    riskProfile: 'Aggressive' | 'Balanced' | 'Conservative';
    ratio: { equity: number; debt: number; crypto: number }; // Breakdown
    investDate: string;
    principal: number;
    currentValue: number;
    dailyPnL: number;
    totalPnL: number;
    history: { date: string; value: number }[];
}

const pmsClientsData: PMSClient[] = [
    { 
        id: 'C-1042', name: 'Alex Mercer', riskProfile: 'Aggressive', 
        ratio: { equity: 70, debt: 10, crypto: 20 }, 
        investDate: '2023-01-15', principal: 50000, currentValue: 62450, dailyPnL: 1.2, totalPnL: 24.9,
        history: [ {date: 'Q1', value: 50000}, {date: 'Q2', value: 54000}, {date: 'Q3', value: 59000}, {date: 'Q4', value: 62450} ]
    },
    { 
        id: 'C-1043', name: 'Sarah Kerrigan', riskProfile: 'Balanced', 
        ratio: { equity: 50, debt: 40, crypto: 10 }, 
        investDate: '2023-03-10', principal: 120000, currentValue: 135600, dailyPnL: 0.5, totalPnL: 13.0,
        history: [ {date: 'Q1', value: 120000}, {date: 'Q2', value: 124000}, {date: 'Q3', value: 128000}, {date: 'Q4', value: 135600} ]
    },
    { 
        id: 'C-1044', name: 'Jim Raynor', riskProfile: 'Conservative', 
        ratio: { equity: 30, debt: 70, crypto: 0 }, 
        investDate: '2023-06-22', principal: 250000, currentValue: 258000, dailyPnL: 0.1, totalPnL: 3.2,
        history: [ {date: 'Q1', value: 250000}, {date: 'Q2', value: 252000}, {date: 'Q3', value: 255000}, {date: 'Q4', value: 258000} ]
    },
    { 
        id: 'C-1045', name: 'Tychus Findlay', riskProfile: 'Aggressive', 
        ratio: { equity: 90, debt: 0, crypto: 10 }, 
        investDate: '2023-08-05', principal: 25000, currentValue: 21500, dailyPnL: -2.4, totalPnL: -14.0,
        history: [ {date: 'Q1', value: 25000}, {date: 'Q2', value: 28000}, {date: 'Q3', value: 24000}, {date: 'Q4', value: 21500} ]
    },
];

const COLORS = {
    equity: '#f59e0b', // Amber 500
    debt: '#3b82f6',   // Blue 500
    crypto: '#8b5cf6'  // Violet 500
};

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    image?: string;
    grounding?: any;
    isThinking?: boolean;
}

interface DashboardProps {
  onLogout: () => void;
}

// PMS Onboarding Types
interface NewClientData {
    name: string;
    principal: number;
    riskProfile: 'Aggressive' | 'Balanced' | 'Conservative';
    ratio: { equity: number; debt: number; crypto: number };
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { user, profile, role } = useAuth();
  
  // Set default tab based on role
  const [activeTab, setActiveTab] = useState(() => {
    if (role === 'admin' || role === 'partner') return 'Overview';
    return 'Overview';
  });
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  
  // PMS Specific State
  const [clients, setClients] = useState<PMSClient[]>(pmsClientsData);
  const [selectedPMSClient, setSelectedPMSClient] = useState<PMSClient>(pmsClientsData[0]);
  const [executionAmount, setExecutionAmount] = useState<string>('');
  const [executionType, setExecutionType] = useState<'Deposit' | 'Withdrawal'>('Deposit');

  // PMS Onboarding State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [newClient, setNewClient] = useState<NewClientData>({
      name: '',
      principal: 100000,
      riskProfile: 'Balanced',
      ratio: { equity: 50, debt: 40, crypto: 10 }
  });

  // UI States
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // AI Assistant State
  const [aiMode, setAiMode] = useState<'chat' | 'search' | 'maps' | 'think'>('chat');
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
      { id: '1', role: 'model', text: 'Hello! I am your Smart Assistant. I can help you with market research, logistics tracking, or analyzing documents. How can I assist you today?' }
  ]);
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleCustomerClick = (name: string) => {
    setSelectedCustomer(name);
  };

  const handleBackToView = () => {
    setSelectedCustomer(null);
  };

  // Logic for PMS Execution Desk calculation
  const executionPreview = useMemo(() => {
    const amt = parseFloat(executionAmount) || 0;
    if (amt === 0) return null;
    
    const { equity, debt, crypto } = selectedPMSClient.ratio;
    return {
        equity: (amt * equity) / 100,
        debt: (amt * debt) / 100,
        crypto: (amt * crypto) / 100
    };
  }, [executionAmount, selectedPMSClient]);

  const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const executePMSAction = () => {
    // RBAC Check for writing
    if (role !== 'admin') {
        alert("Action Denied: Only Administrators can execute trades.");
        return;
    }
    const amt = parseFloat(executionAmount);
    if (!amt || amt <= 0) return;
    setExecutionAmount('');
    alert(`Successfully executed ${executionType} of ${formatCurrency(amt)}.`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSendMessage = async () => {
      if ((!aiInput.trim() && !selectedImage) || aiIsLoading) return;

      const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          text: aiInput,
          image: selectedImage || undefined
      };

      setAiMessages(prev => [...prev, userMsg]);
      setAiInput('');
      setSelectedImage(null);
      setAiIsLoading(true);

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          let modelName = 'gemini-3-pro-preview'; // Default
          let tools = undefined;
          let thinkingConfig = undefined;

          // Mode Selection Logic
          if (userMsg.image) {
              // Always use pro for images
              modelName = 'gemini-3-pro-image-preview';
          } else if (aiMode === 'search') {
              modelName = 'gemini-3-flash-preview';
              tools = [{ googleSearch: {} }];
          } else if (aiMode === 'maps') {
              modelName = 'gemini-2.5-flash';
              tools = [{ googleMaps: {} }];
          } else if (aiMode === 'think') {
              modelName = 'gemini-3-pro-preview';
              thinkingConfig = { thinkingBudget: 32768 };
          }

          let content: any = userMsg.text;
          
          if (userMsg.image) {
              const base64Data = userMsg.image.split(',')[1];
              content = {
                  parts: [
                      { inlineData: { mimeType: 'image/png', data: base64Data } },
                      { text: userMsg.text || 'Analyze this image.' }
                  ]
              };
          }

          const response = await ai.models.generateContent({
              model: modelName,
              contents: content,
              config: {
                  tools,
                  thinkingConfig
              }
          });

          let responseText = response.text || "I couldn't generate a response.";
          let groundingInfo = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

          const modelMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: responseText,
              grounding: groundingInfo
          };

          setAiMessages(prev => [...prev, modelMsg]);

      } catch (error) {
          console.error("AI Error", error);
          setAiMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: "Sorry, I encountered an error processing your request. Please try again."
          }]);
      } finally {
          setAiIsLoading(false);
      }
  };

  // --- ONBOARDING HANDLERS ---
  const handleAddClient = () => {
    // RBAC Check
    if (role !== 'admin') {
        alert("Action Denied: Only Administrators can onboard new clients.");
        return;
    }

    const id = `C-${1042 + clients.length + 1}`; // Simple ID generation
    const client: PMSClient = {
        id,
        name: newClient.name,
        riskProfile: newClient.riskProfile,
        ratio: newClient.ratio,
        investDate: new Date().toISOString().split('T')[0],
        principal: newClient.principal,
        currentValue: newClient.principal, // Starts at principal
        dailyPnL: 0,
        totalPnL: 0,
        history: [{ date: 'Start', value: newClient.principal }]
    };

    setClients([...clients, client]);
    setSelectedPMSClient(client); // Select the new client
    setIsOnboardingOpen(false);
    // Reset form
    setNewClient({
         name: '',
         principal: 100000,
         riskProfile: 'Balanced',
         ratio: { equity: 50, debt: 40, crypto: 10 }
    });
    setOnboardingStep(1);
  };

  const renderOnboardingModal = () => {
      if (!isOnboardingOpen) return null;

      const totalRatio = newClient.ratio.equity + newClient.ratio.debt + newClient.ratio.crypto;
      const isRatioValid = totalRatio === 100;

      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
              <div className="bg-[#0f172a] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                      <div>
                          <h3 className="text-xl font-bold font-['Rajdhani'] text-white">Onboard New Client</h3>
                          <p className="text-xs text-slate-400">Step {onboardingStep} of 3</p>
                      </div>
                      <button onClick={() => setIsOnboardingOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-slate-800">
                      <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${(onboardingStep / 3) * 100}%` }}></div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 flex-1 overflow-y-auto">
                      {onboardingStep === 1 && (
                          <div className="space-y-6 animate-fade-in-up">
                              <div>
                                  <label className="block text-sm font-bold text-slate-300 mb-2">Client Full Name</label>
                                  <input 
                                      type="text" 
                                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none transition-colors"
                                      placeholder="e.g. Johnathan Doe"
                                      value={newClient.name}
                                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                                      autoFocus
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-300 mb-2">Initial Principal ($)</label>
                                  <div className="relative">
                                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                      <input 
                                          type="number" 
                                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-amber-500 outline-none transition-colors"
                                          placeholder="100000"
                                          value={newClient.principal}
                                          onChange={(e) => setNewClient({...newClient, principal: parseFloat(e.target.value) || 0})}
                                      />
                                  </div>
                              </div>
                          </div>
                      )}

                      {onboardingStep === 2 && (
                          <div className="space-y-4 animate-fade-in-up">
                              <label className="block text-sm font-bold text-slate-300 mb-2">Select Risk Profile</label>
                              {[
                                  { id: 'Aggressive', desc: 'High risk, high reward. Focus on Equity & Crypto.', color: 'border-red-500/50 hover:border-red-500', bg: 'bg-red-500/10' },
                                  { id: 'Balanced', desc: 'Moderate growth with stable returns. Mixed allocation.', color: 'border-blue-500/50 hover:border-blue-500', bg: 'bg-blue-500/10' },
                                  { id: 'Conservative', desc: 'Capital preservation focus. High Debt allocation.', color: 'border-green-500/50 hover:border-green-500', bg: 'bg-green-500/10' }
                              ].map((profile) => (
                                  <div 
                                      key={profile.id}
                                      onClick={() => setNewClient({
                                          ...newClient, 
                                          riskProfile: profile.id as any,
                                          // Auto-set ratios based on profile selection for convenience
                                          ratio: profile.id === 'Aggressive' ? { equity: 70, debt: 10, crypto: 20 } :
                                                 profile.id === 'Balanced' ? { equity: 50, debt: 40, crypto: 10 } :
                                                 { equity: 20, debt: 80, crypto: 0 }
                                      })}
                                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${newClient.riskProfile === profile.id ? `${profile.bg} ${profile.color.replace('/50', '')} shadow-lg scale-[1.02]` : 'bg-slate-900 border-slate-700 hover:bg-slate-800 hover:scale-[1.01]'}`}
                                  >
                                      <div>
                                          <h4 className="font-bold text-white text-lg">{profile.id}</h4>
                                          <p className="text-xs text-slate-400 mt-1">{profile.desc}</p>
                                      </div>
                                      {newClient.riskProfile === profile.id && <CheckCircle2 className="text-white" />}
                                  </div>
                              ))}
                          </div>
                      )}

                      {onboardingStep === 3 && (
                          <div className="space-y-6 animate-fade-in-up">
                               <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                                   <div className="flex justify-between items-center mb-4">
                                       <h4 className="font-bold text-white">Allocation Strategy</h4>
                                       <span className={`text-xs font-bold px-2 py-1 rounded ${isRatioValid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                           Total: {totalRatio}%
                                       </span>
                                   </div>
                                   
                                   {['equity', 'debt', 'crypto'].map((asset) => (
                                       <div key={asset} className="mb-4 last:mb-0">
                                           <div className="flex justify-between text-xs mb-2">
                                               <span className="capitalize text-slate-300 font-bold">{asset}</span>
                                               <span className="text-white">{newClient.ratio[asset as keyof typeof newClient.ratio]}%</span>
                                           </div>
                                           <input 
                                               type="range" 
                                               min="0" 
                                               max="100" 
                                               step="5"
                                               value={newClient.ratio[asset as keyof typeof newClient.ratio]}
                                               onChange={(e) => setNewClient({
                                                   ...newClient,
                                                   ratio: {
                                                       ...newClient.ratio,
                                                       [asset]: parseInt(e.target.value)
                                                   }
                                               })}
                                               className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                                                   asset === 'equity' ? 'bg-amber-500/20 [&::-webkit-slider-thumb]:bg-amber-500' : 
                                                   asset === 'debt' ? 'bg-blue-500/20 [&::-webkit-slider-thumb]:bg-blue-500' : 
                                                   'bg-violet-500/20 [&::-webkit-slider-thumb]:bg-violet-500'
                                               } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full`}
                                           />
                                       </div>
                                   ))}
                               </div>
                               {!isRatioValid && (
                                   <p className="text-xs text-red-400 text-center flex items-center justify-center gap-2">
                                       <AlertTriangle size={12} /> Allocations must sum to exactly 100%.
                                   </p>
                               )}
                          </div>
                      )}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-between">
                      {onboardingStep > 1 ? (
                          <button 
                              onClick={() => setOnboardingStep(s => s - 1)}
                              className="px-6 py-2 rounded-lg text-slate-400 hover:text-white font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                          >
                              <ChevronLeft size={16} /> Back
                          </button>
                      ) : (
                          <div></div>
                      )}
                      
                      {onboardingStep < 3 ? (
                          <button 
                              onClick={() => {
                                  if (onboardingStep === 1 && !newClient.name) return; // Basic validation
                                  setOnboardingStep(s => s + 1);
                              }}
                              disabled={onboardingStep === 1 && !newClient.name}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                          >
                              Next <ChevronRight size={16} />
                          </button>
                      ) : (
                          <button 
                              onClick={handleAddClient}
                              disabled={!isRatioValid}
                              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 active:scale-95"
                          >
                              <Check size={16} /> Complete Onboarding
                          </button>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  const renderAIAssistant = () => (
      <div className="flex flex-col h-[calc(100vh-140px)] glass-panel rounded-xl overflow-hidden animate-fade-in relative hover:shadow-xl transition-shadow duration-300">
          {/* Header */}
          <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30">
                      <Bot size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-white">Smart Assistant</h3>
                      <p className="text-[10px] text-slate-400">Powered by Gemini 3.0</p>
                  </div>
              </div>
              <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                  <button 
                    onClick={() => setAiMode('chat')}
                    className={`p-1.5 rounded transition-all hover:scale-110 ${aiMode === 'chat' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`} 
                    title="Standard Chat"
                  >
                      <Bot size={16} />
                  </button>
                  <button 
                    onClick={() => setAiMode('search')}
                    className={`p-1.5 rounded transition-all hover:scale-110 ${aiMode === 'search' ? 'bg-blue-600/20 text-blue-400 shadow border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                    title="Google Search Grounding"
                  >
                      <Globe size={16} />
                  </button>
                  <button 
                    onClick={() => setAiMode('maps')}
                    className={`p-1.5 rounded transition-all hover:scale-110 ${aiMode === 'maps' ? 'bg-green-600/20 text-green-400 shadow border border-green-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                    title="Google Maps Grounding"
                  >
                      <MapPin size={16} />
                  </button>
                  <button 
                    onClick={() => setAiMode('think')}
                    className={`p-1.5 rounded transition-all hover:scale-110 ${aiMode === 'think' ? 'bg-purple-600/20 text-purple-400 shadow border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                    title="Deep Thinking Mode"
                  >
                      <BrainCircuit size={16} />
                  </button>
              </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
              {aiMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'user' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
                          {msg.image && (
                              <img src={msg.image} alt="Upload" className="max-w-full h-auto rounded-lg mb-2 border border-white/10" />
                          )}
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                          
                          {/* Grounding Chips */}
                          {msg.grounding && msg.grounding.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                                  {msg.grounding.map((chunk: any, i: number) => {
                                      if (chunk.web?.uri) {
                                          return (
                                              <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-slate-900/50 hover:bg-slate-900 px-2 py-1 rounded-full text-blue-400 transition-colors border border-blue-500/20 hover:scale-105">
                                                  <Globe size={10} /> {chunk.web.title || 'Source'}
                                              </a>
                                          );
                                      }
                                      return null;
                                  })}
                              </div>
                          )}
                      </div>
                  </div>
              ))}
              {aiIsLoading && (
                  <div className="flex justify-start">
                      <div className="bg-slate-800 rounded-xl rounded-bl-none p-4 border border-slate-700 flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin text-amber-500" />
                          <span className="text-xs text-slate-400 animate-pulse">
                              {aiMode === 'think' ? 'Reasoning deeply...' : aiMode === 'search' ? 'Searching web...' : 'Gemini is typing...'}
                          </span>
                      </div>
                  </div>
              )}
              <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
              {selectedImage && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-slate-800 rounded-lg w-fit border border-slate-700">
                      <ImageIcon size={14} className="text-amber-500" />
                      <span className="text-xs text-slate-300">Image attached</span>
                      <button onClick={() => setSelectedImage(null)} className="text-slate-500 hover:text-white"><X size={14} /></button>
                  </div>
              )}
              <div className="flex gap-2">
                  <div className="relative flex-1">
                      <input 
                          type="text" 
                          placeholder={aiMode === 'think' ? "Ask a complex question..." : "Type your message..."}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-amber-500 outline-none shadow-inner"
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                      />
                      <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors hover:scale-110"
                          title="Attach Image"
                      >
                          <Paperclip size={18} />
                      </button>
                  </div>
                  <button 
                      onClick={handleSendMessage}
                      disabled={aiIsLoading}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl px-4 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20 hover:scale-105 active:scale-95"
                  >
                      <Send size={18} />
                  </button>
              </div>
              <div className="mt-2 text-[10px] text-slate-500 flex justify-center gap-4">
                  <span className={`flex items-center gap-1 ${aiMode === 'search' ? 'text-blue-400' : ''}`}>
                      {aiMode === 'search' && <Sparkles size={10} />} Search Grounding {aiMode === 'search' ? 'Active' : 'Off'}
                  </span>
                  <span className={`flex items-center gap-1 ${aiMode === 'think' ? 'text-purple-400' : ''}`}>
                      {aiMode === 'think' && <BrainCircuit size={10} />} Deep Think {aiMode === 'think' ? 'Active' : 'Off'}
                  </span>
              </div>
          </div>
      </div>
  );

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-xl hover:border-amber-500/30 transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/5 cursor-default">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-sm font-medium">{metric.label}</span>
              <div className={`p-1.5 rounded-lg ${metric.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                <TrendingUp size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-1 group-hover:text-amber-400 transition-colors">{metric.value}</h3>
            <span className={`text-xs font-medium ${metric.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {metric.change} from last month
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-bold mb-6">Revenue Analytics</h3>
          <div className="h-64 w-full min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c79155" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c79155" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                    itemStyle={{ color: '#fbbf24' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-bold mb-6">Inventory Status</h3>
          <div className="space-y-6">
             {[
                { label: 'Electronics', val: 75, color: 'bg-amber-500' },
                { label: 'Apparel', val: 45, color: 'bg-blue-500' },
                { label: 'Home Goods', val: 90, color: 'bg-green-500' },
                { label: 'Accessories', val: 30, color: 'bg-purple-500' }
             ].map((item, i) => (
                <div key={i}>
                    <div className="flex justify-between mb-2 text-sm">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="text-slate-400">{item.val}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                    </div>
                </div>
             ))}
          </div>
          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
                <Box size={18} className="text-amber-500" />
                <h4 className="font-bold text-amber-500 text-sm">Low Stock Alert</h4>
            </div>
            <p className="text-xs text-slate-400">3 SKU categories are running low. Auto-reorder logic engaged.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <button 
              onClick={() => setActiveTab('Orders')}
              className="text-xs text-amber-500 font-semibold hover:text-amber-400 hover:scale-105 transition-transform"
            >
              VIEW ALL
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-400">
                <thead className="text-xs uppercase bg-slate-900/50 text-slate-500">
                    <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {allOrders.slice(0, 4).map((order) => (
                        <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-amber-500">{order.id}</td>
                            <td className="px-6 py-4 text-slate-200">{order.product}</td>
                            <td 
                                onClick={() => handleCustomerClick(order.customer)}
                                className="px-6 py-4 text-slate-300 hover:text-amber-500 cursor-pointer transition-colors underline decoration-dotted underline-offset-4"
                            >
                                {order.customer}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' :
                                    order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' :
                                    'bg-amber-500/10 text-amber-400'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-slate-200 font-bold">{order.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );

  const renderPMS = () => (
    <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { title: 'Total AUM', val: '₹24.5 Cr', icon: Banknote, color: 'amber' },
                { title: 'Active Clients', val: clients.length, icon: Users, color: 'blue' },
                { title: 'Avg. Daily PnL', val: '+1.2%', icon: TrendingUp, color: 'green' }
            ].map((stat, i) => (
                <div key={i} className="glass-panel p-4 rounded-xl flex items-center justify-between hover:scale-105 transition-all duration-300 hover:shadow-lg cursor-default">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">{stat.title}</p>
                        <h3 className={`text-xl font-bold ${stat.color === 'green' ? 'text-green-400' : 'text-white'}`}>{stat.val}</h3>
                    </div>
                    <div className={`p-2 bg-${stat.color}-500/10 rounded-lg text-${stat.color}-500`}><stat.icon size={20} /></div>
                </div>
            ))}
            
            {role === 'admin' && (
                 <button 
                    onClick={() => setIsOnboardingOpen(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-bold flex flex-col items-center justify-center transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95"
                 >
                    <Plus size={24} />
                    <span className="text-xs mt-1">Onboard Client</span>
                 </button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client List */}
            <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[600px] hover:border-amber-500/30 transition-all duration-300">
                <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                    <h3 className="font-bold text-white flex items-center gap-2"><Briefcase size={16} className="text-amber-500" /> Client Portfolio</h3>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {clients.map(client => (
                        <div 
                            key={client.id}
                            onClick={() => setSelectedPMSClient(client)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${selectedPMSClient.id === client.id ? 'bg-amber-500/10 border-amber-500/50 shadow-lg' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-bold text-sm ${selectedPMSClient.id === client.id ? 'text-amber-500' : 'text-slate-200'}`}>{client.name}</h4>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${client.totalPnL >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {client.totalPnL > 0 ? '+' : ''}{client.totalPnL}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>{client.id}</span>
                                <span>{formatCurrency(client.currentValue)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Client Detail View */}
            <div className="lg:col-span-2 space-y-6">
                 {/* Detail Header */}
                 <div className="glass-panel p-6 rounded-xl relative overflow-hidden hover:shadow-xl transition-all duration-300">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Activity size={100} />
                     </div>
                     <div className="flex justify-between items-start relative z-10">
                         <div>
                             <h2 className="text-2xl font-bold text-white mb-1">{selectedPMSClient.name}</h2>
                             <div className="flex items-center gap-3 text-sm text-slate-400">
                                 <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">ID: {selectedPMSClient.id}</span>
                                 <span className={`px-2 py-1 rounded text-xs border ${selectedPMSClient.riskProfile === 'Aggressive' ? 'border-red-500/30 text-red-400 bg-red-500/10' : selectedPMSClient.riskProfile === 'Conservative' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                                     {selectedPMSClient.riskProfile}
                                 </span>
                             </div>
                         </div>
                         <div className="text-right">
                             <p className="text-sm text-slate-400">Current Value</p>
                             <h3 className="text-3xl font-bold text-white font-mono tracking-tight">{formatCurrency(selectedPMSClient.currentValue)}</h3>
                         </div>
                     </div>

                     {/* Allocation Bar */}
                     <div className="mt-8">
                         <div className="flex justify-between text-xs mb-2 font-bold">
                             <span className="text-amber-500">Equity ({selectedPMSClient.ratio.equity}%)</span>
                             <span className="text-blue-500">Debt ({selectedPMSClient.ratio.debt}%)</span>
                             <span className="text-violet-500">Crypto ({selectedPMSClient.ratio.crypto}%)</span>
                         </div>
                         <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                             <div style={{ width: `${selectedPMSClient.ratio.equity}%` }} className="h-full bg-amber-500" />
                             <div style={{ width: `${selectedPMSClient.ratio.debt}%` }} className="h-full bg-blue-500" />
                             <div style={{ width: `${selectedPMSClient.ratio.crypto}%` }} className="h-full bg-violet-500" />
                         </div>
                     </div>
                 </div>

                 {/* Charts & Actions */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="glass-panel p-6 rounded-xl min-h-[300px] hover:border-amber-500/30 transition-all duration-300">
                         <h4 className="font-bold text-slate-300 mb-4">Performance History</h4>
                         <div className="h-56 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={selectedPMSClient.history}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 10}} />
                                    <YAxis stroke="#64748b" tick={{fontSize: 10}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                                        itemStyle={{ color: '#fbbf24' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                             </ResponsiveContainer>
                         </div>
                     </div>

                     {/* Execution Desk (Admin Only) */}
                     {role === 'admin' && (
                         <div className="glass-panel p-6 rounded-xl flex flex-col hover:border-amber-500/30 transition-all duration-300">
                             <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2"><Zap size={16} className="text-amber-500" /> Execution Desk</h4>
                             
                             <div className="flex-1 space-y-4">
                                 <div>
                                     <label className="text-xs text-slate-500 font-bold mb-1 block">Operation Type</label>
                                     <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                                         <button 
                                            onClick={() => setExecutionType('Deposit')}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded transition-all active:scale-95 ${executionType === 'Deposit' ? 'bg-green-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                         >
                                             DEPOSIT
                                         </button>
                                         <button 
                                            onClick={() => setExecutionType('Withdrawal')}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded transition-all active:scale-95 ${executionType === 'Withdrawal' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                         >
                                             WITHDRAW
                                         </button>
                                     </div>
                                 </div>

                                 <div>
                                     <label className="text-xs text-slate-500 font-bold mb-1 block">Amount (INR)</label>
                                     <div className="relative">
                                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-sans">₹</span>
                                         <input 
                                             type="number"
                                             value={executionAmount}
                                             onChange={(e) => setExecutionAmount(e.target.value)}
                                             className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-7 pr-3 text-white focus:border-amber-500 outline-none font-mono focus:shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-shadow"
                                             placeholder="0.00"
                                         />
                                     </div>
                                 </div>

                                 {executionPreview && (
                                     <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-1 animate-fade-in">
                                         <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Impact Preview</p>
                                         <div className="flex justify-between text-xs text-amber-500"><span>Eq:</span> <span>₹{executionPreview.equity.toFixed(0)}</span></div>
                                         <div className="flex justify-between text-xs text-blue-500"><span>Debt:</span> <span>₹{executionPreview.debt.toFixed(0)}</span></div>
                                         <div className="flex justify-between text-xs text-violet-500"><span>Cryp:</span> <span>₹{executionPreview.crypto.toFixed(0)}</span></div>
                                     </div>
                                 )}
                             </div>

                             <button 
                                 onClick={executePMSAction}
                                 className="mt-4 w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg shadow-amber-900/20"
                             >
                                 <Check size={18} /> Confirm Execution
                             </button>
                         </div>
                     )}
                 </div>
            </div>
        </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-lg group">
                 <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                 <Users size={48} className="text-amber-500 mb-4 transform group-hover:scale-110 transition-transform" />
                 <h2 className="text-4xl font-bold text-white mb-1 font-['Rajdhani']">{totalNetworkSize.toLocaleString()}</h2>
                 <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">Total Network Size</p>
            </div>
            <div className="glass-panel p-8 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-lg group">
                 <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                 <Wallet size={48} className="text-green-500 mb-4 transform group-hover:scale-110 transition-transform" />
                 <h2 className="text-4xl font-bold text-white mb-1 font-['Rajdhani']">₹{totalNetworkEarnings.toLocaleString()}</h2>
                 <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">Total Network Earnings</p>
            </div>
        </div>

        <div className="glass-panel p-6 rounded-xl hover:border-amber-500/30 transition-all duration-300">
             <h3 className="text-xl font-bold text-white mb-6">Referral Level Analytics</h3>
             <div className="space-y-6">
                 {referralLevels.map((level) => (
                     <div key={level.level} className="relative group cursor-default hover:translate-x-1 transition-transform duration-300">
                         <div className="flex justify-between items-end mb-2 relative z-10">
                             <div>
                                 <h4 className={`font-bold ${level.color} text-lg`}>{level.label}</h4>
                                 <p className="text-xs text-slate-500">{level.percent}% Commission</p>
                             </div>
                             <div className="text-right">
                                 <div className="text-white font-bold">{level.members} Members</div>
                                 <div className="text-xs text-slate-400">Vol: ₹{(level.volume/100000).toFixed(1)}L</div>
                             </div>
                         </div>
                         <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative z-10">
                             <div 
                                className={`h-full ${level.bar} rounded-full transition-all duration-1000 ease-out`} 
                                style={{ width: `${(level.members / 1500) * 100}%` }}
                             ></div>
                         </div>
                         {/* Hover details */}
                         <div className="absolute inset-0 bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg -z-0 pointer-events-none scale-110 blur-xl"></div>
                     </div>
                 ))}
             </div>
        </div>
    </div>
  );

  const renderPlan = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="glass-panel rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <FileSpreadsheet className="text-amber-500" />
                     15-Level Compensation Plan
                 </h3>
                 <button className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 transition-all hover:scale-105 active:scale-95">
                     <Download size={14} /> Export PDF
                 </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                    <thead className="text-[10px] uppercase bg-slate-950 text-slate-500 font-bold">
                        <tr>
                            <th className="px-4 py-3 sticky left-0 bg-slate-950 z-10">Level</th>
                            <th className="px-4 py-3">Total Investment</th>
                            <th className="px-4 py-3 text-amber-500">Profit 50%</th>
                            <th className="px-4 py-3">R-20%</th>
                            <th className="px-4 py-3">R-10%</th>
                            <th className="px-4 py-3">R-7%</th>
                            <th className="px-4 py-3">R-5%</th>
                            <th className="px-4 py-3">R-2%</th>
                            <th className="px-4 py-3">R-1%</th>
                            <th className="px-4 py-3 text-green-400">Total Profit</th>
                            <th className="px-4 py-3 text-blue-400">Total Comm</th>
                            <th className="px-4 py-3">Admin (90%)</th>
                            <th className="px-4 py-3">Deduct (10%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                        {PLAN_DATA.map((row, idx) => (
                            <tr key={idx} className={row.level === 'TOTAL' ? 'bg-amber-900/20 font-bold text-white' : 'hover:bg-slate-800/50 transition-colors'}>
                                <td className={`px-4 py-3 sticky left-0 z-10 ${row.level === 'TOTAL' ? 'bg-[#2a1b0e]' : 'bg-[#0f172a]'} border-r border-slate-800`}>{row.level}</td>
                                <td className="px-4 py-3">{row.invest}</td>
                                <td className="px-4 py-3 text-amber-500/90">{row.profit}</td>
                                <td className="px-4 py-3 text-slate-400">{row.r20}</td>
                                <td className="px-4 py-3 text-slate-400">{row.r10}</td>
                                <td className="px-4 py-3 text-slate-400">{row.r7}</td>
                                <td className="px-4 py-3 text-slate-400">{row.r5}</td>
                                <td className="px-4 py-3 text-slate-400">{row.r2}</td>
                                <td className="px-4 py-3 text-slate-400">{row.r1}</td>
                                <td className="px-4 py-3 text-green-400/90">{row.totalProfit}</td>
                                <td className="px-4 py-3 text-blue-400/90">{row.totalComm}</td>
                                <td className="px-4 py-3">{row.admin}</td>
                                <td className="px-4 py-3 text-red-400/80">{row.deduct}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass-panel p-6 rounded-xl hover:border-amber-500/30 transition-all duration-300">
                 <h3 className="font-bold text-white mb-4 border-b border-slate-700 pb-2">Royalty Achievement</h3>
                 <div className="space-y-3">
                     {ROYALTY_DATA.map((item, idx) => (
                         <div key={idx} className={`flex justify-between items-center p-2 rounded transition-all hover:scale-[1.02] ${item.isTotal ? 'bg-amber-500/20 border border-amber-500/30' : 'hover:bg-slate-800 cursor-default'}`}>
                             <div className="flex items-center gap-3">
                                 <Trophy size={16} className={item.rank === 'BRONZE' ? 'text-orange-400' : item.rank === 'SILVER' ? 'text-slate-300' : item.rank === 'GOLD' ? 'text-yellow-400' : 'text-slate-500'} />
                                 <span className={`font-bold text-sm ${item.isTotal ? 'text-amber-500' : 'text-slate-300'}`}>{item.rank}</span>
                             </div>
                             <div className="text-sm font-mono text-slate-400">
                                 {item.target && <span className="mr-4 opacity-50">{item.target}</span>}
                                 <span className={item.isTotal ? 'text-white font-bold' : ''}>{item.royalty}</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             <div className="glass-panel p-6 rounded-xl hover:border-blue-500/30 transition-all duration-300">
                 <h3 className="font-bold text-white mb-4 border-b border-slate-700 pb-2">Company Expense Allocation</h3>
                 <div className="space-y-3">
                     {EXPENSE_DATA.map((item, idx) => (
                         <div key={idx} className={`flex justify-between items-center p-2 rounded transition-all hover:scale-[1.02] ${item.isTotal ? 'bg-red-500/20 border border-red-500/30' : 'hover:bg-slate-800 cursor-default'}`}>
                             <span className={`font-bold text-sm ${item.isTotal ? 'text-red-400' : 'text-slate-300'}`}>{item.label}</span>
                             <div className="flex items-center gap-4 text-sm font-mono text-slate-400">
                                 {item.type && <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700">{item.type}</span>}
                                 <span className={item.isTotal ? 'text-white font-bold' : ''}>{item.val}</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    </div>
  );

  // RBAC Navigation Logic
  const getAllNavItems = () => {
    const items = [
        { id: 'Overview', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'partner', 'investor'] },
        { id: 'PMS', label: 'Prop Trading', icon: Activity, roles: ['admin', 'investor'] },
        { id: 'Plan', label: 'Plan Presentation', icon: FileSpreadsheet, roles: ['admin', 'partner'] },
        { id: 'Network', label: 'Network', icon: Network, roles: ['admin', 'partner'] },
        { id: 'Assistant', label: 'AI Assistant', icon: Bot, roles: ['admin', 'partner'] },
    ];
    return items.filter(item => item.roles.includes(role));
  };
  
  const navItems = getAllNavItems();

  return (
    <div className="flex h-screen bg-[#0f172a] text-white font-sans selection:bg-amber-500 selection:text-black overflow-hidden relative">
      {/* Onboarding Modal Overlay */}
      {renderOnboardingModal()}

      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col items-center lg:items-stretch transition-all duration-300 z-20">
        <div className="h-20 flex items-center justify-center border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('Overview')}>
             <Logo size="sm" />
             <span className="hidden lg:block text-xl font-bold tracking-wider font-['Rajdhani']">BRAVE</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
           {navItems.map((item) => (
             <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative hover:scale-105 active:scale-95 ${activeTab === item.id ? 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
             >
                <item.icon size={20} className={activeTab === item.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-amber-500 transition-colors'} />
                <span className="hidden lg:block font-bold text-sm">{item.label}</span>
                {item.id === 'PMS' && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)] lg:block hidden"></span>
                )}
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="bg-slate-900 rounded-xl p-3 flex items-center gap-3 mb-4 border border-slate-800 hover:border-amber-500/30 transition-colors">
             {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Profile" className="w-10 h-10 rounded-full border border-slate-700" />
             ) : (
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-slate-900 font-bold shadow-lg shrink-0">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                 </div>
             )}
             <div className="hidden lg:block overflow-hidden">
                <p className="text-sm font-bold truncate text-white">{profile?.full_name || 'User'}</p>
                <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-red-500' : role === 'partner' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                    <p className="text-xs text-slate-500 truncate capitalize">{role}</p>
                </div>
             </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all hover:scale-105 active:scale-95">
             <LogOut size={20} />
             <span className="hidden lg:block font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
         {/* Top Bar */}
         <header className="h-20 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between shrink-0">
            <h1 className="text-2xl font-bold font-['Rajdhani'] uppercase tracking-wide text-white flex items-center gap-2">
                {activeTab === 'PMS' && <Activity className="text-amber-500" />}
                {activeTab === 'Overview' && <LayoutDashboard className="text-amber-500" />}
                {activeTab === 'Plan' && <FileSpreadsheet className="text-amber-500" />}
                {activeTab === 'Network' && <Network className="text-amber-500" />}
                {activeTab === 'Assistant' && <Bot className="text-amber-500" />}
                {activeTab}
            </h1>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-400 hover:text-white transition-all hover:scale-110">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0f172a]"></span>
                </button>
                <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 hover:border-green-500/50 transition-colors">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-mono text-green-400">System Stable</span>
                </div>
            </div>
         </header>

         {/* Content Body */}
         <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth">
            {activeTab === 'Overview' && renderOverview()}
            {activeTab === 'PMS' && (role === 'admin' || role === 'investor' ? renderPMS() : <div className="text-red-400 p-10">Access Restricted</div>)}
            {activeTab === 'Plan' && (role === 'admin' || role === 'partner' ? renderPlan() : <div className="text-red-400 p-10">Access Restricted</div>)}
            {activeTab === 'Network' && (role === 'admin' || role === 'partner' ? renderNetwork() : <div className="text-red-400 p-10">Access Restricted</div>)}
            {activeTab === 'Assistant' && (role === 'admin' || role === 'partner' ? renderAIAssistant() : <div className="text-red-400 p-10">Access Restricted</div>)}
         </div>
      </main>
    </div>
  );
};