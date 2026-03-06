# WebViewer Project Workspace

## Overview

**Project:** BRAVEECOM_STITCH  
**Version:** 1.0.0  
**Status:** Active  
**QA Lead:** opencode  

---

## Project Structure

```
docs/webviewer/
├── workspace.json          # Main workspace configuration
├── engine.py              # Core WebViewer Engine
├── README.md             # This file
└── debug_sessions.json   # Session storage (auto-generated)
```

---

## Quick Start

### 1. Run WebViewer Demo

```bash
python docs/webviewer/engine.py
```

### 2. Import Engine

```python
from docs.webviewer.engine import WebViewerEngine, DebugTarget, Environment

engine = WebViewerEngine(Environment.DEVELOPMENT)

session_id = engine.start_session(DebugTarget.WEB, {"url": "http://localhost:3000"})

engine.add_console_log(session_id, ConsoleLog(...))
engine.add_network_request(session_id, NetworkRequest(...))
engine.add_js_error(session_id, JSError(...))

result = engine.end_session(session_id)
print(result)
```

---

## Configuration

### Environment Variables

Add to `.env`:

```env
# Workspace
WEBVIEWER_WORKSPACE=./docs/webviewer
WEBVIEWER_ENABLED=true
WEBVIEWER_AUTO_SYNC=true
WEBVIEWER_SYNC_INTERVAL=300

# QA Lead
QA_LEAD_NAME=opencode
QA_LEAD_ROLE=primary_debugger

# Debugging
WEBVIEWER_DEBUG_MODE=true
WEBVIEWER_LOG_LEVEL=verbose
WEBVIEWER_CAPTURE_ALL_REQUESTS=true
```

### Workspace Settings (`workspace.json`)

```json
{
  "version": "1.0.0",
  "project": "WebViewer",
  "global_settings": {
    "enabled": true,
    "persistent": true,
    "debug_mode": true,
    "log_level": "verbose"
  },
  "targets": {
    "web": { "enabled": true, "url": "http://localhost:3000" },
    "emulator": { "enabled": true, "platform": "android" },
    "mobile_app": { "enabled": true, "platform": "android" }
  },
  "qa_lead": {
    "name": "opencode",
    "role": "primary_debugger"
  }
}
```

---

## Features

### 1. Multi-Target Debugging
- Web browser debugging
- Emulator debugging (Android)
- Mobile app debugging

### 2. Console Log Capture
- Captures all console.log, info, warn, error
- Includes source file and line number
- Optional stack trace capture

### 3. Network Request Logging
- Captures all HTTP requests/responses
- Records response time
- Logs request/response headers
- Tracks failed requests (4xx, 5xx)

### 4. JavaScript Error Capture
- Captures JS errors with stack traces
- Includes source location (file, line, column)
- Timestamps all errors

### 5. Performance Profiling
- First Contentful Paint (FCP)
- DOM Content Loaded
- Page Load time
- Custom metrics support

### 6. Screenshot Capture
- Automatic screenshots on error
- Manual screenshot capture
- Side-by-side comparison support

### 7. Session Management
- Start/end debug sessions
- Track session duration
- Generate debug reports
- Session history

---

## Debugging Targets

### Web Debugging
- URL-based testing
- Custom viewport sizes
- User agent spoofing
- Network idle detection

### Emulator Debugging
- Android emulator support
- Custom device profiles
- API level configuration
- Port configuration

### Mobile App Debugging
- App package/activity targeting
- UiAutomator2 support
- Appium integration ready

---

## API Usage

### Start Debug Session

```python
from docs.webviewer.engine import WebViewerEngine, DebugTarget

engine = WebViewerEngine()

session_id = engine.start_session(
    target=DebugTarget.WEB,
    metadata={"url": "http://localhost:3000", "user": "test"}
)
```

### Add Console Log

```python
from docs.webviewer.engine import ConsoleLog
from datetime import datetime

log = ConsoleLog(
    timestamp=datetime.now().isoformat(),
    level="error",
    message="Failed to load data",
    source="api.js",
    line_number=45,
    stack_trace="TypeError: ..."
)

engine.add_console_log(session_id, log)
```

### Add Network Request

```python
from docs.webviewer.engine import NetworkRequest

request = NetworkRequest(
    id="req-1",
    method="POST",
    url="/api/login",
    status=200,
    response_time=150,
    request_headers={"Content-Type": "application/json"},
    response_headers={"Content-Type": "application/json"}
)

engine.add_network_request(session_id, request)
```

### Add JS Error

```python
from docs.webviewer.engine import JSError
from datetime import datetime

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
```

### End Session & Get Report

```python
result = engine.end_session(session_id)

print(f"Success: {result.success}")
print(f"Issues: {result.issues_found}")
print(f"Performance Score: {result.performance_score}%")
print(f"Recommendations: {result.recommendations}")
```

---

## Debug Report

The debug report includes:

| Field | Description |
|-------|-------------|
| `success` | True if no critical issues |
| `issues_found` | List of identified issues |
| `console_errors` | Number of console errors |
| `network_failures` | Number of failed requests |
| `js_errors` | Number of JavaScript errors |
| `avg_response_time` | Average response time in ms |
| `performance_score` | Overall score (0-100%) |
| `recommendations` | List of fix recommendations |

---

## Commands

| Command | Description |
|---------|-------------|
| `python docs/webviewer/engine.py` | Run demo |
| List sessions | `engine.list_sessions()` |
| Get summary | `engine.get_session_summary(session_id)` |
| Filter by status | `engine.list_sessions(status="running")` |

---

## Acceptance Criteria

- [x] Multi-target debugging (Web, Emulator, Mobile)
- [x] Console log capture
- [x] Network request logging
- [x] JS error tracking
- [x] Performance metrics
- [x] Screenshot capture
- [x] Session management
- [x] Debug report generation

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Performance overhead | Configurable log levels |
| Memory leaks | Session cleanup after completion |
| Large payloads | Truncate response bodies |
| Sensitive data | Sanitize logs before storage |

---

*Last Updated: 2026-02-26*  
*Managed by: opencode*
