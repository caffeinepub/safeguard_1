# Specification

## Summary
**Goal:** Add per-item photo capture capability to the closing checklist, allowing users to attach a photo to each of the 7 checklist items using an inline camera interface.

**Planned changes:**
- Add a small attach image button next to each of the 7 checklist items
- Display an inline camera interface (not a popup) when the attach button is clicked
- Allow users to capture and associate photos with specific checklist items
- Update backend to accept multiple photos (one per item) instead of a single photo
- Update PDF generation to display each photo next to its corresponding checklist item
- Update form reset to clear all per-item photos

**User-visible outcome:** Users can attach individual photos to each checklist item by clicking an attach button, capturing the photo in an inline camera view, and seeing visual confirmation of attached photos. The generated PDF will display each photo next to its associated checklist item.
