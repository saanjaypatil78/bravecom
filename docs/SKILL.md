---
name: Ecommerce Product Image Validator
version: 1.0.0
description: Validates product images match their titles with 95% accuracy using deep product knowledge
author: Antigravity Training
tags: [ecommerce, validation, products, images, machine-learning]
---

# Ecommerce Product Image Validator Skill

## Goal
To validate that product images correctly match their product titles with 95% accuracy by analyzing product name patterns, brand identifiers, and product-specific features.

---

## Core Validation Principles

### 1. Product Type Identification
Every product belongs to a specific type. The image MUST show that exact type.

| Product Type | What Image Should Show | What to Reject |
|-------------|----------------------|----------------|
| Earbuds | Small in-ear buds, charging case | Over-ear headphones |
| Headphones | Over-ear with headband | Earbuds, earphones |
| Smartwatch | Wrist-worn device with screen | Phone, fitness band |
| Smartphone | Handheld mobile device | Tablet, smartwatch |
| Tablet | Large touchscreen device | Phone, laptop |
| Speaker | Audio device, cylindrical/rectangular | Headphones, soundbar |
| Mouse | Computer peripheral | Keyboard, trackpad |
| Sneakers | Athletic/casual shoes | Sandals, formal shoes |
| Jeans | Denim pants | Shorts, joggers |
| Wallet | Folded leather/card holder | Card holder only |
| Watch | Wrist timepiece | Fitness band |
| Book | Front cover with title | Kindle, summary |
| Serum | Dropper bottle | Cream, tube |
| Flask | Thermos/water bottle | Lunch box |

### 2. Brand Identification
Products MUST show the correct brand:
- Apple products → Apple logo, design
- Samsung → Samsung branding
- Sony → Sony branding
- Nike → Nike swoosh
- Ray-Ban → Ray-Ban logo on frame

### 3. Color Accuracy
The image color MUST match the listed variant.

---

## Deep Product Analysis Rules

### ELECTRONICS CATEGORY

#### Rule E1: Earbuds vs Headphones
```
Product Name Contains: "AirPods", "Earbuds", "Earphone", "True Wireless"
VALID Image: Small bud-style earphones with charging case
INVALID Image: Over-ear headphones, headphones with headband

Product Name Contains: "Headphones", "Over-ear"
VALID Image: Large headphones with headband going over head
INVALID Image: Earbuds, in-ear monitors
```

#### Rule E2: Smartwatch vs Fitness Band
```
Product Name Contains: "Watch", "Smartwatch", "Galaxy Watch", "Apple Watch"
VALID Image: Square/circular face with wrist strap, visible screen
INVALID Image: Small rectangle (fitness band), phone

Product Name Contains: "Fitness Band", "Band"
VALID Image: Small narrow band, basic screen
INVALID Image: Full smartwatch with apps
```

#### Rule E3: Phone vs Tablet
```
Product Name Contains: "Phone", "Smartphone", "5G", "Pro+", "Pro Max"
VALID Image: Handheld device ~6 inch screen
INVALID Image: Larger tablet, laptop

Product Name Contains: "iPad", "Tablet"
VALID Image: Large screen ~10+ inches
INVALID Image: Phone, small device
```

#### Rule E4: Speaker Types
```
Product Name Contains: "Flip", "Speaker", "Portable"
VALID Image: Cylindrical/portable speaker, bluetooth
INVALID Image: Home theater, soundbar, headphones

Product Name Contains: "Soundbar"
VALID Image: Long horizontal bar
INVALID Image: Portable speaker
```

---

### FASHION CATEGORY

#### Rule F1: Footwear Types
```
Product Name Contains: "Sneakers", "Shoe", "Running", "Air Max"
VALID Image: Athletic shoes, visible sole
INVALID Image: Sandals, formal shoes, socks

Product Name Contains: "Flip Flop", "Sandals"
VALID Image: Open footwear, straps
INVALID Image: Closed shoes

Product Name Contains: "Boots"
VALID Image: High-top covering ankle
INVALID Image: Regular shoes
```

#### Rule F2: Jeans vs Pants
```
Product Name Contains: "Jeans", "Denim"
VALID Image: Blue/black denim texture, 5 pockets
INVALID Image: Track pants, shorts, leggings

Product Name Contains: "Joggers", "Track Pants"
VALID Image: Elastic cuffs, casual pants
INVALID Image: Jeans, formal pants
```

#### Rule F3: Wallet Types
```
Product Name Contains: "Wallet"
VALID Image: Folded leather, visible card slots
INVALID Image: Credit card holder (too small), money clip

Product Name Contains: "Card Holder"
VALID Image: Small card case, 2-3 cards visible
INVALID Image: Full wallet
```

---

### HOME & KITCHEN

#### Rule H1: Cooker Types
```
Product Name Contains: "Instant Pot", "Pressure Cooker"
VALID Image: Electric cooker with digital display
INVALID Image: Stovetop cooker, rice cooker only

Product Name Contains: "Rice Cooker"
VALID Image: Single pot appliance with lid
INVALID Image: Pressure cooker
```

#### Rule H2: Appliance Categories
```
Product Name Contains: "Vacuum", "Dyson"
VALID Image: Stick/canister vacuum cleaner
INVALID Image: Broom, mop, robot vacuum (unless specified)

Product Name Contains: "Air Purifier"
VALID Image: Tower/box appliance with vents
INVALID Image: Fan, humidifier

Product Name Contains: "Fan", "Ceiling Fan"
VALID Image: Fan blades, motor housing
INVALID Image: Air cooler, AC

Product Name Contains: "Flask", "Thermos"
VALID Image: Cylindrical insulated bottle
INVALID Image: Lunch box, water glass
```

---

### HEALTH & FITNESS

#### Rule HF1: Exercise Equipment
```
Product Name Contains: "Yoga Mat"
VALID Image: Rolled/flat mat, textured surface
INVALID Image: Exercise bike, foam roller

Product Name Contains: "Dumbbell", "Weight"
VALID Image: Weight with handle
INVALID Image: Exercise ball, resistance band
```

#### Rule HF2: Sports Equipment
```
Product Name Contains: "Football"
VALID Image: Round ball, pentagon/hexagon patterns
INVALID Image: Cricket ball, rugby ball

Product Name Contains: "Badminton", "Racket"
VALID Image: Racket with strings, shuttlecock (optional)
INVALID Image: Tennis racket, cricket bat
```

---

### BEAUTY

#### Rule B1: Product Form Types
```
Product Name Contains: "Serum"
VALID Image: Dropper bottle, small
INVALID Image: Tube, jar, spray bottle

Product Name Contains: "Cream"
VALID Image: Jar or tube
INVALID Image: Dropper bottle

Product Name Contains: "Face Wash", "Cleanser"
VALID Image: Tube or pump bottle
INVALID Image: Dropper bottle
```

#### Rule B2: Hair Styling
```
Product Name Contains: "Straightener", "Flat Iron"
VALID Image: Two heated plates, clamp style
INVALID Image: Curling iron, hair dryer

Product Name Contains: "Hair Dryer"
VALID Image: Gun-shaped with nozzle
INVALID Image: Straightener, curling iron
```

---

### BOOKS

#### Rule BK1: Book Validation
```
Product Name Contains: Book title + Author name
VALID Image: Front cover with title and author
INVALID Image: Blank cover, Kindle screenshot, summary

Product Name Contains: "Kindle", "Ebook"
VALID Image: E-reader device showing book
INVALID Image: Physical book
```

---

## Image Quality Rules

### Rule Q1: Background
- VALID: Pure white (#FFFFFF), light gray, transparent
- INVALID: Dark backgrounds, busy backgrounds, other products

### Rule Q2: Product Framing
- VALID: Product fills 85%+ of frame
- INVALID: Product too small, too much whitespace

### Rule Q3: Image Source
- VALID: Professional product photo, studio shot
- INVALID: Stock photo, watermark visible, text overlay

### Rule Q4: Color Accuracy
- VALID: True-to-life colors
- INVALID: Heavily filtered, wrong color variant

---

## Validation Algorithm

### Step 1: Extract Product Type
```
1. Parse product name
2. Identify key product type words
3. Match against category rules
```

### Step 2: Check Brand
```
1. Identify brand name in title
2. Verify brand visible in image
3. If brand not visible, check design language
```

### Step 3: Validate Type Match
```
1. Compare extracted type against image
2. If mismatch → INVALID
3. If match → CONTINUE
```

### Step 4: Check Quality
```
1. Verify background
2. Check product framing
3. Verify no watermarks
```

### Step 5: Generate Result
```
VALID if: Type matches + Brand correct + Quality OK
INVALID if: Any check fails
Confidence: Based on number of matching criteria
```

---

## Examples

### Example 1: VALID
**Product:** "Apple AirPods Pro 2nd Gen"
- Type: Earbuds ✓
- Brand: Apple ✓
- Image: Small white earbuds with case ✓
- Result: VALID (98%)

### Example 2: INVALID  
**Product:** "Sony WH-1000XM5 Headphones"
- Type: Earbuds (from image) ✗
- Expected: Headphones
- Result: INVALID - Type mismatch

### Example 3: VALID
**Product:** "Nike Air Max 270 React"
- Type: Sneakers ✓
- Brand: Nike ✓
- Image: Athletic shoes ✓
- Result: VALID (95%)

---

## Training Data Format

```json
{
  "product_id": "MALL-PRD-00001",
  "product_name": "Apple AirPods Pro 2nd Gen",
  "brand": "Apple",
  "category": "Electronics",
  "product_type": "earbuds",
  "expected_image_features": [
    "small_in_ear_buds",
    "charging_case",
    "white_color",
    "apple_design"
  ],
  "reject_features": [
    "over_ear_headphones",
    "headband",
    "wire"
  ],
  "validation_rules": ["E1", "Q1", "Q2"]
}
```

---

## Implementation

```python
def validate_product_image(product_name, image_analysis):
    # Extract product type
    product_type = extract_product_type(product_name)
    
    # Get expected features
    expected = get_expected_features(product_type)
    
    # Compare with image analysis
    match_score = compare_features(expected, image_analysis)
    
    if match_score >= 0.95:
        return VALID
    elif match_score >= 0.80:
        return NEEDS_REVIEW
    else:
        return INVALID

def extract_product_type(name):
    name_lower = name.lower()
    
    # Electronics
    if any(w in name_lower for w in ['airpods', 'earbuds', 'earphone']):
        return 'earbuds'
    if any(w in name_lower for w in ['headphone', 'over-ear']):
        return 'headphones'
    if any(w in name_lower for w in ['watch', 'smartwatch']):
        return 'smartwatch'
    if any(w in name_lower for w in ['phone', 'smartphone', '5g']):
        return 'smartphone'
    if any(w in name_lower for w in ['tablet', 'ipad']):
        return 'tablet'
        
    # Fashion
    if any(w in name_lower for w in ['sneaker', 'shoe', 'running']):
        return 'sneakers'
    if any(w in name_lower for w in ['jeans', 'denim']):
        return 'jeans'
    if any(w in name_lower for w in ['wallet']):
        return 'wallet'
        
    # ... continue for all categories
```

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Type Match Accuracy | 95% |
| Brand Recognition | 90% |
| Quality Detection | 85% |
| Overall Validation | 95% |

---

## Notes

- Always prioritize product type matching first
- Brand recognition is secondary but important
- Quality checks are pass/fail
- When in doubt, mark for human review
- Update rules as new product types emerge
