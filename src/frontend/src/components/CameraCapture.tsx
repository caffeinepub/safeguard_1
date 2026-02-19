import { useCamera } from '../camera/useCamera';
import NeumorphicButton from './NeumorphicButton';
import { Camera, SwitchCamera, X } from 'lucide-react';
import { useEffect } from 'react';

interface CameraCaptureProps {
  itemName: string;
  onPhotoCapture: (itemName: string, photo: File) => void;
  onClose: () => void;
  existingPhoto?: File;
}

export default function CameraCapture({ itemName, onPhotoCapture, onClose, existingPhoto }: CameraCaptureProps) {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    quality: 0.9,
    format: 'image/jpeg'
  });

  useEffect(() => {
    // Auto-start camera when component mounts
    if (isSupported !== false && !existingPhoto) {
      startCamera();
    }

    return () => {
      if (isActive) {
        stopCamera();
      }
    };
  }, []);

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      onPhotoCapture(itemName, photo);
      await stopCamera();
    }
  };

  const handleClose = async () => {
    if (isActive) {
      await stopCamera();
    }
    onClose();
  };

  if (isSupported === false) {
    return (
      <div className="neumorphic-inset rounded-xl p-4 text-center">
        <p className="text-neumorphic-text-muted text-sm">
          Camera not supported on this device
        </p>
        <NeumorphicButton
          onClick={onClose}
          variant="secondary"
          className="mt-3"
        >
          Close
        </NeumorphicButton>
      </div>
    );
  }

  return (
    <div className="neumorphic-inset rounded-xl p-4">
      <div className="space-y-3">
        <div className="relative w-full" style={{ minHeight: '200px' }}>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        
        {error && (
          <p className="text-red-500 text-sm text-center">{error.message}</p>
        )}
        
        <div className="flex gap-2 justify-center">
          <NeumorphicButton
            onClick={handleCapture}
            disabled={isLoading || !isActive}
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            Capture
          </NeumorphicButton>
          
          {/* Only show switch camera on mobile */}
          {window.innerWidth <= 768 && (
            <NeumorphicButton
              onClick={() => switchCamera()}
              disabled={isLoading || !isActive}
            >
              <SwitchCamera className="w-4 h-4" />
            </NeumorphicButton>
          )}
          
          <NeumorphicButton
            onClick={handleClose}
            disabled={isLoading}
            variant="secondary"
          >
            <X className="w-4 h-4" />
          </NeumorphicButton>
        </div>
      </div>
    </div>
  );
}
