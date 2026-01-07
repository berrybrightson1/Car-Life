"use client";

import { useState, useEffect } from "react";
import { Mic, Sparkles, StopCircle, RefreshCw, Wand2, MicOff, Loader2 } from "lucide-react";

interface DescriptionGeneratorProps {
    value: string;
    onChange: (value: string) => void;
    carName: string; // e.g. "Bentley Flying Spur"
}

export default function DescriptionGenerator({ value, onChange, carName }: DescriptionGeneratorProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [recognition, setRecognition] = useState<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const reco = new SpeechRecognition();
                reco.continuous = true;
                reco.interimResults = true;
                reco.lang = "en-US";

                reco.onresult = (event: any) => {
                    let interimTranscript = "";
                    let finalTranscript = "";

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    if (finalTranscript) {
                        setTranscript(prev => prev + " " + finalTranscript);
                    }
                };

                setRecognition(reco);
            }
        }
    }, []);

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
        }
        setIsRecording(false);
    };

    const confirmTranscript = () => {
        if (transcript) {
            const currentDesc = value ? value + "\n" : "";
            onChange(currentDesc + transcript);
            setTranscript("");
            stopRecording();
        }
    };

    const toggleListening = () => {
        if (!recognition) {
            alert("Voice recognition is not supported in this browser.");
            return;
        }

        if (isRecording) {
            stopRecording();
        } else {
            recognition.start();
            setIsRecording(true);
            setTranscript("");
        }
    };

    const generateDescription = async () => {
        const textToUse = transcript || value;
        if (!textToUse) {
            // alert("Please record some keywords or write a draft first!");
            // Allow generating even without context for demo
        }

        setIsGenerating(true);

        // TODO: Replace this with actual Grok/AI API call
        // Simulation for now
        setTimeout(() => {
            const keywords = textToUse || "luxury, speed, comfort";
            const aiDescription = `Experience the epitome of luxury with this ${carName}. \n\nKey Highlights:\n• ${keywords.trim().replace(/ /g, " • ")}\n\nThis vehicle combines pristine condition with unmatched performance, making it the perfect choice for the discerning buyer. Don't miss out on this verified listing!`;

            onChange(aiDescription);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-500">Description</label>
                {(isRecording || transcript) && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 max-w-[70%]">
                        <span className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-full flex items-center gap-2 font-bold animate-pulse border border-red-100 shadow-sm truncate">
                            <span className="w-2 h-2 bg-red-600 rounded-full shrink-0" />
                            {transcript ? `"${transcript.substring(transcript.length - 30)}..."` : "Listening..."}
                        </span>
                    </div>
                )}
            </div>

            <textarea
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32 resize-none leading-relaxed text-sm"
                placeholder="Describe the car manually or use Voice Input..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />

            {transcript && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Transcript Preview:</p>
                    <p className="text-sm text-gray-700 italic">"{transcript}"</p>
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={confirmTranscript}
                            type="button"
                            className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                        >
                            Confirm & Add Text
                        </button>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={toggleListening}
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all shadow-sm ${isRecording
                        ? 'bg-red-50 border-red-500 text-red-600 animate-pulse'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                    <span className="font-bold text-sm whitespace-nowrap">
                        {isRecording ? "Stop" : "Voice Input"}
                    </span>
                </button>

                <button
                    onClick={generateDescription}
                    disabled={isGenerating || !carName}
                    type="button"
                    className="flex-[2] flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span className="text-sm whitespace-nowrap">Generating...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            <span className="text-sm whitespace-nowrap truncate">Generate (AI)</span>
                        </>
                    )}
                </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center">
                *Use Voice Input to dictate description.
            </p>
        </div>
    );
}
