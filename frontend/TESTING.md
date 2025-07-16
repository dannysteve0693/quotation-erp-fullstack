# Testing Guide

## Testing the QuotationForm Items Bug Fix

### Steps to Test:

1. **Login as a Customer**
   - Register or login with role: 'customer'
   - Navigate to Create Quotation

2. **Add Products to Quotation**
   - Select a product from the dropdown
   - Verify it appears in the "Selected Items" section
   - Verify it also appears in the "Quotation Summary" section

3. **Update Quantities**
   - Use the +/- buttons to change quantities
   - Verify quantities update in both sections
   - Verify total amount updates

4. **Remove Items**
   - Click the remove button (X) on any item
   - Verify item disappears from both sections
   - Verify total amount updates

### Expected Behavior:
- Items should appear immediately after selection
- Quantity changes should be reflected instantly
- Summary section should stay in sync with selected items
- Total amount should update automatically

### Debug Information:
- Open browser console to see log messages:
  - "Adding item, new items: [...]"
  - "Updating quantity, new items: [...]"
  - "Removing item, new items: [...]"

## Testing the Theme Toggle Fix

### Steps to Test:

1. **Initial State**
   - Application should load with light theme by default
   - Page background should be white/light colored

2. **Toggle to Dark Mode**
   - Click the moon icon in the header
   - Page should immediately switch to dark theme
   - Background should become dark

3. **Toggle Back to Light Mode**
   - Click the sun icon in the header
   - Page should switch back to light theme

4. **Persistence Test**
   - Set theme to dark mode
   - Refresh the page
   - Theme should remain dark
   - Repeat with light mode

### Expected Behavior:
- Theme should toggle instantly on click
- Theme preference should persist across page refreshes
- No console errors related to localStorage

## Common Issues and Solutions

### Issue: Items Not Updating
**Cause**: React not detecting state changes
**Solution**: Added `updateKey` to force re-renders

### Issue: Theme Not Persisting
**Cause**: localStorage access during SSR
**Solution**: Added browser environment checks

### Issue: Console Errors
**Cause**: Accessing localStorage on server
**Solution**: Added `typeof window !== 'undefined'` checks

## Manual Testing Checklist

- [ ] Can add products to quotation
- [ ] Items appear in selected items section
- [ ] Items appear in summary section
- [ ] Quantities can be updated
- [ ] Items can be removed
- [ ] Total amount calculates correctly
- [ ] Theme toggle works immediately
- [ ] Theme persists after refresh
- [ ] No console errors on page load
- [ ] No console errors when toggling theme

## Performance Notes

- Console logs added for debugging (remove in production)
- Force re-renders using `updateKey` (minimal performance impact)
- Browser environment checks prevent SSR issues