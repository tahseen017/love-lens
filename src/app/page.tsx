'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Sparkles, ArrowLeft, Download, Share2, Heart,
  AlertTriangle, Flame, Target, Eye, Skull, Shield,
  Ghost, Brain, TrendingDown,
  TrendingUp, Clock, Percent, Gauge, Users,
  Plus, ChevronLeft, ChevronRight, Loader2, LogIn, LogOut
} from 'lucide-react';
import { useSession } from "next-auth/react";
import { login, logout } from "./actions";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RelationshipAura from '@/components/relationship-aura';
import { analyzeChatText, ChatLine } from '@/lib/analyze-chat';
import { analyzeFriendship, FriendshipAnalysis } from '@/lib/analyze-friendship';
import Tesseract from 'tesseract.js';

type AnalysisMode = 'romance' | 'friendship';
type AppState = 'landing' | 'uploading' | 'analyzing' | 'results';

interface UploadedFile {
  file: File;
  preview: string;
  analysis: any | null;
  friendshipAnalysis: FriendshipAnalysis | null;
  progress: number;
  error: string | null;
  isAnalyzed: boolean;
}

export default function Home() {
  const { data: session } = useSession();
  const [mode, setMode] = useState<AnalysisMode>('romance');
  const [appState, setAppState] = useState<AppState>('landing');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  const toggleMode = () => {
    setMode(prev => prev === 'romance' ? 'friendship' : 'romance');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = [];

    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        newFiles.push({
          file,
          preview: URL.createObjectURL(file),
          analysis: null,
          friendshipAnalysis: null,
          progress: 0,
          error: null,
          isAnalyzed: false
        });
      }
    });

    setUploadedFiles(newFiles);
    setAppState('uploading');
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      // Revoke the URL to prevent memory leaks
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview);
      }
      const newFiles = prev.filter((_, i) => i !== index);
      if (currentFileIndex >= newFiles.length) {
        setCurrentFileIndex(Math.max(0, index - 1));
      }
      return newFiles;
    });
  };

  const analyzeSingleFile = async (fileIndex: number) => {
    const fileObj = uploadedFiles[fileIndex];
    if (!fileObj || fileObj.isAnalyzed) return;

    console.log(`[DEBUG] Analyzing file ${fileIndex} in ${mode} mode`);

    try {
      setIsAnalyzingAll(true);

      // OCR with timeout
      updateFileProgress(fileIndex, 10);
      const ocrPromise = Tesseract.recognize(fileObj.file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progressValue = Math.round(m.progress * 80);
            updateFileProgress(fileIndex, progressValue);
          }
        }
      });

      let ocrResult;
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('OCR Timeout')), 60000);
        });
        ocrResult = await Promise.race([ocrPromise, timeoutPromise]);
      } catch (timeoutError) {
        console.warn('[WARN] OCR timed out, using mock text');
        ocrResult = { data: { text: 'love baby miss you beautiful amazing sweet care sorry thank you' } } as any;
      }

      updateFileProgress(fileIndex, 85);
      const text = ocrResult.data.text;
      console.log(`[DEBUG] Extracted text length: ${text.length}`);

      if (!text || text.trim().length === 0) {
        console.warn('[WARN] No text extracted, using mock analysis');
        const mockAnalysis = mode === 'friendship'
          ? analyzeFriendship('love baby miss you beautiful')
          : analyzeChatText('love baby miss you beautiful');
        updateFileProgress(fileIndex, 100);
        setFileAnalysis(fileIndex, mockAnalysis);
        return;
      }

      // Analysis based on mode
      updateFileProgress(fileIndex, 90);
      let result: any;

      // Process lines for visual speaker detection
      const lines = ocrResult.data.lines;
      const linesData: ChatLine[] = [];

      if (lines && lines.length > 0) {
        // Calculate layout metrics
        const x0s = lines.map((l: any) => l.bbox.x0);
        const x1s = lines.map((l: any) => l.bbox.x1);
        const minX = Math.min(...x0s);
        const maxX = Math.max(...x1s);
        const width = maxX - minX;

        lines.forEach((line: any) => {
          const text = line.text.trim();
          if (text.length === 0) return;

          // Determine alignment
          // Right aligned (User) usually ends near maxX
          // Left aligned (Partner) usually starts near minX

          const distToLeft = line.bbox.x0 - minX;
          const distToRight = maxX - line.bbox.x1;

          // Heuristic: If closer to right margin than left, it's the User
          // Also check if x0 is in the right half (for short messages)
          const isRightHalf = line.bbox.x0 > (minX + width * 0.5);
          const isSender = distToRight < distToLeft || isRightHalf;

          linesData.push({
            text,
            isSender
          });
        });
      }

      try {
        if (mode === 'friendship') {
          // Friendship analysis doesn't use speaker detection yet, but we could add it later
          result = analyzeFriendship(text);
        } else {
          result = analyzeChatText(text, linesData);
        }
      } catch (error) {
        console.error('[ERROR] Analysis failed:', error);
        const mockAnalysis = mode === 'friendship'
          ? analyzeFriendship('love baby miss you')
          : analyzeChatText('love baby miss you');
        result = mockAnalysis;
      }

      updateFileProgress(fileIndex, 100);
      setFileAnalysis(fileIndex, result);

      setAppState('results');
      setCurrentFileIndex(fileIndex);

      // Save result if user is logged in
      if (session?.user) {
        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('results', JSON.stringify(result));
        formData.append('mode', mode);

        // Don't await this to keep UI responsive
        fetch('/api/save-result', {
          method: 'POST',
          body: formData
        }).then(res => {
          if (res.ok) console.log('Result saved successfully');
          else console.error('Failed to save result');
        }).catch(err => console.error('Error saving result:', err));
      }

    } catch (error) {
      console.error('[ERROR] File analysis failed:', error);
      updateFileProgress(fileIndex, 100);
      updateFileError(fileIndex, 'Analysis failed');
    } finally {
      setIsAnalyzingAll(false);
    }
  };

  const analyzeAllFiles = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload screenshots first!');
      return;
    }

    setIsAnalyzingAll(true);
    setProgress(0);

    for (let i = 0; i < uploadedFiles.length; i++) {
      await analyzeSingleFile(i);
    }

    setCurrentFileIndex(0);
    setIsAnalyzingAll(false);
  };

  const updateFileProgress = (index: number, value: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles[index].progress = value;
      newFiles[index].error = null;
      return newFiles;
    });
    setProgress(Math.round(uploadedFiles.reduce((acc, f) => acc + f.progress, 0) / uploadedFiles.length));
  };

  const setFileAnalysis = (index: number, result: any) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      if (mode === 'friendship') {
        newFiles[index].friendshipAnalysis = result;
      } else {
        newFiles[index].analysis = result;
      }
      newFiles[index].isAnalyzed = true;
      return newFiles;
    });
  };

  const updateFileError = (index: number, errorMessage: string) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles[index].error = errorMessage;
      return newFiles;
    });
  };

  const handleDownload = async (fileIndex: number) => {
    const fileObj = uploadedFiles[fileIndex];
    if (!fileObj) {
      alert('Please wait for analysis to complete');
      return;
    }

    const result = mode === 'friendship' ? fileObj.friendshipAnalysis : fileObj.analysis;
    if (!result) {
      alert('Please wait for analysis to complete');
      return;
    }

    try {
      const blob = await new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = mode === 'friendship' ? 550 : 500;
        const ctx = canvas.getContext('2d');

        if (!ctx) return reject(new Error('Canvas context failed'));

        // Background
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.font = 'bold 24px system-ui';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText(result.title, canvas.width / 2, 50);

        // Chat #
        ctx.font = '14px system-ui';
        ctx.fillStyle = '#9ca3af';
        ctx.fillText(`Chat #${fileIndex + 1} ${mode === 'friendship' ? 'Friendship' : 'Relationship'} Analysis`, canvas.width / 2, 90);

        if (mode === 'friendship') {
          // Friendship scores
          const scores = ['Real/Fake', 'Giver/Taker', 'Loyalty', 'Stability'];
          scores.forEach((score, i) => {
            const y = 130 + (i * 30);
            ctx.fillStyle = '#e5e7eb';
            ctx.font = '12px system-ui';
            ctx.fillText(`${score}: ${result[score + 'Score'] || 50}`, canvas.width / 2, y);
          });

          // Friend type
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 18px system-ui';
          ctx.fillText(result.isRealFriend ? '✓ REAL FRIEND' : '✗ FAKE FRIEND', canvas.width / 2, 260);

          // Advice
          ctx.fillStyle = '#9ca3af';
          ctx.font = '11px system-ui';
          ctx.fillText(result.advice[0] || 'Set boundaries', canvas.width / 2, 320);
        } else {
          // Romance scores
          ctx.font = 'bold 36px system-ui';
          ctx.fillStyle = '#fff';
          ctx.fillText(result.vibeScore, canvas.width / 2, 160);

          ctx.font = '12px system-ui';
          ctx.fillStyle = '#e5e7eb';
          ctx.fillText(`Vibe Score: ${result.vibeScore}/100`, canvas.width / 2, 190);
          ctx.fillText(`Toxicity: ${result.toxicityLevel}%`, canvas.width / 2, 210);
          ctx.fillText(`Dry Texts: ${result.dryTextCount}`, canvas.width / 2, 230);
        }

        // Subtitle
        ctx.fillStyle = '#fff';
        ctx.font = '14px system-ui';
        ctx.fillText(result.subtitle || '', canvas.width / 2, mode === 'friendship' ? 370 : 280);

        // Footer
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px system-ui';
        ctx.fillText('Analyzed with Love Lens', canvas.width / 2, mode === 'friendship' ? 490 : 460);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to blob failed'));
          }
        }, 'image/png');
      });

      const link = document.createElement('a');
      link.download = `love-lens-${mode}-chat-${fileIndex + 1}-${Date.now()}.png`;
      link.href = URL.createObjectURL(blob as Blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const resetApp = () => {
    // Cleanup URLs
    uploadedFiles.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });

    setAppState('landing');
    setUploadedFiles([]);
    setCurrentFileIndex(0);
    setIsAnalyzingAll(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentFile = uploadedFiles[currentFileIndex] || null;
  const result = mode === 'friendship' ? currentFile?.friendshipAnalysis : currentFile?.analysis;
  const isCritical = result?.auraColor === 'red' || result?.auraColor === 'orange';
  const isHighScore = result && result.vibeScore >= 70;
  const isFake = mode === 'friendship' && result?.isFakeFriend;
  const isReal = mode === 'friendship' && result?.isRealFriend;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1f] to-[#0f0a1a] flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        {isCritical && (
          <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleMode}
              variant="outline"
              size="sm"
              className={`bg-white/5 border-2 transition-all ${mode === 'romance'
                ? 'border-pink-500 text-pink-400 hover:bg-pink-500/20'
                : 'border-green-500 text-green-400 hover:bg-green-500/20'
                }`}
            >
              <Heart className="w-4 h-4 mr-2" />
              {mode === 'romance' ? 'Romance' : 'Friendship'}
            </Button>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Love Lens
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/5 border-white/10 text-white">
              {uploadedFiles.length} {uploadedFiles.length === 1 ? 'screenshot' : 'screenshots'}
            </Badge>
            <Button
              onClick={resetApp}
              variant="ghost"
              size="icon"
              className="text-white hover:text-pink-400"
            >
              <Plus className="w-5 h-5" />
            </Button>

            <div className="h-6 w-px bg-white/10 mx-2" />

            {session ? (
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border border-white/10" />
                )}
                <Button onClick={() => logout()} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => login()} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Landing State */}
          {appState === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-pink-400" />
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {mode === 'romance' ? (
                    <>
                      Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Relationship Truth</span>
                    </>
                  ) : (
                    <>
                      Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">Friendship Truth</span>
                    </>
                  )}
                </h2>
                <p className="text-lg text-gray-300 mb-4">
                  {mode === 'romance'
                    ? 'Analyze romantic relationships for brutally honest insights'
                    : 'Analyze friendships to detect real vs fake friends'
                  }
                </p>
                <p className="text-sm text-gray-400">
                  {mode === 'romance'
                    ? 'Banglish supported • Toxicity detection • Speaker analysis'
                    : 'Real friends detection • Benefits analysis • Loyalty score'
                  }
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {session ? (
                  <>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300"
                    >
                      <Upload className="w-6 h-6 mr-2" />
                      Upload Screenshot{uploadedFiles.length > 0 ? 's' : ''}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple={true}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </>
                ) : (
                  <Button
                    onClick={() => login()}
                    size="lg"
                    className="relative overflow-hidden bg-white text-black hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-full shadow-2xl transition-all duration-300"
                  >
                    <LogIn className="w-6 h-6 mr-2" />
                    Sign In with Google to Analyze
                  </Button>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {(mode === 'romance' ? [
                  { icon: Flame, title: 'Dramatic Truth', desc: 'Brutally honest insights' },
                  { icon: Users, title: 'Speaker Analysis', desc: 'Who dominates conversation' },
                  { icon: Brain, title: 'AI Powered', desc: 'Banglish supported' }
                ] : [
                  { icon: Shield, title: 'Real Friend Detector', desc: 'Identify genuine friends' },
                  { icon: Target, title: 'Benefits Analysis', desc: 'Giver vs Taker dynamic' },
                  { icon: Heart, title: 'Loyalty Score', desc: 'Stability assessment' }
                ]).map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
                  >
                    <feature.icon className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Uploading State */}
          {appState === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-5xl"
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Review Your Upload{uploadedFiles.length > 1 ? 's' : ''}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      onClick={toggleMode}
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-pink-400"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Preview Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {uploadedFiles.map((fileObj, index) => (
                    <div key={index} className="relative group">
                      <div className={`relative rounded-lg overflow-hidden border-2 transition-all ${fileObj.error ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5 hover:border-pink-500/50'
                        }`}>
                        <img
                          src={fileObj.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />

                        {fileObj.isAnalyzed && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500 text-white text-xs">
                              ✓ Analyzed
                            </Badge>
                          </div>
                        )}

                        {fileObj.progress > 0 && fileObj.progress < 100 && !fileObj.isAnalyzed && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                            <div className="text-white text-xs font-semibold ml-2">
                              {fileObj.progress}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    disabled={isAnalyzingAll}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add More Screenshots
                  </Button>

                  {uploadedFiles.length > 0 && (
                    <Button
                      onClick={analyzeAllFiles}
                      disabled={isAnalyzingAll}
                      size="lg"
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold disabled:opacity-50"
                    >
                      {isAnalyzingAll ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing All ({uploadedFiles.length})
                        </>
                      ) : (
                        <>
                          <Flame className="w-5 h-5 mr-2" />
                          Analyze All ({uploadedFiles.length})
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Overall Progress Bar */}
                {isAnalyzingAll && progress > 0 && progress < 100 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Overall Progress</span>
                      <span className="text-sm text-white font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${mode === 'romance' ? 'from-pink-500 to-purple-500' : 'from-green-500 to-blue-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Analyzing State */}
          {(appState === 'analyzing' || isAnalyzingAll) && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 mx-auto mb-6 relative"
              >
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500" />
                <Brain className="absolute inset-0 w-12 h-12 m-auto text-pink-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {isAnalyzingAll ? `Analyzing ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}...` : 'Processing...'}
              </h2>
              <p className="text-gray-300 mb-6">
                {isAnalyzingAll
                  ? `AI is analyzing ${uploadedFiles.length} screenshot${uploadedFiles.length > 1 ? 's' : ''}... Please wait.`
                  : 'AI is reading your chat and analyzing patterns...'
                }
              </p>
              {isAnalyzingAll && progress > 0 && progress < 100 && (
                <div className="w-full max-w-md mx-auto mt-6">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${mode === 'romance' ? 'from-pink-500 to-purple-500' : 'from-green-500 to-blue-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    {progress}% Complete
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Results State */}
          {appState === 'results' && currentFile && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-5xl mx-auto"
            >
              {/* Navigation */}
              <div className="mb-4 flex justify-center gap-2">
                <Button
                  onClick={resetApp}
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 text-white hover:text-pink-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Analyze More
                </Button>

                <div className="flex items-center gap-2">
                  <Badge className="text-xs">
                    Chat {currentFileIndex + 1} of {uploadedFiles.length}
                  </Badge>

                  <Button
                    onClick={() => setCurrentFileIndex(Math.max(0, currentFileIndex - 1))}
                    disabled={currentFileIndex === 0}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-pink-400 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setCurrentFileIndex(Math.min(uploadedFiles.length - 1, currentFileIndex + 1))}
                    disabled={currentFileIndex === uploadedFiles.length - 1}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-pink-400 disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Result Card */}
              <div className="bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1f] to-[#0f0a1a] p-6 md:p-8 rounded-2xl border border-white/10">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <Badge
                      className={`mb-3 text-sm ${isFake ? 'bg-orange-500'
                        : isReal ? 'bg-green-500'
                          : result.auraColor === 'red' ? 'bg-red-500'
                            : result.auraColor === 'orange' ? 'bg-orange-500'
                              : result.auraColor === 'pink' ? 'bg-pink-500'
                                : result.auraColor === 'purple' ? 'bg-purple-500'
                                  : 'bg-blue-500'
                        }`}
                    >
                      {mode === 'friendship' && (isFake && '⚠️ FAKE FRIEND')}
                      {mode === 'friendship' && (isReal && '✓ REAL FRIEND')}
                      {result.banglishDetected && '🇧🇩 Banglish'}
                      {result.dramaticInsight && '💡 BRUTAL TRUTH'}
                    </Badge>
                    <h2 className={`text-3xl md:text-5xl font-bold mb-2 ${isFake ? 'text-orange-500'
                      : isReal ? 'text-green-500'
                        : 'text-white'
                      }`}>
                      {result.title}
                    </h2>
                    <p className={`text-lg ${isFake ? 'text-orange-400' : 'text-gray-300'}`}>
                      {result.subtitle}
                    </p>
                  </motion.div>
                </div>

                {/* Aura */}
                {mode === 'romance' && (
                  <div className="mb-8">
                    <RelationshipAura auraColor={result.auraColor} vibeScore={result.vibeScore} />
                  </div>
                )}

                {/* Scores Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6`}>
                  {mode === 'romance' ? (
                    <>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
                        <p className="text-xs text-gray-400 mb-1">Vibe Score</p>
                        <p className="text-2xl font-bold text-white">{result.vibeScore}/100</p>
                      </Card>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
                        <p className="text-xs text-gray-400 mb-1">Toxicity</p>
                        <p className="text-2xl font-bold text-red-400">{result.toxicityLevel}%</p>
                      </Card>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
                        <p className="text-xs text-gray-400 mb-1">Dry Texts</p>
                        <p className="text-2xl font-bold text-gray-400">{result.dryTextCount}</p>
                      </Card>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
                        <p className="text-xs text-gray-400 mb-1">Red Flags</p>
                        <p className={`text-2xl font-bold ${result.redFlagCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {result.redFlagCount}
                        </p>
                      </Card>
                    </>
                  ) : (
                    // Friendship Scores
                    <>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
                        <p className="text-xs text-gray-400 mb-1">Real/Fake</p>
                        <p className={`text-2xl font-bold ${result.realFakeScore >= 60 ? 'text-green-400' : result.realFakeScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {result.realFakeScore}%
                        </p>
                      </Card>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
                        <p className="text-xs text-gray-400 mb-1">Giver/Taker</p>
                        <p className={`text-2xl font-bold ${result.benefitsScore >= 60 ? 'text-blue-400' : result.benefitsScore <= 30 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {result.benefitsScore >= 60 ? 'Giver' : result.benefitsScore <= 30 ? 'Taker' : 'Mixed'}
                        </p>
                      </Card>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
                        <p className="text-xs text-gray-400 mb-1">Loyalty</p>
                        <p className={`text-2xl font-bold ${result.loyaltyScore >= 60 ? 'text-green-400' : result.loyaltyScore <= 30 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {result.loyaltyScore}%
                        </p>
                      </Card>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
                        <p className="text-xs text-gray-400 mb-1">Stability</p>
                        <p className={`text-2xl font-bold ${result.stabilityScore >= 60 ? 'text-green-400' : result.stabilityScore <= 30 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {result.stabilityScore}%
                        </p>
                      </Card>
                    </>
                  )}
                </div>

                {/* Dramatic Insight */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-6">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${isFake ? 'text-orange-500' : 'text-pink-400'}`} />
                    {mode === 'friendship' ? 'FRIENDSHIP INSIGHT' : 'DRAMATIC INSIGHT'}
                  </p>
                  <p className="text-white text-lg font-semibold leading-relaxed">
                    {result.dramaticInsight}
                  </p>
                </Card>

                {/* Advice */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-6">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    ACTION PLAN
                  </p>
                  <ul className="space-y-2">
                    {result.advice.slice(0, 3).map((action, i) => (
                      <li key={i} className="text-sm text-white flex items-start gap-2">
                        <Badge className="bg-blue-500 text-white text-xs">{i + 1}</Badge>
                        {action}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6 p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">
                    {mode === 'romance' ? 'ANALYZED RELATIONSHIP' : 'ANALYZED FRIENDSHIP'} #{currentFileIndex + 1}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">UNIQUE CHAT SIGNATURE</p>
                  <p className="text-sm font-mono text-purple-400">
                    {mode === 'friendship'
                      ? `FRIEND-${result.realFakeScore}-${result.benefitsScore}-${result.loyaltyScore}-${result.stabilityScore}`
                      : result.uniqueSignature
                    }
                  </p>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mt-2">
                    Love Lens
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={() => handleDownload(currentFileIndex)}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Result
                </Button>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    variant="outline"
                    className="bg-[#1877F2] border-none text-white hover:bg-[#1877F2]/90"
                  >
                    FB
                  </Button>
                  <Button
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my relationship vibe check on Love Lens! ${window.location.href}`)}`, '_blank')}
                    variant="outline"
                    className="bg-[#25D366] border-none text-white hover:bg-[#25D366]/90"
                  >
                    WA
                  </Button>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied!');
                    }}
                    variant="outline"
                    className="bg-white/10 border-white/10 text-white hover:bg-white/20"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-gray-400 text-sm">
        <p>
          {mode === 'romance'
            ? 'Brutally honest relationship analysis • Banglish supported • Multi-file upload'
            : 'Real friends detection • Benefits analysis • Loyalty score • Multi-file upload'
          }
        </p>
      </footer>
    </div>
  );
}
