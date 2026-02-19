import { ExternalBlob } from '../backend';

export interface ChecklistItem {
  name: string;
  completed: boolean;
  photo?: ExternalBlob;
}

export const CHECKLIST_ITEMS = [
  'Drive thru window',
  'Back door',
  'Front door',
  'Upstairs door',
  'Cash collected',
  'OnlineHM App closed',
  'Staff toilet'
] as const;
