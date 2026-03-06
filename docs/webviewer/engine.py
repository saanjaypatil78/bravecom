"""
WEBVIEWER ENGINE - Debugging & Testing System
==============================================
Version: 1.0.0
Project Codename: WebViewer
Owner: opencode
QA Lead: opencode

This module implements the WebViewer debugging system
for websites and emulator/mobile app testing.
"""

import json
import time
import hashlib
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Optional, Tuple
from datetime import datetime
from enum import Enum


class DebugTarget(Enum):
    WEB = "web"
    EMULATOR = "emulator"
    MOBILE_APP = "mobile_app"


class Environment(Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


@dataclass
class ConsoleLog:
    """Console log entry"""
    timestamp: str
    level: str  # log, info, warn, error
    message: str
    source: str
    line_number: Optional[int] = None
    stack_trace: Optional[str] = None


@dataclass
class NetworkRequest:
    """Network request/response log"""
    id: str
    method: str
    url: str
    status: int
    response_time: float
    request_headers: Dict = field(default_factory=dict)
    response_headers: Dict = field(default_factory=dict)
    request_body: Optional[str] = None
    response_body: Optional[str] = None
    error: Optional[str] = None


@dataclass
class JSError:
    """JavaScript error capture"""
    id: str
    message: str
    stack: str
    source: str
    line: int
    column: int
    timestamp: str
    context: Dict = field(default_factory=dict)


@dataclass
class PerformanceMetric:
    """Performance metric entry"""
    name: str
    value: float
    unit: str
    timestamp: str
    details: Dict = field(default_factory=dict)


@dataclass
class TestSession:
    """Test session for debugging"""
    id: str
    target: DebugTarget
    environment: Environment
    started_at: str
    ended_at: Optional[str] = None
    status: str = "running"
    console_logs: List[ConsoleLog] = field(default_factory=list)
    network_requests: List[NetworkRequest] = field(default_factory=list)
    js_errors: List[JSError] = field(default_factory=list)
    performance_metrics: List[PerformanceMetric] = field(default_factory=list)
    screenshots: List[str] = field(default_factory=list)
    metadata: Dict = field(default_factory=dict)

    def __post_init__(self):
        if not self.id:
            self.id = self._generate_id()

    def _generate_id(self) -> str:
        data = f"{self.target.value}:{self.environment.value}:{self.started_at}"
        return hashlib.md5(data.encode()).hexdigest()[:12]


@dataclass
class DebugResult:
    """Debug session result"""
    session_id: str
    target: str
    success: bool
    issues_found: List[str] = field(default_factory=list)
    console_errors: int = 0
    network_failures: int = 0
    js_errors: int = 0
    avg_response_time: float = 0.0
    performance_score: float = 0.0
    recommendations: List[str] = field(default_factory=list)


class WebViewerEngine:
    """
    Core Engine for WebViewer Debugging & Testing
    
    Implements:
    - Web browser debugging
    - Emulator debugging
    - Mobile app debugging
    - Console log capture
    - Network request logging
    - JS error capture
    - Performance profiling
    """
    
    def __init__(self, environment: Environment = Environment.DEVELOPMENT):
        self.environment = environment
        self.sessions: Dict[str, TestSession] = {}
        self.global_settings = self._load_global_settings()
        
    def _load_global_settings(self) -> Dict:
        """Load global settings from workspace.json"""
        try:
            with open("./docs/webviewer/workspace.json", "r") as f:
                config = json.load(f)
                return config.get("global_settings", {})
        except FileNotFoundError:
            return {
                "enabled": True,
                "debug_mode": True,
                "log_level": "verbose",
                "capture_all_requests": True,
                "performance_monitoring": True,
                "error_tracking": True
            }

    def start_session(self, target: DebugTarget, metadata: Dict = None) -> str:
        """Start a new debug session"""
        meta = metadata if metadata is not None else {}
        session = TestSession(
            id="",
            target=target,
            environment=self.environment,
            started_at=datetime.now().isoformat(),
            metadata=meta
        )
        self.sessions[session.id] = session
        return session.id

    def end_session(self, session_id: str) -> Dict:
        """End a debug session and generate report"""
        if session_id not in self.sessions:
            return {"success": False, "error": "Session not found"}
            
        session = self.sessions[session_id]
        session.ended_at = datetime.now().isoformat()
        session.status = "completed"
        
        return self._generate_debug_report(session).__dict__

    def add_console_log(self, session_id: str, log: ConsoleLog) -> Dict:
        """Add console log to session"""
        if session_id not in self.sessions:
            return {"success": False, "error": "Session not found"}
            
        session = self.sessions[session_id]
        session.console_logs.append(log)
        
        return {"success": True, "log_count": len(session.console_logs)}

    def add_network_request(self, session_id: str, request: NetworkRequest) -> Dict:
        """Add network request to session"""
        if session_id not in self.sessions:
            return {"success": False, "error": "Session not found"}
            
        session = self.sessions[session_id]
        session.network_requests.append(request)
        
        return {"success": True, "request_count": len(session.network_requests)}

    def add_js_error(self, session_id: str, error: JSError) -> Dict:
        """Add JS error to session"""
        if session_id not in self.sessions:
            return {"success": False, "error": "Session not found"}
            
        session = self.sessions[session_id]
        session.js_errors.append(error)
        
        return {"success": True, "error_count": len(session.js_errors)}

    def add_performance_metric(self, session_id: str, metric: PerformanceMetric) -> Dict:
        """Add performance metric to session"""
        if session_id not in self.sessions:
            return {"success": False, "error": "Session not found"}
            
        session = self.sessions[session_id]
        session.performance_metrics.append(metric)
        
        return {"success": True, "metric_count": len(session.performance_metrics)}

    def add_screenshot(self, session_id: str, screenshot_path: str) -> Dict:
        """Add screenshot to session"""
        if session_id not in self.sessions:
            return {"success": False, "error": "Session not found"}
            
        session = self.sessions[session_id]
        session.screenshots.append(screenshot_path)
        
        return {"success": True, "screenshot_count": len(session.screenshots)}

    def _generate_debug_report(self, session: TestSession) -> DebugResult:
        """Generate debug report for session"""
        
        console_errors = [log for log in session.console_logs if log.level == "error"]
        network_failures = [req for req in session.network_requests if req.status >= 400]
        js_errors_count = len(session.js_errors)
        
        avg_response_time = 0.0
        if session.network_requests:
            total_time = sum(req.response_time for req in session.network_requests)
            avg_response_time = total_time / len(session.network_requests)
        
        performance_score = self._calculate_performance_score(session)
        
        issues = []
        recommendations = []
        
        if console_errors:
            issues.append(f"{len(console_errors)} console errors found")
            recommendations.append("Review and fix console errors")
            
        if network_failures:
            issues.append(f"{len(network_failures)} network failures found")
            recommendations.append("Check API endpoints and error responses")
            
        if js_errors_count > 0:
            issues.append(f"{js_errors_count} JavaScript errors found")
            recommendations.append("Fix JavaScript errors in source code")
            
        if avg_response_time > 2000:
            issues.append(f"Slow average response time: {avg_response_time:.0f}ms")
            recommendations.append("Optimize network requests and server response time")
            
        if performance_score < 70:
            issues.append(f"Low performance score: {performance_score:.1f}%")
            recommendations.append("Improve performance metrics")
        
        return DebugResult(
            session_id=session.id,
            target=session.target.value,
            success=len(issues) == 0,
            issues_found=issues,
            console_errors=len(console_errors),
            network_failures=len(network_failures),
            js_errors=js_errors_count,
            avg_response_time=avg_response_time,
            performance_score=performance_score,
            recommendations=recommendations
        )

    def _calculate_performance_score(self, session: TestSession) -> float:
        """Calculate overall performance score"""
        score = 100.0
        
        error_weight = 10
        network_weight = 5
        time_weight = 0.01
        
        score -= len(session.js_errors) * error_weight
        score -= len([r for r in session.network_requests if r.status >= 400]) * network_weight
        
        if session.network_requests:
            avg_time = sum(r.response_time for r in session.network_requests) / len(session.network_requests)
            score -= avg_time * time_weight
        
        return max(0.0, min(100.0, score))

    def get_session_summary(self, session_id: str) -> Dict:
        """Get summary of a session"""
        if session_id not in self.sessions:
            return {"error": "Session not found"}
            
        session = self.sessions[session_id]
        report = self._generate_debug_report(session)
        
        return {
            "session_id": session.id,
            "target": session.target.value,
            "environment": session.environment.value,
            "status": session.status,
            "started_at": session.started_at,
            "ended_at": session.ended_at,
            "duration_seconds": self._calculate_duration(session),
            "console_logs": len(session.console_logs),
            "network_requests": len(session.network_requests),
            "js_errors": len(session.js_errors),
            "screenshots": len(session.screenshots),
            "performance_metrics": len(session.performance_metrics),
            "debug_result": asdict(report)
        }

    def _calculate_duration(self, session: TestSession) -> float:
        """Calculate session duration in seconds"""
        start = datetime.fromisoformat(session.started_at)
        end = datetime.fromisoformat(session.ended_at) if session.ended_at else datetime.now()
        return (end - start).total_seconds()

    def list_sessions(self, status: str = None) -> List[Dict]:
        """List all sessions, optionally filtered by status"""
        sessions = []
        filter_status = status if status is not None else None
        for session in self.sessions.values():
            if filter_status and session.status != filter_status:
                continue
            sessions.append({
                "id": session.id,
                "target": session.target.value,
                "environment": session.environment.value,
                "status": session.status,
                "started_at": session.started_at
            })
        return sessions


class DebugValidator:
    """Validation utilities for WebViewer"""
    
    @staticmethod
    def validate_console_logs(logs: List[ConsoleLog]) -> Dict:
        """Validate console logs for errors"""
        errors = [log for log in logs if log.level == "error"]
        warnings = [log for log in logs if log.level == "warn"]
        
        return {
            "valid": len(errors) == 0,
            "errors": len(errors),
            "warnings": len(warnings),
            "critical_errors": [e.message for e in errors[:5]]
        }
    
    @staticmethod
    def validate_network_requests(requests: List[NetworkRequest]) -> Dict:
        """Validate network requests for failures"""
        failures = [req for req in requests if req.status >= 400]
        slow_requests = [req for req in requests if req.response_time > 3000]
        
        return {
            "valid": len(failures) == 0,
            "failures": len(failures),
            "slow_requests": len(slow_requests),
            "failure_urls": [r.url for r in failures[:5]],
            "avg_response_time": sum(r.response_time for r in requests) / len(requests) if requests else 0
        }
    
    @staticmethod
    def validate_performance(metrics: List[PerformanceMetric]) -> Dict:
        """Validate performance metrics"""
        score = 100.0
        
        timing_metrics = [m for m in metrics if m.name in ["domContentLoaded", "load", "firstContentfulPaint"]]
        for metric in timing_metrics:
            if metric.name == "firstContentfulPaint" and metric.value > 2000:
                score -= 10
            elif metric.name == "domContentLoaded" and metric.value > 3000:
                score -= 10
            elif metric.name == "load" and metric.value > 5000:
                score -= 10
        
        return {
            "score": max(0, score),
            "metrics_count": len(metrics),
            "passed": score >= 70
        }


def run_webviewer_demo():
    """Demonstrate WebViewer Engine functionality"""
    
    print("=" * 70)
    print("WEBVIEWER ENGINE - Debugging & Testing System")
    print("Version 1.0.0 | Project Codename: WebViewer")
    print("=" * 70)
    
    engine = WebViewerEngine(Environment.DEVELOPMENT)
    
    print("\n[TEST 1] Starting Web Debug Session...")
    session_id = engine.start_session(DebugTarget.WEB, {"url": "http://localhost:3000"})
    print(f"Session Started: {session_id}")
    
    print("\n[TEST 2] Adding Console Logs...")
    logs = [
        ConsoleLog(
            timestamp=datetime.now().isoformat(),
            level="info",
            message="Application initialized",
            source="app.js",
            line_number=10
        ),
        ConsoleLog(
            timestamp=datetime.now().isoformat(),
            level="error",
            message="Failed to load user data",
            source="api.js",
            line_number=45,
            stack_trace="TypeError: Cannot read property 'data' of undefined"
        ),
    ]
    
    for log in logs:
        engine.add_console_log(session_id, log)
    print(f"Added {len(logs)} console logs")
    
    print("\n[TEST 3] Adding Network Requests...")
    requests = [
        NetworkRequest(
            id="req-1",
            method="GET",
            url="/api/users",
            status=200,
            response_time=150
        ),
        NetworkRequest(
            id="req-2",
            method="POST",
            url="/api/auth/login",
            status=401,
            response_time=80,
            error="Unauthorized"
        ),
    ]
    
    for req in requests:
        engine.add_network_request(session_id, req)
    print(f"Added {len(requests)} network requests")
    
    print("\n[TEST 4] Adding JS Error...")
    error = JSError(
        id="err-1",
        message="TypeError: Cannot read property 'data' of undefined",
        stack="at ApiService.getUser (api.js:45:12)",
        source="api.js",
        line=45,
        column=12,
        timestamp=datetime.now().isoformat()
    )
    engine.add_js_error(session_id, error)
    print(f"Added JS error")
    
    print("\n[TEST 5] Adding Performance Metrics...")
    metrics = [
        PerformanceMetric(
            name="firstContentfulPaint",
            value=1200,
            unit="ms",
            timestamp=datetime.now().isoformat()
        ),
        PerformanceMetric(
            name="domContentLoaded",
            value=2500,
            unit="ms",
            timestamp=datetime.now().isoformat()
        ),
    ]
    
    for metric in metrics:
        engine.add_performance_metric(session_id, metric)
    print(f"Added {len(metrics)} performance metrics")
    
    print("\n[TEST 6] Ending Session and Generating Report...")
    result = engine.end_session(session_id)
    
    print(f"\n--- DEBUG REPORT ---")
    print(f"Target: {result['target']}")
    print(f"Success: {result['success']}")
    print(f"Console Errors: {result['console_errors']}")
    print(f"Network Failures: {result['network_failures']}")
    print(f"JS Errors: {result['js_errors']}")
    print(f"Avg Response Time: {result['avg_response_time']:.2f}ms")
    print(f"Performance Score: {result['performance_score']:.1f}%")
    print(f"Issues Found: {result['issues_found']}")
    print(f"Recommendations: {result['recommendations']}")
    
    print("\n[TEST 7] Session Summary...")
    summary = engine.get_session_summary(session_id)
    print(f"Session Duration: {summary['duration_seconds']:.2f}s")
    print(f"Console Logs: {summary['console_logs']}")
    print(f"Network Requests: {summary['network_requests']}")
    print(f"Screenshots: {summary['screenshots']}")
    
    print("\n" + "=" * 70)
    print("WEBVIEWER DEBUGGING COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    run_webviewer_demo()
