import { ChecklistItem } from '../types/checklist';

export async function generatePDF(
  storeName: string,
  items: ChecklistItem[],
  itemPhotos: Map<string, File>
): Promise<void> {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window');
  }

  const timestamp = new Date().toLocaleString();

  // Convert photos to data URLs
  const photoDataUrls = new Map<string, string>();
  for (const [itemName, photoFile] of itemPhotos.entries()) {
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(photoFile);
    });
    photoDataUrls.set(itemName, dataUrl);
  }

  // Build HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>SafeGuard Checklist - ${storeName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
          }
          h1 {
            font-size: 28px;
            margin-bottom: 10px;
          }
          .store-name {
            font-size: 20px;
            color: #555;
            margin-bottom: 5px;
          }
          .timestamp {
            font-size: 14px;
            color: #777;
          }
          .checklist {
            margin: 30px 0;
          }
          .checklist-item {
            display: flex;
            align-items: flex-start;
            padding: 12px;
            border-bottom: 1px solid #ddd;
            page-break-inside: avoid;
          }
          .item-left {
            display: flex;
            align-items: center;
            flex: 1;
          }
          .checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #333;
            border-radius: 4px;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .checkbox.checked {
            background-color: #4CAF50;
            border-color: #4CAF50;
          }
          .checkbox.checked::after {
            content: '✓';
            color: white;
            font-weight: bold;
            font-size: 16px;
          }
          .item-name {
            font-size: 16px;
          }
          .item-photo {
            margin-left: 12px;
            flex-shrink: 0;
          }
          .item-photo img {
            width: 120px;
            height: 80px;
            object-fit: cover;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          @media print {
            body {
              padding: 20px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SafeGuard Checklist</h1>
          <div class="store-name">${storeName}</div>
          <div class="timestamp">${timestamp}</div>
        </div>

        <div class="checklist">
          <h2>Checklist Items</h2>
          ${items
            .map((item) => {
              const photoUrl = photoDataUrls.get(item.name);
              return `
            <div class="checklist-item">
              <div class="item-left">
                <div class="checkbox ${item.completed ? 'checked' : ''}"></div>
                <div class="item-name">${item.name}</div>
              </div>
              ${
                photoUrl
                  ? `
                <div class="item-photo">
                  <img src="${photoUrl}" alt="${item.name} photo" />
                </div>
              `
                  : ''
              }
            </div>
          `;
            })
            .join('')}
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for images to load before printing
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (user can cancel)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    }, 250);
  };
}
