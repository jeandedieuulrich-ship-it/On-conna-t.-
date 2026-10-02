import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, SwitchCamera, AlertCircle, Smartphone } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  mode: 'selfie' | 'document';
  onCapture: (base64Image: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  mode,
  onCapture,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    mode === 'selfie' ? 'user' : 'environment'
  );
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async (facing: 'user' | 'environment') => {
    stopCamera();
    setStreamError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Caméra non disponible dans ce navigateur. Utilisez le bouton appareil photo ci-dessous.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setStreamError(
        'Accès direct caméra restreint. Vous pouvez prendre la photo directement avec l\'appareil photo de votre téléphone via le bouton ci-dessous.'
      );
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const handleCaptureSnapshot = () => {
    if (countdown !== null) return;

    // Optional 3-second countdown for selfies
    if (mode === 'selfie') {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            takeSnapshotNow();
            return null;
          }
          return prev - 1;
        });
      }, 700);
    } else {
      takeSnapshotNow();
    }
  };

  const takeSnapshotNow = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontal if selfie for natural mirror effect
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleNativeFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCapturedImage(dataUrl);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Body */}
        <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            /* Captured Snapshot Preview */
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Capture"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <Check className="w-3.5 h-3.5" />
                <span>Photo capturée</span>
              </div>
            </div>
          ) : isCameraActive ? (
            /* Live Camera Stream */
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder Guidelines */}
              {mode === 'selfie' ? (
                /* Oval Frame Guide for Selfie */
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-60 border-2 border-dashed border-emerald-400/80 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex items-end justify-center pb-4">
                    <span className="text-[10px] font-bold text-emerald-300 bg-slate-950/70 px-2 py-0.5 rounded-md">
                      Placez votre visage au centre
                    </span>
                  </div>
                </div>
              ) : (
                /* Card Frame Guide for ID */
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-68 h-44 border-2 border-dashed border-amber-400/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex items-end justify-center pb-2">
                    <span className="text-[10px] font-bold text-amber-300 bg-slate-950/70 px-2 py-0.5 rounded-md">
                      Cadrez la pièce d'identité recto
                    </span>
                  </div>
                </div>
              )}

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-7xl font-black text-white animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Switch camera toggle */}
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-sm rounded-full text-white hover:bg-slate-800 transition-colors cursor-pointer border border-white/20"
                title="Changer de caméra (Avant / Arrière)"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Fallback / Permission restricted screen */
            <div className="p-6 text-center space-y-4 max-w-sm">
              <div className="w-14 h-14 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-white">
                  Prise de vue directe au téléphone
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Appuyez sur le bouton ci-dessous pour ouvrir directement l'appareil photo de votre smartphone et prendre votre {mode === 'selfie' ? 'selfie' : 'pièce d\'identité'}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Ouvrir l'appareil photo du téléphone</span>
              </button>
            </div>
          )}
        </div>

        {/* Hidden Canvas & Native Camera Input */}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={mode === 'selfie' ? 'user' : 'environment'}
          onChange={handleNativeFileInput}
          className="hidden"
        />

        {/* Action Controls Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reprendre</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Valider cette photo</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-400 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer underline"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Appareil photo natif</span>
              </button>

              {isCameraActive && (
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Prendre la photo maintenant</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
