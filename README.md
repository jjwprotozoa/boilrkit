# BoilrKit

⚡ Rapid React + Vite + Firebase SaaS app boilerplate with Tailwind, Zustand, Auth, GPT/Claude AI hooks, and one-click developer setup via CLI or MCP.  
Minimal, modular, expandable — and now interactive, smart, and lightning-fast.

## Features

- 🧠 AI-powered CLI with smart defaults + auto prompts
- 🛠️ One-line app setup via CLI or MCP buttons
- ⚛️ React + Vite + TypeScript foundation
- 🌗 Tailwind CSS with dark mode support
- 🔐 Optional Firebase Auth + Firestore
- 📦 Zustand state management
- 🧭 React Router (optional)
- 🤖 GPT + Claude AI helpers (optional)
- 💳 Stripe integration (optional)
- 📱 PWA config (optional)
- 🧠 MCP button file generator
- 🔘 Optional Desktop Commander GUI launcher
- 🔄 Progress bar with step-by-step feedback
- 🧪 Modular, extensible file structure

---

## Installation

```bash
# Global install (recommended)
npm install -g boilrkit

# Or use directly
npx boilrkit create my-app
```

---

## Usage

### ▶️ Create a new app

```bash
boilrkit create my-app --firebase --router --pwa --ai --mcp --run-app --launch-mcp-gui
```

### 🧠 Smart Flags

| Flag               | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `--firebase`       | Add Firebase Auth + Firestore                        |
| `--router`         | Include React Router                                 |
| `--pwa`            | Enable PWA config                                    |
| `--ai`             | Add GPT/Claude hooks                                 |
| `--payment`        | Add Stripe checkout                                  |
| `--mcp`            | Generate `mcp.json` (Desktop Commander)              |
| `--open-mcp`       | Auto-open `mcp.json` after setup                     |
| `--launch-mcp-gui` | Launch Desktop Commander GUI (if installed globally) |
| `--run-app`        | Start `npm run dev` immediately after scaffolding    |

---

## Configuration

BoilrKit supports a `.boilrkitrc` config file to set your preferred defaults:

```json
{
  "defaults": {
    "firebase": true,
    "router": true,
    "pwa": false,
    "ai": true,
    "payment": false,
    "mcp": true
  },
  "templates": {
    "repo": "jjwprotozoa/boilrkit-templates",
    "branch": "main",
    "path": "C:/Users/DevBox/AppData/Local/Temp/boilrkit-templates"
  }
}
```

Place it in your **home directory** for global defaults or in your project for overrides.

---

## Desktop Commander Integration

BoilrKit can generate an `mcp.json` file that works with [Desktop Commander](https://github.com/wonderwhy-er/desktop-commander), giving you a GUI interface with buttons to run common commands.

### Setting Up Desktop Commander

```bash
# Install globally
npm install -g @wonderwhy-er/desktop-commander

# Launch the GUI
desktop-commander gui
```

![Desktop Commander GUI Example](https://raw.githubusercontent.com/jjwprotozoa/boilrkit/main/docs/images/commander-gui.png)

### Troubleshooting Desktop Commander

If the GUI doesn't appear after selecting "Launch Desktop Commander GUI":

1. **Check installation**: Make sure Desktop Commander is installed globally
2. **Try manual launch**: Run `desktop-commander gui` in your terminal
3. **Fall back to CLI**: Use regular npm commands if GUI isn't working
4. **Check logs**: Look for error messages in the terminal

BoilrKit will automatically fall back to CLI mode if the GUI fails to launch.

---

## Project Structure

```txt
my-app/
├── src/
│   ├── ai/                # GPT/Claude hooks
│   ├── components/
│   │   └── payments/      # Stripe components (if enabled)
│   ├── pages/             # Route pages (if router enabled)
│   ├── stores/            # Zustand state
│   ├── App.tsx
│   └── main.tsx
├── mcp.json              # Optional Desktop Commander config
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── ...
```

---

## Developer Workflow

```bash
cd my-app

# Start dev server
npm run dev

# Build for production
npm run build

# Preview prod build
npm run preview
```

BoilrKit supports several ways to start your development:

- **Auto-launch**: Use `--run-app` to start the dev server immediately
- **GUI buttons**: Use Desktop Commander for one-click actions
- **Traditional CLI**: Standard npm commands work too

When using `--run-app`, BoilrKit will:

1. Launch the Vite development server
2. Display the local URL in the terminal
3. Automatically open the app in your default browser

---

## Contributing

Pull requests welcome! Fork, branch, commit, push, and PR.

---

## License

MIT
