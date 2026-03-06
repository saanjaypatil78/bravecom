"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown, Monitor, Smartphone, Maximize, Play, Pause, List } from "lucide-react";

type Screen = {
    id: string;
    name: string;
    category: string;
    htmlUrl: string;
    imgUrl: string | null;
};

type FlowData = {
    screens: Screen[];
    flows: Record<string, Screen[]>;
};

export default function StitchLoopViewer() {
    const [data, setData] = useState<FlowData | null>(null);
    const [currentFlow, setCurrentFlow] = useState<string>("All Screens");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        fetch('/stitch_screens_list.json')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .then(text => {
                if (!text) return;
                const jsonData: FlowData = JSON.parse(text);
                // Add "All Screens" to the flows map
                jsonData.flows["All Screens"] = jsonData.screens;
                setData(jsonData);
            })
            .catch(err => console.error("Failed to load screens map", err));
    }, []);

    const activeScreens = data?.flows[currentFlow] || [];

    const handleNext = useCallback(() => {
        if (activeScreens.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % activeScreens.length);
    }, [activeScreens.length]);

    const handlePrev = useCallback(() => {
        if (activeScreens.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + activeScreens.length) % activeScreens.length);
    }, [activeScreens.length]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && activeScreens.length > 0) {
            interval = setInterval(() => {
                handleNext();
            }, 6000); // Cinematic duration
        }
        return () => clearInterval(interval);
    }, [isPlaying, activeScreens, handleNext]);

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen bg-black text-white">Loading Ecosystem Loop...</div>;
    }

    if (activeScreens.length === 0) {
        return <div className="flex items-center justify-center min-h-screen bg-black text-white">No screens found in this flow.</div>;
    }

    const currentScreen = activeScreens[currentIndex];

    // Handle switching flows
    const selectFlow = (flowName: string) => {
        setCurrentFlow(flowName);
        setCurrentIndex(0); // Reset index when switching flows
        setShowSidebar(false);
    };

    return (
        <div className={`flex flex-col h-screen w-full overflow-hidden bg-black text-white font-sans transition-all duration-500`}>

            {/* Sidebar Flow Navigator */}
            <div className={`absolute top-0 right-0 h-full w-80 bg-zinc-900/95 backdrop-blur-3xl border-l border-white/10 z-[60] transform transition-transform duration-500 shadow-2xl ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent mb-6">Strategic Flows</h2>
                    <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.keys(data.flows).map(flow => (
                            <button
                                key={flow}
                                onClick={() => selectFlow(flow)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 border ${currentFlow === flow ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 font-medium tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{flow}</span>
                                    <span className="text-xs opacity-50 bg-black/50 px-2 py-1 rounded-md">{data.flows[flow].length}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Bar Navigation - Glassmorphism */}
            <div className={`absolute top-0 w-full z-50 flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border-b border-white/10 ${isFullscreen ? 'opacity-0 h-0 p-0 overflow-hidden' : 'opacity-100'} transition-all duration-300`}>
                <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                        <Monitor size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-300 via-amber-200 to-orange-400 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2">
                            Sovereign Ecosystem Viewer
                        </h1>
                        <p className="text-xs text-white/60 capitalize tracking-wide">
                            {currentScreen.name} <span className="text-amber-500/80">({currentIndex + 1} / {activeScreens.length})</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Play/Pause */}
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/5 transition-all shadow-lg text-amber-400 hover:text-amber-300">
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>

                    {/* Device Toggle */}
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-md">
                        <button
                            onClick={() => setDeviceView("desktop")}
                            className={`p-2 rounded-lg transition-all duration-300 ${deviceView === "desktop" ? "bg-white/20 text-amber-400 shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "text-white/50 hover:text-white/80"}`}
                        >
                            <Monitor size={16} />
                        </button>
                        <button
                            onClick={() => setDeviceView("mobile")}
                            className={`p-2 rounded-lg transition-all duration-300 ${deviceView === "mobile" ? "bg-white/20 text-amber-400 shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "text-white/50 hover:text-white/80"}`}
                        >
                            <Smartphone size={16} />
                        </button>
                    </div>

                    {/* Flow Selector Toggle */}
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className={`px-4 py-2 text-sm font-medium rounded-xl border backdrop-blur-md transition-all flex items-center gap-2 ${showSidebar ? "bg-amber-500/20 border-amber-500/50 text-amber-400" : "bg-white/5 border-white/10 text-white/70 hover:text-amber-400 hover:bg-white/15"}`}
                    >
                        <List size={16} />
                        <span className="max-w-[120px] truncate">{currentFlow}</span>
                    </button>

                    {/* Fullscreen Toggle */}
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/15 rounded-xl backdrop-blur-md transition-all text-white/70 hover:text-amber-400">
                        <Maximize size={16} />
                    </button>
                </div>
            </div>

            {/* Main Loop Area - Cinematic Parallax */}
            <div className="relative flex-1 flex items-center w-full justify-center bg-gradient-to-b from-zinc-950 via-black to-zinc-950 overflow-hidden group perspective-[1000px]">

                {/* Animated Background Glow */}
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none transition-all duration-1000">
                    <div className="w-[80vw] h-[80vw] bg-amber-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
                </div>

                {/* Navigation Overlays */}
                <button
                    onClick={handlePrev}
                    className="absolute left-6 z-50 p-4 rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white/15 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0"
                >
                    <ChevronUp size={28} className="-rotate-90 text-amber-500" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-6 z-50 p-4 rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white/15 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0"
                >
                    <ChevronDown size={28} className="-rotate-90 text-amber-500" />
                </button>

                {/* The Frame Wrapper with Cinematic Transform */}
                <div
                    className={`relative z-10 transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] cinematic-entrance ${deviceView === "mobile" ? "pt-20" : "pt-0"} ${showSidebar ? '-translate-x-40' : 'translate-x-0'}`}
                    style={{
                        width: deviceView === "desktop" ? "100%" : "375px",
                        height: deviceView === "desktop" ? "100%" : "812px",
                        transformStyle: "preserve-3d"
                    }}
                    key={currentScreen.id + "-" + currentFlow}
                >
                    {/* Glass Mobile Frame or Full Desktop */}
                    <div className={`w-full h-full relative overflow-hidden transition-all duration-700 ${deviceView === "mobile" ? "rounded-[45px] p-2 bg-gradient-to-b from-white/10 to-white/5 border border-white/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),auto_0_0_100px_rgba(245,158,11,0.1)]" : ""}`}>
                        {deviceView === "mobile" && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20 flex items-center justify-end px-4">
                                <div className="w-2 h-2 rounded-full bg-white/10 absolute right-4"></div>
                            </div>
                        )}
                        <iframe
                            src={currentScreen.htmlUrl}
                            className={`w-full h-full border-none bg-zinc-950 ${deviceView === "mobile" ? "rounded-[35px]" : ""}`}
                            title={currentScreen.name}
                            sandbox="allow-scripts allow-same-origin"
                        />
                        {/* Cinematic overlay reflection */}
                        {deviceView === "desktop" && <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent z-20 mix-blend-screen"></div>}
                    </div>
                </div>

                {/* CSS for Cinematic entrance mapping */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes cinematicSlide {
            0% { opacity: 0; transform: translateZ(-200px) rotateY(10deg) translateX(50px); filter: blur(10px) brightness(0.5); }
            100% { opacity: 1; transform: translateZ(0px) rotateY(0deg) translateX(0px); filter: blur(0px) brightness(1); }
          }
          .cinematic-entrance {
            animation: cinematicSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.5); }
        `}} />
            </div>

            {/* Glowing Scrubber Progress */}
            <div className="h-1.5 w-full bg-white/5 absolute bottom-0 z-50 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-orange-600 via-amber-400 to-yellow-300 transition-all duration-700 ease-out relative shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                    style={{ width: `${((currentIndex + 1) / activeScreens.length) * 100}%` }}
                >
                    {/* Progress Highlight */}
                    <div className="absolute right-0 top-0 w-8 h-full bg-white/60 blur-[2px]"></div>
                </div>
            </div>

        </div>
    );
}
