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
import { Check, Camera, Image } from 'lucide-react';

export default function ChecklistForm() {
  const [storeName, setStoreName] = useState('');
  const [items, setItems] = useState<ChecklistItem[]>(
    CHECKLIST_ITEMS.map(name => ({ name, completed: false }))
  );
  const [itemPhotos, setItemPhotos] = useState<Map<string, File>>(new Map());
  const [activeCameraItem, setActiveCameraItem] = useState<string | null>(null);

  const submitMutation = useSubmitChecklist();

  const handleCheckboxChange = (index: number) => {
    const newItems = [...items];
    newItems[index].completed = !newItems[index].completed;
    setItems(newItems);
  };

  const handleAttachClick = (itemName: string) => {
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
      // Generate PDF before submitting
      await generatePDF(storeName, items, itemPhotos);
      
      // Submit to backend
      await submitMutation.mutateAsync({
        storeName,
        items,
        photos: itemPhotos
      });

      toast.success('Checklist submitted successfully!');

      // Reset form
      setStoreName('');
      setItems(CHECKLIST_ITEMS.map(name => ({ name, completed: false })));
      
      // Revoke all photo URLs
      itemPhotos.forEach(photo => {
        URL.revokeObjectURL(URL.createObjectURL(photo));
      });
      setItemPhotos(new Map());
      setActiveCameraItem(null);
    } catch (error) {
      toast.error('Failed to submit checklist');
      console.error('Submission error:', error);
    }
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
                  <div className="neumorphic-inset rounded-xl p-4 flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all touch-manipulation ${
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
                      className="text-neumorphic-text flex-1 touch-manipulation"
                      onClick={() => handleCheckboxChange(index)}
                    >
                      {item.name}
                    </span>
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
                  </div>

                  {/* Inline Camera for this item */}
                  {activeCameraItem === item.name && (
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

          {/* Submit Button */}
          <NeumorphicButton
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="w-full"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit Checklist'}
          </NeumorphicButton>
        </div>
      </NeumorphicCard>
    </>
  );
}
