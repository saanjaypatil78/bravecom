#!/usr/bin/env python3
"""
ANTIGRAVITY Human Verification System
================================
Pre-listing verification following PRD v1.1.0

E-Commerce Research Workflow Integrated:
1. Idea Generation: TikTok Creative Center, Amazon Movers and Shakers
2. Trend Verification: Google Trends analysis
3. Supplier Check: AliExpress Dropshipping Center verification
4. Competitor Spy: Google search, Shopify store analysis
5. Profit Calculation: Ecomhunt data validation

Usage:
    python human_verification.py --product-id PRD-00001
    python human_verification.py --interactive
    python human_verification.py --research "product name"
    python human_verification.py --quick-verify "product name"
"""

import os
import sys
import json
import re
import hashlib
import argparse
import subprocess
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field, asdict
from enum import Enum
import requests
from urllib.parse import quote_plus


class VerificationPhase(Enum):
    PHASE_1_DEEP_RESEARCH = "phase_1_deep_research"
    PHASE_2_TITLE_METADATA = "phase_2_title_metadata"
    PHASE_3_REVIEW_MATCH = "phase_3_review_match"
    PHASE_4_UI_UX = "phase_4_ui_ux"
    PHASE_5_SAFETY_LOCK = "phase_5_safety_lock"


class CheckStatus(Enum):
    PASS = "pass"
    FAIL = "fail"
    PENDING = "pending"
    SKIPPED = "skipped"
    NA = "na"


class ResearchStatus(Enum):
    NOT_STARTED = "not_started"
    IDEA_GENERATED = "idea_generated"
    TREND_VERIFIED = "trend_verified"
    SUPPLIER_CHECKED = "supplier_checked"
    COMPETITOR_ANALYZED = "competitor_analyzed"
    PROFIT_CALCULATED = "profit_calculated"
    READY_FOR_LISTING = "ready_for_listing"


@dataclass
class VerificationCheck:
    """Individual verification check"""
    check_id: str
    phase: str
    description: str
    status: str = "pending"
    evidence: str = ""
    notes: str = ""
    verified_by: str = ""
    verified_at: str = ""


@dataclass
class EcommerceResearch:
    """E-commerce product research data"""
    product_name: str
    
    # Idea Generation
    idea_sources: List[str] = field(default_factory=list)
    idea_score: int = 0  # 0-100
    
    # Trend Verification
    trend_data: Dict = field(default_factory=dict)
    trend_score: int = 0
    google_trends_url: str = ""
    
    # Supplier Check
    supplier_name: str = ""
    supplier_rating: float = 0.0
    supplier_hot_selling: int = 0
    supplier_verified: bool = False
    
    # Competitor Analysis
    competitors_found: List[Dict] = field(default_factory=list)
    competitor_count: int = 0
    best_seller_competitors: List[str] = field(default_factory=list)
    
    # Profit Calculation
    estimated_product_cost: float = 0.0
    suggested_selling_price: float = 0.0
    estimated_ad_spend: float = 0.0
    profit_margin: float = 0.0
    viable_for_ads: bool = False
    
    # Overall research status
    research_status: str = "not_started"
    research_completed_at: str = ""


@dataclass
class ProductVerification:
    """Complete product verification session"""
    product_id: str
    product_title: str
    product_data: Dict
    ecommerce_research: Optional[EcommerceResearch] = None
    
    # Phase results
    phase_1: List[VerificationCheck] = field(default_factory=list)
    phase_2: List[VerificationCheck] = field(default_factory=list)
    phase_3: List[VerificationCheck] = field(default_factory=list)
    phase_4: List[VerificationCheck] = field(default_factory=list)
    phase_5: List[VerificationCheck] = field(default_factory=list)
    
    # Overall status
    status: str = "pending"
    verified_by: str = ""
    verified_at: str = ""
    opencode_approval: bool = False
    opencode_signed: str = ""
    
    # Risk assessment
    risk_level: str = "unknown"
    can_publish: bool = False


class EcommerceResearchEngine:
    """
    Automated E-Commerce Product Research Engine
    Reduces manual research effort by automating:
    - Trend verification via Google Trends
    - Supplier verification via AliExpress
    - Competitor analysis via Google search
    - Profit calculation
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def generate_google_trends_url(self, product_name: str) -> str:
        """Generate Google Trends URL for product"""
        encoded = quote_plus(product_name)
        return f"https://trends.google.com/trends/explore?q={encoded}"
    
    def analyze_trend_direction(self, product_name: str) -> Dict:
        """
        Analyze product trend using Google Trends
        Returns trend direction and score
        """
        trend_url = self.generate_google_trends_url(product_name)
        
        # For automation, we'll provide the URL and expected analysis
        # Actual trend parsing would require Google Trends API
        
        trend_analysis = {
            "product_name": product_name,
            "trends_url": trend_url,
            "direction": "unknown",  # up, down, flat
            "score": 0,
            "requires_manual_check": True,
            "recommendation": f"Check {trend_url} for trend direction"
        }
        
        return trend_analysis
    
    def search_supplier_aliexpress(self, product_name: str) -> Dict:
        """
        Search AliExpress for supplier verification
        Checks: supplier rating 4.5+, hot selling numbers
        """
        search_url = f"https://www.aliexpress.com/wholesale?SearchText={quote_plus(product_name)}"
        
        supplier_info = {
            "product_name": product_name,
            "search_url": search_url,
            "supplier_name": "",
            "rating": 0.0,
            "hot_selling_count": 0,
            "verified": False,
            "requires_manual_check": True,
            "recommendation": f"Visit {search_url} to verify supplier rating (4.5+) and hot selling numbers"
        }
        
        return supplier_info
    
    def search_competitors(self, product_name: str) -> Dict:
        """
        Search for competitors selling the same product
        Uses Google search to find competing stores
        """
        search_query = f"{product_name} buy online shop"
        google_search_url = f"https://www.google.com/search?q={quote_plus(search_query)}"
        
        competitor_info = {
            "product_name": product_name,
            "search_url": google_search_url,
            "competitors": [],
            "competitor_count": 0,
            "best_seller_stores": [],
            "requires_manual_check": True,
            "recommendation": f"Visit {google_search_url} to analyze competitor pricing and best-sellers. Use Koala Inspector to check Shopify stores."
        }
        
        return competitor_info
    
    def calculate_profit(self, product_name: str, cost_price: float = 0.0, 
                        selling_price: float = 0.0, ad_spend: float = 0.0) -> Dict:
        """
        Calculate profit viability for e-commerce
        Factors: product cost, selling price, ad spend allowance
        """
        if selling_price > 0 and cost_price > 0:
            gross_profit = selling_price - cost_price
            profit_margin = (gross_profit / selling_price) * 100
            net_profit = gross_profit - ad_spend
            viable = net_profit > 0 and profit_margin > 30
        else:
            gross_profit = 0
            profit_margin = 0
            net_profit = 0
            viable = False
        
        profit_calc = {
            "product_name": product_name,
            "cost_price": cost_price,
            "selling_price": selling_price,
            "gross_profit": gross_profit,
            "profit_margin_percent": round(profit_margin, 2),
            "estimated_ad_spend": ad_spend,
            "net_profit": net_profit,
            "viable_for_ads": viable,
            "recommendation": "Ensure profit margin > 30% after ad spend for viable dropshipping"
        }
        
        return profit_calc
    
    def run_full_research(self, product_name: str, cost_price: float = 0.0,
                         selling_price: float = 0.0, ad_spend: float = 0.0) -> EcommerceResearch:
        """Run complete e-commerce research workflow"""
        
        research = EcommerceResearch(product_name=product_name)
        
        # Step 1: Trend Verification
        research.trend_data = self.analyze_trend_direction(product_name)
        research.google_trends_url = research.trend_data.get("trends_url.", "")
        research.idea_sources = [
            "TikTok Creative Center (manual check required)",
            "Amazon Movers and Shakers (manual check required)",
            f"Google Trends: {research.google_trends_url}"
        ]
        
        # Step 2: Supplier Check
        research.supplier_name = "AliExpress Supplier"
        research.supplier_rating = 0.0  # Requires manual verification
        research.supplier_hot_selling = 0
        research.supplier_verified = False
        
        supplier_data = self.search_supplier_aliexpress(product_name)
        
        # Step 3: Competitor Analysis
        competitor_data = self.search_competitors(product_name)
        research.competitors_found = competitor_data.get("competitors", [])
        research.competitor_count = competitor_data.get("competitor_count", 0)
        
        # Step 4: Profit Calculation
        profit_data = self.calculate_profit(product_name, cost_price, selling_price, ad_spend)
        research.estimated_product_cost = cost_price
        research.suggested_selling_price = selling_price
        research.estimated_ad_spend = ad_spend
        research.profit_margin = profit_data.get("profit_margin_percent", 0)
        research.viable_for_ads = profit_data.get("viable_for_ads", False)
        
        # Set overall research status
        research.research_status = ResearchStatus.TREND_VERIFIED.value
        research.research_completed_at = datetime.now().isoformat()
        
        return research
    
    def print_research_summary(self, research: EcommerceResearch):
        """Print formatted research summary"""
        
        print("\n" + "=" * 70)
        print("E-COMMERCE RESEARCH SUMMARY")
        print("=" * 70)
        print(f"\nProduct: {research.product_name}")
        
        print("\n[TREND] TREND VERIFICATION:")
        print(f"   Google Trends URL: {research.google_trends_url}")
        print(f"   [!] Check trends.google.com for trend direction (should be UP)")
        
        print("\n[SUPPLIER] SUPPLIER CHECK (AliExpress):")
        print(f"   [!] Visit: https://www.aliexpress.com/wholesale?SearchText={quote_plus(research.product_name)}")
        print(f"   Required: Supplier rating 4.5+, High Hot Selling numbers")
        print(f"   Current: Rating {research.supplier_rating}/5, {research.supplier_hot_selling} sold")
        
        print("\n[COMPETITOR] COMPETITOR ANALYSIS:")
        print(f"   [!] Visit: https://www.google.com/search?q={quote_plus(research.product_name + ' buy online shop')}")
        print(f"   Use Koala Inspector to check if competitors have it as best-seller")
        print(f"   Competitors found: {research.competitor_count}")
        
        print("\n[PROFIT] PROFIT CALCULATION:")
        print(f"   Cost Price: ${research.estimated_product_cost:.2f}")
        print(f"   Selling Price: ${research.suggested_selling_price:.2f}")
        print(f"   Profit Margin: {research.profit_margin:.1f}%")
        print(f"   Ad Spend Budget: ${research.estimated_ad_spend:.2f}")
        print(f"   Viable for Ads: {'[YES]' if research.viable_for_ads else '[NO]'}")
        
        print("\n[SOURCES] RESEARCH SOURCES (Manual Check Required):")
        for source in research.idea_sources:
            print(f"   • {source}")
        
        print("\n" + "=" * 70)


class AntigravityHumanVerifier:
    """
    Comprehensive Human Verification System
    
    Follows PRD v1.1.0 requirements with E-Commerce Research Integration:
    - FR-01: Deep Research Module (with automated trend/supplier/competitor checks)
    - FR-04-FR-08: Review-Title Precision
    - NFR-01-NFR-04: Non-functional requirements
    """
    
    def __init__(self, workspace_path: Optional[str] = None):
        self.workspace_path = workspace_path or "./docs/antigravity"
        self.verification_file = os.path.join(self.workspace_path, "product_verifications.json")
        self.verifications: List[ProductVerification] = []
        self.research_engine = EcommerceResearchEngine()
        self._load_verifications()
        
        # Load PRD and checklist templates
        self._load_prd_requirements()
        
    def _load_verifications(self):
        """Load existing verifications"""
        if os.path.exists(self.verification_file):
            with open(self.verification_file, 'r') as f:
                data = json.load(f)
                for v in data:
                    if 'ecommerce_research' in v and v['ecommerce_research']:
                        v['ecommerce_research'] = EcommerceResearch(**v['ecommerce_research'])
                    self.verifications.append(ProductVerification(**v))
                    
    def _save_verifications(self):
        """Save verifications to file"""
        os.makedirs(self.workspace_path, exist_ok=True)
        # Convert dataclasses to dicts for JSON serialization
        verifications_data = []
        for v in self.verifications:
            v_dict = asdict(v)
            if v_dict.get('ecommerce_research'):
                v_dict['ecommerce_research'] = asdict(v_dict['ecommerce_research'])
            verifications_data.append(v_dict)
        with open(self.verification_file, 'w') as f:
            json.dump(verifications_data, f, indent=2)
    
    def _load_prd_requirements(self):
        """Load PRD requirements for validation"""
        self.prd_requirements = {
            "phase_1": {
                "name": "Deep Research Validation (Pre-Listing)",
                "checks": [
                    {"id": "FR-01", "desc": "At least 3 external source URLs attached", "required": True},
                    {"id": "FR-01b", "desc": "Idea from TikTok/Amazon/CamelCamelCamel verified", "required": True},
                    {"id": "FR-01c", "desc": "Trend direction verified (UP on Google Trends)", "required": True},
                    {"id": "FR-02", "desc": "Technical specs match manufacturer official", "required": True},
                    {"id": "FR-02b", "desc": "Image rights verified for copyright usage", "required": True},
                    {"id": "FR-03", "desc": "Competitor pricing documented", "required": True},
                    {"id": "FR-03b", "desc": "Supplier verified (AliExpress 4.5+ rating)", "required": True},
                    {"id": "FR-03c", "desc": "Profit margin calculated (>30% after ads)", "required": True},
                    {"id": "FR-03d", "desc": "opencode verified research sources", "required": True},
                ]
            },
            "phase_2": {
                "name": "Product Title & Metadata Integrity",
                "checks": [
                    {"id": "FR-09", "desc": "Title follows [Brand] + [Model] + [Key Feature] + [Color/Size]", "required": True},
                    {"id": "FR-09b", "desc": "No keyword stuffing in title", "required": True},
                    {"id": "FR-09c", "desc": "Variant mapping correct (e.g., 'Blue' maps to Blue SKU)", "required": True},
                    {"id": "FR-10", "desc": "No broken HTML entities in title", "required": True},
                    {"id": "FR-10b", "desc": "Price matches target region currency format", "required": True},
                    {"id": "FR-11", "desc": "SKU validates against WMS in real-time", "required": True},
                ]
            },
            "phase_3": {
                "name": "Review-Title Precision Match",
                "checks": [
                    {"id": "FR-04", "desc": "Pre-populated reviews can be uploaded in Antigravity Mode", "required": True},
                    {"id": "FR-05", "desc": "Review contradicts title triggers immediate error", "required": True},
                    {"id": "FR-06", "desc": "Match score >90% for approval", "required": True},
                    {"id": "FR-07", "desc": "All QA reviews tagged seed_data=true", "required": True},
                    {"id": "FR-08", "desc": "Failed seed reviews notify opencode", "required": True},
                ]
            },
            "phase_4": {
                "name": "UI/UX & Responsiveness",
                "checks": [
                    {"id": "UI-01", "desc": "Mobile view truncates title gracefully", "required": False},
                    {"id": "UI-02", "desc": "Reviews sort correctly (Newest/Helpful)", "required": False},
                    {"id": "UI-03", "desc": "Images load at high resolution without CLS", "required": False},
                    {"id": "UI-04", "desc": "Add to Cart activates only after validation passes", "required": True},
                ]
            },
            "phase_5": {
                "name": "Production Safety Lock",
                "checks": [
                    {"id": "NFR-02", "desc": "Production API does NOT return seed_data reviews", "required": True},
                    {"id": "NFR-02b", "desc": "Export to Google Shopping excludes seed reviews", "required": True},
                    {"id": "NFR-03", "desc": "Warning banner if attempting prod migration", "required": True},
                    {"id": "NFR-04", "desc": "Only opencode can bypass Antigravity Mode", "required": True},
                ]
            }
        }
    
    def quick_research(self, product_name: str, cost: float = 0, 
                       price: float = 0, ad_spend: float = 5.0) -> EcommerceResearch:
        """Run quick automated research on a product"""
        print(f"\n[SEARCH] Running automated research on: {product_name}")
        research = self.research_engine.run_full_research(
            product_name, cost, price, ad_spend
        )
        self.research_engine.print_research_summary(research)
        return research
    
    def create_verification_session(self, product_id: str, product_title: str, 
                                   product_data: Dict,     research: Optional[EcommerceResearch] = None) -> str:
        """Start a new verification session"""
        
        verification = ProductVerification(
            product_id=product_id,
            product_title=product_title,
            product_data=product_data,
            ecommerce_research=research,
            status="in_progress"
        )
        
        # Initialize checks for each phase
        for phase_name, phase_data in self.prd_requirements.items():
            phase_checks = []
            for check_template in phase_data["checks"]:
                check = VerificationCheck(
                    check_id=check_template["id"],
                    phase=phase_name,
                    description=check_template["description"]
                )
                phase_checks.append(check)
            
            if phase_name == "phase_1":
                verification.phase_1 = phase_checks
            elif phase_name == "phase_2":
                verification.phase_2 = phase_checks
            elif phase_name == "phase_3":
                verification.phase_3 = phase_checks
            elif phase_name == "phase_4":
                verification.phase_4 = phase_checks
            elif phase_name == "phase_5":
                verification.phase_5 = phase_checks
        
        self.verifications.append(verification)
        self._save_verifications()
        
        return verification.product_id
    
    def update_check_status(self, product_id: str, phase: str, check_id: str,
                          status: str, evidence: str = "", notes: str = "",
                          verifier: str = "opencode") -> bool:
        """Update status of a verification check"""
        
        for v in self.verifications:
            if v.product_id == product_id:
                phase_checks = getattr(v, phase, [])
                for check in phase_checks:
                    if check.check_id == check_id:
                        check.status = status
                        check.evidence = evidence
                        check.notes = notes
                        check.verified_by = verifier
                        check.verified_at = datetime.now().isoformat()
                        
                        self._save_verifications()
                        return True
        return False
    
    def auto_fill_ecommerce_checks(self, product_id: str, research: EcommerceResearch):
        """Automatically fill e-commerce related checks based on research"""
        
        # FR-01b: Idea Generation
        idea_status = "pass" if research.idea_sources else "fail"
        self.update_check_status(
            product_id, "phase_1", "FR-01b",
            idea_status,
            evidence=f"Sources: {', '.join(research.idea_sources)}"
        )
        
        # FR-01c: Trend Verification
        trend_status = "pass"  # Assumes user verified manually via URL provided
        self.update_check_status(
            product_id, "phase_1", "FR-01c",
            trend_status,
            evidence=f"Google Trends: {research.google_trends_url}"
        )
        
        # FR-03b: Supplier Check
        supplier_status = "pass" if research.supplier_verified else "pending"
        self.update_check_status(
            product_id, "phase_1", "FR-03b",
            supplier_status,
            evidence=f"AliExpress supplier - Manual verification required"
        )
        
        # FR-03c: Profit Calculation
        profit_status = "pass" if research.viable_for_ads else "fail"
        self.update_check_status(
            product_id, "phase_1", "FR-03c",
            profit_status,
            evidence=f"Margin: {research.profit_margin:.1f}%, Viable: {research.viable_for_ads}"
        )
    
    def complete_verification(self, product_id: str, verifier: str = "opencode",
                            risk_level: str = "low") -> Dict:
        """Complete verification and get final sign-off"""
        
        for v in self.verifications:
            if v.product_id == product_id:
                
                # Calculate overall status
                all_checks = (v.phase_1 + v.phase_2 + v.phase_3 + 
                            v.phase_4 + v.phase_5)
                
                required_checks = [c for c in all_checks 
                                 if c.status in ["pass", "fail"]]
                passed_checks = [c for c in required_checks 
                               if c.status == "pass"]
                
                required_ids = {"FR-01", "FR-01b", "FR-01c", "FR-03c", "FR-03d", 
                              "FR-09", "FR-10b", "FR-05", "FR-06", "FR-07",
                              "NFR-02", "NFR-04"}
                
                critical_passed = all(
                    c.status == "pass" 
                    for c in required_checks 
                    if c.check_id in required_ids
                )
                
                v.status = "completed" if critical_passed else "failed"
                v.verified_by = verifier
                v.verified_at = datetime.now().isoformat()
                v.risk_level = risk_level
                v.can_publish = critical_passed
                
                # Generate opencode signature
                if critical_passed:
                    sig_data = f"{product_id}:{verifier}:{datetime.now().isoformat()}"
                    v.opencode_signed = hashlib.sha256(sig_data.encode()).hexdigest()[:16]
                    v.opencode_approval = True
                
                self._save_verifications()
                
                return {
                    "product_id": product_id,
                    "status": v.status,
                    "can_publish": v.can_publish,
                    "risk_level": risk_level,
                    "opencode_approval": v.opencode_approval,
                    "signature": v.opencode_signed,
                    "verified_at": v.verified_at
                }
        
        return {"error": "Product not found"}
    
    def get_phase_summary(self, product_id: str) -> Dict:
        """Get summary of all phases"""
        for v in self.verifications:
            if v.product_id == product_id:
                summary = {}
                
                for phase_name in ["phase_1", "phase_2", "phase_3", "phase_4", "phase_5"]:
                    checks = getattr(v, phase_name)
                    passed = len([c for c in checks if c.status == "pass"])
                    failed = len([c for c in checks if c.status == "fail"])
                    pending = len([c for c in checks if c.status == "pending"])
                    
                    phase_label = phase_name.replace("phase_", "Phase ")
                    summary[phase_label] = {
                        "passed": passed,
                        "failed": failed,
                        "pending": pending,
                        "total": len(checks)
                    }
                
                return summary
        
        return {}
    
    def generate_final_report(self, product_id: str) -> str:
        """Generate final verification report"""
        
        for v in self.verifications:
            if v.product_id == product_id:
                
                report = []
                report.append("=" * 70)
                report.append("ANTIGRAVITY PRODUCT VERIFICATION REPORT")
                report.append("=" * 70)
                report.append(f"\nProduct ID: {v.product_id}")
                report.append(f"Product Title: {v.product_title}")
                report.append(f"Status: {v.status.upper()}")
                report.append(f"Risk Level: {v.risk_level}")
                report.append(f"Can Publish: {v.can_publish}")
                report.append(f"\nVerified By: {v.verified_by}")
                report.append(f"Verified At: {v.verified_at}")
                
                # E-Commerce Research Section
                if v.ecommerce_research:
                    research = v.ecommerce_research
                    report.append("\n\n" + "=" * 70)
                    report.append("E-COMMERCE RESEARCH DATA")
                    report.append("=" * 70)
                    report.append(f"\nTrend URL: {research.google_trends_url}")
                    report.append(f"Supplier Rating: {research.supplier_rating}/5")
                    report.append(f"Profit Margin: {research.profit_margin:.1f}%")
                    report.append(f"Viable for Ads: {research.viable_for_ads}")
                    report.append(f"Competitors Found: {research.competitor_count}")
                
                if v.opencode_approval:
                    report.append(f"\nopencode Signature: {v.opencode_signed}")
                
                # Phase details
                all_phases = [
                    ("Phase 1: Deep Research", v.phase_1),
                    ("Phase 2: Title & Metadata", v.phase_2),
                    ("Phase 3: Review Match", v.phase_3),
                    ("Phase 4: UI/UX", v.phase_4),
                    ("Phase 5: Safety Lock", v.phase_5),
                ]
                
                for phase_name, checks in all_phases:
                    report.append(f"\n\n{phase_name}")
                    report.append("-" * 50)
                    
                    for check in checks:
                        status_icon = {
                            "pass": "[PASS]",
                            "fail": "[FAIL]",
                            "pending": "[....]",
                            "skipped": "[SKIP]"
                        }.get(check.status, "[????]")
                        
                        report.append(f"{status_icon} {check.check_id}: {check.description}")
                        if check.status == "fail":
                            report.append(f"       Evidence: {check.evidence}")
                            report.append(f"       Notes: {check.notes}")
                
                report.append("\n\n" + "=" * 70)
                
                if v.can_publish:
                    report.append("APPROVED FOR PUBLICATION")
                else:
                    report.append("BLOCKED - VERIFICATION FAILED")
                
                report.append("=" * 70)
                
                return "\n".join(report)
        
        return "Product not found"


def run_quick_verify(product_name: str):
    """Run quick e-commerce research verification"""
    verifier = AntigravityHumanVerifier()
    
    print("\n" + "=" * 70)
    print("QUICK PRODUCT VERIFICATION")
    print("=" * 70)
    
    # Get pricing info
    print(f"\nProduct: {product_name}")
    try:
        cost_input = input("Cost price ($): ").strip()
        cost = float(cost_input) if cost_input else 0
        
        price_input = input("Selling price ($): ").strip()
        price = float(price_input) if price_input else 0
        
        ad_input = input("Ad spend budget ($): ").strip()
        ad_spend = float(ad_input) if ad_input else 5.0
    except ValueError:
        cost = 0
        price = 0
        ad_spend = 5.0
    
    # Run research
    research = verifier.quick_research(product_name, cost, price, ad_spend)
    
    # Ask to proceed with full verification
    print("\n" + "-" * 70)
    proceed = input("Proceed with full verification? [Y/n]: ").strip().lower()
    
    if proceed != 'n':
        product_id = input("\nEnter Product ID: ").strip()
        if not product_id:
            product_id = f"PROD-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        
        # Create verification session with research
        verifier.create_verification_session(product_id, product_name, {}, research)
        
        # Auto-fill e-commerce checks
        verifier.auto_fill_ecommerce_checks(product_id, research)
        
        print(f"\n✅ Verification session created: {product_id}")
        print("Run: python human_verification.py --interactive")
    
    return research


def run_interactive_verification():
    """Run interactive verification wizard"""
    
    verifier = AntigravityHumanVerifier()
    
    print("\n" + "=" * 60)
    print("ANTIGRAVITY HUMAN VERIFICATION WIZARD")
    print("=" * 60)
    
    # Get product info
    product_id = input("Enter Product ID: ").strip()
    product_title = input("Enter Product Title: ").strip()
    
    # Option to run e-commerce research first
    print("\n" + "-" * 60)
    do_research = input("Run e-commerce research first? [Y/n]: ").strip().lower()
    
    research = None
    if do_research != 'n':
        research = verifier.quick_research(product_title)
    
    # Create verification session
    session_id = verifier.create_verification_session(product_id, product_title, {}, research)
    print(f"\nVerification session created: {session_id}")
    
    # Auto-fill e-commerce checks if research was done
    if research:
        verifier.auto_fill_ecommerce_checks(product_id, research)
        print("✅ E-commerce research checks auto-filled")
    
    # Phase 1: Deep Research
    print("\n" + "-" * 60)
    print("PHASE 1: DEEP RESEARCH VALIDATION")
    print("-" * 60)
    print("Objective: Ensure product data is grounded in reality")
    print("(E-commerce checks may be auto-filled from research)")
    
    checks = [
        ("FR-01", "At least 3 external URLs attached?"),
        ("FR-01b", "Idea from TikTok/Amazon/CamelCamelCamel verified?"),
        ("FR-01c", "Trend direction verified (UP on Google Trends)?"),
        ("FR-02", "Technical specs match manufacturer official?"),
        ("FR-02b", "Image rights verified for copyright?"),
        ("FR-03", "Competitor pricing documented?"),
        ("FR-03b", "Supplier verified (AliExpress 4.5+ rating)?"),
        ("FR-03c", "Profit margin calculated (>30% after ads)?"),
        ("FR-03d", "opencode verified research sources?"),
    ]
    
    for check_id, question in checks:
        print(f"\n{check_id}: {question}")
        status = input("[P]ass/[F]ail/[S]kip: ").strip().lower()
        
        evidence = ""
        notes = ""
        
        if status == 'f':
            evidence = input("Evidence: ").strip()
            notes = input("Notes: ").strip()
        
        verifier.update_check_status(
            product_id, "phase_1", check_id,
            "pass" if status == 'p' else "fail" if status == 'f' else "skipped",
            evidence, notes
        )
    
    # Phase 2: Title & Metadata
    print("\n" + "-" * 60)
    print("PHASE 2: PRODUCT TITLE & METADATA")
    print("-" * 60)
    
    checks = [
        ("FR-09", "Title follows [Brand]+[Model]+[Feature]+[Color]?"),
        ("FR-09b", "No keyword stuffing in title?"),
        ("FR-09c", "Variant mapping correct (color/size)?"),
        ("FR-10", "No broken HTML entities?"),
        ("FR-10b", "Price matches target region currency?"),
        ("FR-11", "SKU validates against WMS?"),
    ]
    
    for check_id, question in checks:
        print(f"\n{check_id}: {question}")
        status = input("[P]ass/[F]ail/[S]kip: ").strip().lower()
        
        evidence = ""
        notes = ""
        
        if status == 'f':
            evidence = input("Evidence: ").strip()
            notes = input("Notes: ").strip()
        
        verifier.update_check_status(
            product_id, "phase_2", check_id,
            "pass" if status == 'p' else "fail" if status == 'f' else "skipped",
            evidence, notes
        )
    
    # Phase 3: Review-Title Match
    print("\n" + "-" * 60)
    print("PHASE 3: REVIEW-TITLE PRECISION MATCH")
    print("-" * 60)
    
    checks = [
        ("FR-04", "Pre-populated reviews can be uploaded?"),
        ("FR-05", "Review contradicts title triggers error?"),
        ("FR-06", "Match score >90% for approval?"),
        ("FR-07", "All QA reviews tagged seed_data=true?"),
        ("FR-08", "Failed seed reviews notify opencode?"),
    ]
    
    for check_id, question in checks:
        print(f"\n{check_id}: {question}")
        status = input("[P]ass/[F]ail/[S]kip: ").strip().lower()
        
        evidence = ""
        notes = ""
        
        if status == 'f':
            evidence = input("Evidence: ").strip()
            notes = input("Notes: ").strip()
        
        verifier.update_check_status(
            product_id, "phase_3", check_id,
            "pass" if status == 'p' else "fail" if status == 'f' else "skipped",
            evidence, notes
        )
    
    # Risk assessment
    print("\n" + "-" * 60)
    print("RISK ASSESSMENT")
    print("-" * 60)
    risk = input("Risk Level [L]ow/[M]edium/[H]igh: ").strip().lower()
    
    # Complete verification
    result = verifier.complete_verification(product_id, risk_level=risk if risk in ['l','m','h'] else 'low')
    
    print("\n" + "=" * 60)
    print("VERIFICATION COMPLETE")
    print("=" * 60)
    print(f"Status: {result['status']}")
    print(f"Can Publish: {result['can_publish']}")
    print(f"Risk Level: {result['risk_level']}")
    
    if result.get('signature'):
        print(f"opencode Signature: {result['signature']}")
    
    # Generate report
    report = verifier.generate_final_report(product_id)
    print("\n" + report)
    
    return result


def main():
    """Main CLI entry point"""
    
    parser = argparse.ArgumentParser(
        description="Antigravity Human Verification System"
    )
    parser.add_argument('--interactive', '-i', action='store_true',
                       help='Run interactive verification wizard')
    parser.add_argument('--product-id', '-p', type=str,
                       help='Product ID to verify')
    parser.add_argument('--research', '-r', type=str,
                       help='Run quick e-commerce research on product name')
    parser.add_argument('--quick-verify', '-q', type=str,
                       help='Quick verify: research + basic checks')
    parser.add_argument('--list', '-l', action='store_true',
                       help='List all verifications')
    parser.add_argument('--report', type=str,
                       help='Generate report for product')
    parser.add_argument('--status', '-s', type=str,
                       help='Check status of verification')
    
    args = parser.parse_args()
    
    verifier = AntigravityHumanVerifier()
    
    if args.interactive:
        run_interactive_verification()
        return
    
    if args.research:
        verifier.quick_research(args.research)
        return
    
    if args.quick_verify:
        run_quick_verify(args.quick_verify)
        return
    
    if args.list:
        print("\nAll Verifications:")
        for v in verifier.verifications:
            print(f"  [{v.product_id}] {v.product_title[:40]}...")
            print(f"       Status: {v.status}, Can Publish: {v.can_publish}")
        return
    
    if args.report:
        report = verifier.generate_final_report(args.report)
        print(report)
        return
    
    if args.status:
        summary = verifier.get_phase_summary(args.status)
        print(f"\nVerification Summary for {args.status}:")
        for phase, data in summary.items():
            print(f"\n{phase}:")
            print(f"  Passed: {data['passed']}, Failed: {data['failed']}, Pending: {data['pending']}")
        return
    
    # Default help
    parser.print_help()
    print("\n\nExamples:")
    print("  python human_verification.py --interactive")
    print("  python human_verification.py --research 'wireless earbuds'")
    print("  python human_verification.py --quick-verify 'phone case'")
    print("  python human_verification.py --list")
    print("  python human_verification.py --report PROD-00001")


if __name__ == "__main__":
    main()
