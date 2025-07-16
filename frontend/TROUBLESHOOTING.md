# Troubleshooting Guide

## Common Issues and Solutions

### 1. Array Method Errors (`.filter is not a function`)

**Problem**: Components trying to call array methods on undefined or null values.

**Solution**: We've implemented safe array utilities in `lib/utils.ts`:

```typescript
import { safeArray, safeFilter, safeMap, safeReduce } from '@/lib/utils';

// Instead of:
const filtered = quotations.filter(q => q.status === 'pending'); // ❌ Can crash

// Use:
const filtered = safeFilter(quotations, q => q.status === 'pending'); // ✅ Safe
```

### 2. API Response Handling

**Problem**: Backend API responses might not always be arrays or might be wrapped in objects.

**Solution**: Enhanced API client with `handleArrayResponse` method:

```typescript
// API client automatically handles:
// - Direct arrays: [item1, item2]
// - Wrapped arrays: { quotations: [item1, item2] }
// - Error responses: Returns [] as fallback
```

### 3. Component Error Boundaries

**Problem**: One failing component can crash the entire application.

**Solution**: Defensive programming with try-catch blocks and fallback values:

```typescript
// Each component has error handling:
try {
  const data = await apiClient.getQuotations(token);
  setQuotations(Array.isArray(data) ? data : []);
} catch (error) {
  console.error('Failed to load quotations:', error);
  setQuotations([]); // Fallback to empty array
}
```

## Safe Utility Functions

### `safeArray<T>(value: T[] | null | undefined): T[]`
Ensures a value is always an array, returns empty array if not.

### `safeFilter<T>(array: T[] | null | undefined, predicate: (item: T) => boolean): T[]`
Safely filters an array, returns empty array if input is invalid.

### `safeMap<T, U>(array: T[] | null | undefined, mapper: (item: T) => U): U[]`
Safely maps an array, returns empty array if input is invalid.

### `safeReduce<T, U>(array: T[] | null | undefined, reducer: (acc: U, item: T) => U, initialValue: U): U`
Safely reduces an array, returns initial value if input is invalid.

## Custom Hooks

### `useErrorHandler`
Provides consistent error handling across components:

```typescript
const { handleError, safeAsync, safeSync } = useErrorHandler();

// Safe async operation
const result = await safeAsync(
  () => apiClient.getQuotations(token),
  { fallbackValue: [] }
);
```

### `useAsyncOperation`
Manages loading states and error handling for async operations:

```typescript
const { data, isLoading, error, execute } = useAsyncOperation({
  initialValue: [],
  onError: (error) => toast.error(error.message),
});

// Execute async operation
await execute(() => apiClient.getQuotations(token));
```

## Best Practices

1. **Always validate array responses**: Use `safeArray()` or `Array.isArray()` checks
2. **Provide fallback values**: Never leave components without data
3. **Handle API errors gracefully**: Show user-friendly error messages
4. **Use loading states**: Show loading indicators during API calls
5. **Log errors for debugging**: But don't expose sensitive information to users

## Error Prevention Checklist

- [ ] All array operations use safe utilities
- [ ] API responses are validated before use
- [ ] Components have loading and error states
- [ ] Try-catch blocks around async operations
- [ ] Fallback values for all data dependencies
- [ ] User-friendly error messages
- [ ] Error logging for debugging

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL
- Default: `http://localhost:3000/api`
- Production: `https://quotation-erp-fullstack.onrender.com/api`

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Start production server
npm start
```

## Common Environment Issues

1. **API URL mismatch**: Ensure `.env.local` has correct API URL
2. **Port conflicts**: Default port 3001, change if needed
3. **CORS issues**: Backend must allow frontend origin
4. **Token expiration**: Implement token refresh or handle 401 errors