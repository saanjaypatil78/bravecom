# MCP Servers Configuration

The following MCP servers and services are configured for this project.

## MCP Servers Settings (`mcpServers.json` / `settings.json`)

```json
{
  "mcpServers": {
    "supabase-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_*************************************"
      ],
      "env": {}
    },
    "cloudrun": {
      "command": "npx",
      "args": [
        "-y",
        "@google-cloud/cloud-run-mcp"
      ],
      "env": {}
    },
    "firebase-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "firebase-tools@latest",
        "mcp"
      ],
      "env": {}
    },
    "mcp-server-neon": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.neon.tech/sse"
      ],
      "env": {}
    },
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ],
      "env": {}
    },
    "github-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_************************************"
      }
    },
    "gke-oss": {
      "command": "go",
      "args": [
        "run",
        "github.com/GoogleCloudPlatform/gke-mcp@latest"
      ],
      "env": {}
    },
    "genkit-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "genkit-cli@^1.28.0",
        "mcp",
        "--explicitProjectRoot",
        "--no-update-notification",
        "--non-interactive"
      ],
      "env": {}
    },
    "GitKraken": {
      "args": [
        "mcp",
        "--host=antigravity",
        "--source=gitlens",
        "--scheme=antigravity"
      ],
      "command": "c:\\Users\\Asus\\AppData\\Roaming\\Antigravity\\User\\globalStorage\\eamodio.gitlens\\gk.exe",
      "type": "stdio"
    },
    "StitchMCP": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://stitch.googleapis.com/mcp",
        "--header",
        "X-Goog-Api-Key: AQ.***************************************************"
      ],
      "env": {}
    },
    "dart-mcp-server": {
      "command": "dart",
      "args": [
        "mcp-server"
      ],
      "env": {}
    }
  }
}
```

## API Keys Reference

The following API keys are used across the platform and have been integrated into the local `.env` file:

- **Vercel AI Gateway Key**: `vck_************************************************************`
- **NVIDIA API KEY**: `nvapi-************************************************************************`
- **GitHub PAT key fallback**: `ghp_************************************`
- **OPENROUTER API KEY**: `sk-or-v1-****************************************************************`
- **Upstash Redis ID**: `********-****-****-****-************`
- **Supabase Database Password**: `****************`
