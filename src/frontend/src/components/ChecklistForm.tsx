import { useState } from 'react';
import { ChecklistItem } from '../types/checklist';
import { CHECKLIST_ITEMS } from '../types/checklist';
import NeumorphicCard from './NeumorphicCard';
import NeumorphicInput from './NeumorphicInput';
import NeumorphicButton from './NeumorphicButton';
import CameraCapture from './CameraCapture';
import { useSubmitChecklist } from '../hooks/useQueries';
import { toast, Toaster } from 'sonner';
import { generatePDF } from '../utils/pdfGenerator';
import { Check, Camera, Image, Download, RotateCcw } from 'lucide-react';

export default function ChecklistForm() {
  const [storeName, setStoreName] = useState('');
  const [items, setItems] = useState<ChecklistItem[]>(
    CHECKLIST_ITEMS.map(name => ({ name, completed: false }))
  );
  const [itemPhotos, setItemPhotos] = useState<Map<string, File>>(new Map());
  const [activeCameraItem, setActiveCameraItem] = useState<string | null>(null);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    storeName: string;
    items: ChecklistItem[];
    photos: Map<string, File>;
  } | null>(null);

  const submitMutation = useSubmitChecklist();

  const handleCheckboxChange = (index: number) => {
    if (isPdfReady) return; // Prevent changes after submission
    const newItems = [...items];
    newItems[index].completed = !newItems[index].completed;
    setItems(newItems);
  };

  const handleAttachClick = (itemName: string) => {
    if (isPdfReady) return; // Prevent changes after submission
    if (activeCameraItem === itemName) {
      setActiveCameraItem(null);
    } else {
      setActiveCameraItem(itemName);
    }
  };

  const handlePhotoCapture = (itemName: string, photo: File) => {
    const newPhotos = new Map(itemPhotos);
    newPhotos.set(itemName, photo);
    setItemPhotos(newPhotos);
    setActiveCameraItem(null);
  };

  const handleSubmit = async () => {
    if (!storeName.trim()) {
      toast.error('Please enter a store name');
      return;
    }

    try {
      // Submit to backend
      await submitMutation.mutateAsync({
        storeName,
        items,
        photos: itemPhotos
      });

      // Store submitted data for PDF generation
      setSubmittedData({
        storeName,
        items: [...items],
        photos: new Map(itemPhotos)
      });

      setIsPdfReady(true);
      toast.success('Checklist submitted successfully! You can now download the PDF.');
    } catch (error) {
      toast.error('Failed to submit checklist');
      console.error('Submission error:', error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!submittedData) return;

    try {
      await generatePDF(
        submittedData.storeName,
        submittedData.items,
        submittedData.photos
      );
      toast.success('PDF download initiated');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('PDF generation error:', error);
    }
  };

  const handleReset = () => {
    // Revoke all photo URLs
    itemPhotos.forEach(photo => {
      URL.revokeObjectURL(URL.createObjectURL(photo));
    });

    // Reset all state
    setStoreName('');
    setItems(CHECKLIST_ITEMS.map(name => ({ name, completed: false })));
    setItemPhotos(new Map());
    setActiveCameraItem(null);
    setIsPdfReady(false);
    setSubmittedData(null);

    toast.success('Checklist reset successfully');
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <NeumorphicCard>
        <div className="space-y-6">
          {/* Store Name Input */}
          <div>
            <label className="block text-sm font-medium text-neumorphic-text mb-2">
              Store Name *
            </label>
            <NeumorphicInput
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter store name"
              disabled={isPdfReady}
            />
          </div>

          {/* Checklist Items */}
          <div>
            <h3 className="text-lg font-semibold text-neumorphic-text mb-4">
              Checklist Items
            </h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className={`neumorphic-inset rounded-xl p-4 flex items-center gap-3 ${isPdfReady ? 'opacity-75' : ''}`}>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isPdfReady ? '' : 'touch-manipulation'
                      } ${
                        item.completed
                          ? 'bg-neumorphic-accent neumorphic-raised'
                          : 'neumorphic-inset'
                      }`}
                      onClick={() => handleCheckboxChange(index)}
                    >
                      {item.completed && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span 
                      className={`text-neumorphic-text flex-1 ${isPdfReady ? '' : 'touch-manipulation'}`}
                      onClick={() => handleCheckboxChange(index)}
                    >
                      {item.name}
                    </span>
                    {!isPdfReady && (
                      <button
                        onClick={() => handleAttachClick(item.name)}
                        className={`min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center transition-all touch-manipulation ${
                          itemPhotos.has(item.name)
                            ? 'bg-green-500 text-white neumorphic-raised'
                            : activeCameraItem === item.name
                            ? 'bg-neumorphic-accent text-white neumorphic-raised'
                            : 'neumorphic-raised text-neumorphic-text'
                        }`}
                        title="Attach photo"
                      >
                        {itemPhotos.has(item.name) ? (
                          <Image className="w-5 h-5" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    {isPdfReady && itemPhotos.has(item.name) && (
                      <div className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center bg-green-500 text-white neumorphic-raised">
                        <Image className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Inline Camera for this item */}
                  {activeCameraItem === item.name && !isPdfReady && (
                    <div className="ml-4">
                      <CameraCapture
                        itemName={item.name}
                        onPhotoCapture={handlePhotoCapture}
                        onClose={() => setActiveCameraItem(null)}
                        existingPhoto={itemPhotos.get(item.name)}
                      />
                    </div>
                  )}

                  {/* Photo thumbnail when camera is closed */}
                  {activeCameraItem !== item.name && itemPhotos.has(item.name) && (
                    <div className="ml-4 neumorphic-inset rounded-lg p-2">
                      <img
                        src={URL.createObjectURL(itemPhotos.get(item.name)!)}
                        alt={`${item.name} photo`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {!isPdfReady ? (
            <NeumorphicButton
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="w-full"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Checklist'}
            </NeumorphicButton>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <NeumorphicButton
                onClick={handleDownloadPDF}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </NeumorphicButton>
              <NeumorphicButton
                onClick={handleReset}
                variant="secondary"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </NeumorphicButton>
            </div>
          )}
        </div>
      </NeumorphicCard>
    </>
  );
}
