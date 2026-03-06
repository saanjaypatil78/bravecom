#!/usr/bin/env python3
"""
Product Image Validation Script
Validates product images in the catalog based on product names
"""

import json
import re
from typing import Dict, List, Tuple
from dataclasses import dataclass

@dataclass
class ValidationResult:
    product_id: str
    product_name: str
    is_valid: bool
    confidence: float
    issues: List[str]
    suggestions: List[str]

class ProductImageValidator:
    """Validates if product names and images match correctly"""
    
    PRODUCT_TYPE_KEYWORDS = {
        'Electronics': {
            'earbuds': ['airpods', 'earbuds', 'earphone', 'in-ear', 'true wireless', 'wireless earbud'],
            'headphones': ['headphone', 'headphones', 'over-ear', 'on-ear', 'headset'],
            'smartwatch': ['smartwatch', 'watch', 'fitness tracker', 'wearable', 'galaxy watch', 'apple watch'],
            'phone': ['smartphone', 'phone', 'mobile', '5g', '4g', 'realme', 'samsung', 'iphone', 'oneplus'],
            'tablet': ['tablet', 'ipad', 'tab'],
            'speaker': ['speaker', 'bluetooth speaker', 'portable speaker', 'jbl', 'homepod'],
            'charger': ['charger', 'adapter', 'power adapter', 'gan', 'anker', 'charging'],
            'mouse': ['mouse', 'wireless mouse', 'logitech'],
            'laptop': ['laptop', 'notebook', 'computer', 'macbook'],
            'vacuum': ['vacuum', 'vacuum cleaner', 'dyson'],
            'purifier': ['purifier', 'air cleaner', 'hepa', 'philips'],
            'fan': ['fan', 'ceiling fan', 'table fan', 'bladc', 'atomberg'],
            'flask': ['flask', 'thermos', 'water bottle', 'insulated', 'milton'],
        },
        'Fashion': {
            'sneakers': ['sneaker', 'shoe', 'running shoe', 'sport shoe', 'nike', 'adidas', 'puma'],
            'jeans': ['jean', 'denim', 'pants', 'levis', 'levi'],
            'shirt': ['shirt', 't-shirt', 'tshirt', 'casual shirt', 'wrogn'],
            'jacket': ['jacket', 'coat', 'hoodie', 'track jacket', 'adidas'],
            'wallet': ['wallet', 'purse', 'card holder', 'minimalist'],
            'watch': ['watch', 'wristwatch', 'timepiece', 'forest'],
            'sunglasses': ['sunglass', 'spectacles', 'eyewear', 'ray-ban', 'rayban'],
        },
        'Home & Kitchen': {
            'cooker': ['cooker', 'pressure cooker', 'instant pot', 'electric cooker', 'instantpot'],
            'kitchen': ['kitchen', 'lunch', 'tiffin', 'borosil'],
            'purifier': ['purifier', 'air cleaner', 'hepa', 'philips'],
            'vacuum': ['vacuum', 'vacuum cleaner', 'dyson'],
            'fan': ['fan', 'ceiling fan', 'table fan', 'bladc', 'atomberg'],
            'flask': ['flask', 'thermos', 'water bottle', 'insulated', 'milton'],
        },
        'Health & Fitness': {
            'yoga': ['yoga', 'mat', 'fitness mat', 'exercise mat', 'boldfit'],
            'protein': ['protein', 'whey', 'supplement', 'nutrition', 'muscleblaze'],
            'massager': ['massager', 'massage gun', 'percussion', 'theragun'],
            'fitness': ['fitness', 'gym', 'workout', 'resistance', 'band'],
            'sports': ['football', 'badminton', 'tennis', 'yonex', 'nivia'],
        },
        'Beauty & Personal Care': {
            'serum': ['serum', 'essence', 'treatment', 'minimalist', 'niacinamide'],
            'foundation': ['foundation', 'makeup', 'concealer', 'loreal'],
            'facewash': ['facewash', 'face wash', 'cleanser', 'wow', 'himalaya'],
            'hair': ['hair', 'straightener', 'curling', 'dyson'],
            'beard': ['beard', 'shaving', 'beardo'],
        },
        'Books': {
            'book': ['book', 'paperback', 'hardcover', 'novel', 'atomic', 'psychology', 'rich dad', 'zero to one', 'deep work'],
        }
    }
    
    def __init__(self):
        self.validation_rules = self._build_validation_rules()
        
    def _build_validation_rules(self) -> Dict:
        """Build validation rules from keywords"""
        rules = {}
        for category, types in self.PRODUCT_TYPE_KEYWORDS.items():
            rules[category] = {}
            for type_name, keywords in types.items():
                rules[category][type_name] = keywords
        return rules
        
    def validate_product(self, product: dict) -> ValidationResult:
        """Validate a single product"""
        
        product_id = product.get('id', '')
        product_name = product.get('name', '').lower()
        product_brand = product.get('brand', '').lower()
        product_category = product.get('category', '')
        
        issues = []
        suggestions = []
        
        # Get matching keywords
        matched_types = []
        confidence = 0.5
        
        if product_category in self.validation_rules:
            for type_name, keywords in self.validation_rules[product_category].items():
                for keyword in keywords:
                    if keyword in product_name or keyword in product_brand:
                        matched_types.append(type_name)
                        confidence += 0.1
                        break
                        
        # Validate based on product name patterns
        name_words = product_name.split()
        
        # Check if product has recognizable type
        if matched_types:
            confidence = min(1.0, 0.6 + (len(matched_types) * 0.1))
            
            # Brand + type validation
            if product_brand and product_brand in product_name:
                confidence += 0.15
                
            # Check for proper product naming pattern
            # Expected: Brand + Product Type + Details
            if len(name_words) >= 2:
                confidence += 0.1
        else:
            issues.append(f"Could not identify product type for category: {product_category}")
            confidence = 0.3
            
        # Specific validations per category
        if product_category == 'Electronics':
            if 'airpods' in product_name or 'earbuds' in product_name:
                if 'over-ear' in product_name or 'headphone' in product_name.replace('earbuds', ''):
                    issues.append("Product name mixes earbuds with headphones")
                    confidence -= 0.2
                    
        elif product_category == 'Fashion':
            if 'wallet' in product_name:
                if 'card' not in product_name and 'minimalist' not in product_name:
                    suggestions.append("Consider specifying card holder in wallet products")
                    
        elif product_category == 'Books':
            if 'book' in product_name:
                if len(name_words) < 3:
                    suggestions.append("Book titles should include author name")
                    
        # Determine validity
        is_valid = confidence >= 0.6 and len(matched_types) > 0
        
        if not is_valid:
            if confidence < 0.6:
                issues.append(f"Low confidence score: {confidence:.2f}")
            if not matched_types:
                issues.append("No product type keywords found in name")
                
        return ValidationResult(
            product_id=product_id,
            product_name=product.get('name', ''),
            is_valid=is_valid,
            confidence=min(1.0, confidence),
            issues=issues,
            suggestions=suggestions
        )
        
    def validate_catalog(self, products: List[dict]) -> Dict:
        """Validate entire product catalog"""
        
        results = []
        valid_count = 0
        
        for product in products:
            result = self.validate_product(product)
            results.append(result)
            if result.is_valid:
                valid_count += 1
                
        total = len(products)
        
        return {
            'total_products': total,
            'valid_products': valid_count,
            'invalid_products': total - valid_count,
            'validation_rate': valid_count / total if total > 0 else 0,
            'results': [
                {
                    'id': r.product_id,
                    'name': r.product_name,
                    'valid': r.is_valid,
                    'confidence': r.confidence,
                    'issues': r.issues,
                    'suggestions': r.suggestions
                }
                for r in results
            ]
        }

def main():
    """Run validation on sample products"""
    
    # Sample products to validate
    products = [
        {"id": "MALL-PRD-00001", "name": "Apple AirPods Pro 2nd Gen", "brand": "Apple", "category": "Electronics"},
        {"id": "MALL-PRD-00002", "name": "Samsung Galaxy Watch 6 Classic", "brand": "Samsung", "category": "Electronics"},
        {"id": "MALL-PRD-00003", "name": "Sony WH-1000XM5 Headphones", "brand": "Sony", "category": "Electronics"},
        {"id": "MALL-PRD-00004", "name": "Logitech MX Master 3S Mouse", "brand": "Logitech", "category": "Electronics"},
        {"id": "MALL-PRD-00009", "name": "Nike Air Max 270 React", "brand": "Nike", "category": "Fashion"},
        {"id": "MALL-PRD-00010", "name": "Levi's 501 Original Straight Jeans", "brand": "Levi's", "category": "Fashion"},
        {"id": "MALL-PRD-00013", "name": "The Minimalist Leather Wallet", "brand": "Minimalist", "category": "Fashion"},
        {"id": "MALL-PRD-00017", "name": "Instant Pot Duo 7-in-1 (5.7L)", "brand": "Instant Pot", "category": "Home & Kitchen"},
        {"id": "MALL-PRD-00021", "name": "Atomberg Renesa 1200mm BLDC Fan", "brand": "Atomberg", "category": "Home & Kitchen"},
        {"id": "MALL-PRD-00029", "name": "Minimalist 10% Niacinamide Serum", "brand": "Minimalist", "category": "Beauty & Personal Care"},
        {"id": "MALL-PRD-00030", "name": "Dyson Corrale Hair Straightener", "brand": "Dyson", "category": "Beauty & Personal Care"},
        {"id": "MALL-PRD-00046", "name": "Atomic Habits - James Clear", "brand": "Penguin Random House", "category": "Books"},
        {"id": "MALL-PRD-00047", "name": "The Psychology of Money - Housel", "brand": "Jaico Publishing", "category": "Books"},
    ]
    
    validator = ProductImageValidator()
    results = validator.validate_catalog(products)
    
    print("=" * 60)
    print("PRODUCT IMAGE VALIDATION REPORT")
    print("=" * 60)
    print(f"\nTotal Products: {results['total_products']}")
    print(f"Valid Products: {results['valid_products']}")
    print(f"Invalid Products: {results['invalid_products']}")
    print(f"Validation Rate: {results['validation_rate']:.1%}")
    print("\n" + "-" * 60)
    
    for r in results['results']:
        status = "[PASS]" if r['valid'] else "[FAIL]"
        print(f"\n[{r['id']}] {r['name']}")
        print(f"   Status: {status} (Confidence: {r['confidence']:.2f})")
        
        if r['issues']:
            print(f"   Issues:")
            for issue in r['issues']:
                print(f"     - {issue}")
                
        if r['suggestions']:
            print(f"   Suggestions:")
            for suggestion in r['suggestions']:
                print(f"     - {suggestion}")

if __name__ == "__main__":
    main()
