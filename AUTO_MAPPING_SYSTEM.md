# Automatic Value Mapping System

## Overview

The system now **automatically reads value mappings from the Excel file** instead of hardcoding them. This means:

✅ **No manual configuration needed** - Mappings are generated automatically  
✅ **Works with any Excel file** - Adapts to your data format  
✅ **Handles variations** - Detects "hotels sewage", "mall/shopping complex sewage", etc.  
✅ **Self-updating** - When you upload a new Excel file, mappings are regenerated

## How It Works

### 1. When Excel File Loads

When the system loads your Excel file, it:

1. **Scans all rows** to find unique values for each field
2. **Compares form values** with Excel values
3. **Generates mappings** automatically
4. **Stores mappings** for use during matching

### 2. Mapping Generation

The system analyzes these fields:
- **Source**: Maps "industry" → "industry sewage", "hotel" → "hotels sewage", etc.
- **Delivery**: Maps "floor1" → "1st floor", "ground" → "ground", etc.
- **Purpose, Location, Usage, Phase, Quality**: Direct matching (no mapping needed)

### 3. Example Mappings Generated

For your Excel file, the system will generate:

```javascript
{
  source: {
    "industry": "industry sewage",
    "hotel": "hotels sewage",           // Auto-detected from Excel
    "mall": "mall/shopping complex sewage"  // Auto-detected from Excel
  },
  delivery: {
    "floor1": "1st floor",
    "ground": "ground"
  }
}
```

## Your Excel Data Examples

### Model "a"
```json
{
  "Purpose": "house",
  "Location": "sewage",
  "Source": "industry sewage",
  "Delivery": "1st floor",
  "Usage": "1500L-30min",
  "Phase": "220",
  "Quality": "standard",
  " MODEL ": "a"
}
```

**Form Selections:**
- Source: "For industry sewage" → Maps to "industry sewage" ✅
- Delivery: "1st floor (~10 ft)" → Maps to "1st floor" ✅

### Model "b"
```json
{
  "Purpose": "house",
  "Location": "sewage",
  "Source": "hotels sewage",  ← Note: "hotels" (plural)
  "Delivery": "1st floor",
  "Usage": "1500L-30min",
  "Phase": "220",
  "Quality": "standard",
  " MODEL ": "b"
}
```

**Form Selections:**
- Source: "For hotels sewage" → Maps to "hotels sewage" ✅
- Delivery: "1st floor (~10 ft)" → Maps to "1st floor" ✅

### Model "c"
```json
{
  "Purpose": "house",
  "Location": "sewage",
  "Source": "mall/shopping complex sewage",  ← Note: Full phrase
  "Delivery": "ground",  ← Note: "ground" not "ground level"
  "Usage": "500L-30min",
  "Phase": "220",
  "Quality": "standard",
  " MODEL ": "c"
}
```

**Form Selections:**
- Source: "For mall/shopping complex sewage" → Maps to "mall/shopping complex sewage" ✅
- Delivery: "Ground level" → Maps to "ground" ✅

## Console Output

When the Excel file loads, you'll see:

```
✅ Detected combination-based database file
   Total combinations: 3
   📊 Unique values found in Excel:
     Source: ["industry sewage", "hotels sewage", "mall/shopping complex sewage"]
     Delivery: ["1st floor", "ground"]
     Purpose: ["house"]
     Location: ["sewage"]
     Usage: ["1500L-30min", "500L-30min"]
     Phase: ["220"]
     Quality: ["standard"]
   📋 Auto-generated value mappings: {
     source: {
       "industry": "industry sewage",
       "hotel": "hotels sewage",
       "mall": "mall/shopping complex sewage"
     },
     delivery: {
       "floor1": "1st floor",
       "ground": "ground"
     }
   }
```

## Benefits

1. **Automatic**: No manual configuration
2. **Flexible**: Works with any Excel format
3. **Accurate**: Uses actual Excel values
4. **Maintainable**: Updates when Excel file changes
5. **Debugging**: Shows all mappings in console

## Testing

To test the automatic mapping:

1. **Upload your Excel file** with all combinations
2. **Check console** for "Auto-generated value mappings"
3. **Make selections** matching your Excel data
4. **Verify** that models show up correctly

## Fallback System

If automatic mapping doesn't find a match, the system falls back to:
- Hardcoded mappings (for common cases)
- Direct value matching (if values are already the same)

This ensures the system always works, even if automatic mapping fails.

## Adding New Combinations

When you add new combinations to Excel:

1. **Upload the updated Excel file**
2. **System automatically** scans for new values
3. **Mappings are regenerated** automatically
4. **No code changes needed!**

The system adapts to your data automatically! 🎉

