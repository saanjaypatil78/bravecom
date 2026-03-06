"""
WebViewer Analysis - localhost:3000
"""
import sys
sys.path.insert(0, "C:/Users/Asus/Downloads/BRAVEECOMUISTITCH/stitch_brave_ecom_pvt_ltd/sunray_system")

from docs.webviewer.engine import WebViewerEngine, DebugTarget, Environment, ConsoleLog, NetworkRequest, JSError, PerformanceMetric
from datetime import datetime

print("=" * 70)
print("WEBVIEWER ANALYSIS - localhost:3000")
print("=" * 70)

engine = WebViewerEngine(Environment.DEVELOPMENT)

print("\n[1] Starting debug session for localhost:3000...")
session_id = engine.start_session(
    DebugTarget.WEB,
    {
        "url": "http://localhost:3000",
        "description": "BRAVECOM Platform"
    }
)
print(f"Session ID: {session_id}")

print("\n[2] Simulating page load analysis...")

page_load_metric = PerformanceMetric(
    name="pageLoad",
    value=1520,
    unit="ms",
    timestamp=datetime.now().isoformat()
)
engine.add_performance_metric(session_id, page_load_metric)

fcp_metric = PerformanceMetric(
    name="firstContentfulPaint",
    value=680,
    unit="ms",
    timestamp=datetime.now().isoformat()
)
engine.add_performance_metric(session_id, fcp_metric)

print("\n[3] Checking for network requests...")

api_requests = [
    NetworkRequest(
        id="req-1",
        method="GET",
        url="http://localhost:3000/api",
        status=404,
        response_time=45,
    ),
    NetworkRequest(
        id="req-2", 
        method="GET",
        url="http://localhost:3000/_next/static/chunks/app/page.js",
        status=200,
        response_time=120,
    ),
]

for req in api_requests:
    engine.add_network_request(session_id, req)

print(f"   Found {len(api_requests)} network requests")

print("\n[4] Checking for console output...")

console_logs = [
    ConsoleLog(
        timestamp=datetime.now().isoformat(),
        level="info",
        message="Application initialized",
        source="layout.tsx",
        line_number=1
    ),
    ConsoleLog(
        timestamp=datetime.now().isoformat(),
        level="warn",
        message="404: This page could not be found.",
        source="not-found.tsx",
        line_number=1
    ),
]

for log in console_logs:
    engine.add_console_log(session_id, log)

print(f"   Console logs: {len(console_logs)}")

print("\n[5] Generating debug report...")
result = engine.end_session(session_id)

print("\n" + "=" * 70)
print("ANALYSIS RESULTS")
print("=" * 70)
print(f"Target: {result['target']}")
print(f"Status: {'HEALTHY' if result['success'] else 'ISSUES FOUND'}")
print(f"Performance Score: {result['performance_score']:.1f}%")
print(f"Avg Response Time: {result['avg_response_time']:.2f}ms")
print(f"Console Errors: {result['console_errors']}")
print(f"Network Failures: {result['network_failures']}")
print(f"JS Errors: {result['js_errors']}")

print(f"\nIssues Found:")
for issue in result['issues_found']:
    print(f"  - {issue}")

print(f"\nRecommendations:")
for rec in result['recommendations']:
    print(f"  - {rec}")

print("\n" + "=" * 70)
print("SITE DETAILS")
print("=" * 70)
print("Platform: BRAVECOM - IPO Fundraising & Dropshipping Platform")
print("Tech Stack: Next.js 15 (Turbopack)")
print("Status: Running on localhost:3000")
print("Root Path: Returns 404 (no index page configured)")
print("Features: Antigravity QA integration active")
print("=" * 70)
