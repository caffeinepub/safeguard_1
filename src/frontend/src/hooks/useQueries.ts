import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ChecklistItem } from '../types/checklist';
import { ExternalBlob } from '../backend';

interface SubmitChecklistParams {
  storeName: string;
  items: ChecklistItem[];
  photos: Map<string, File>;
}

export function useSubmitChecklist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ storeName, items, photos }: SubmitChecklistParams) => {
      if (!actor) throw new Error('Actor not initialized');

      // Convert items with photos to backend format
      const itemsWithPhotos = await Promise.all(
        items.map(async (item) => {
          const photoFile = photos.get(item.name);
          
          if (photoFile) {
            // Convert File to Uint8Array
            const arrayBuffer = await photoFile.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Create ExternalBlob from bytes
            const photoBlob = ExternalBlob.fromBytes(uint8Array);
            
            return {
              ...item,
              photo: photoBlob
            };
          }
          
          return item;
        })
      );

      // Submit to backend
      await actor.submitChecklist(storeName, itemsWithPhotos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
}
