# BoilrKit

⚡ Rapid React + Vite + Firebase SaaS app boilerplate with Tailwind, Zustand, Auth, GPT/Claude AI hooks, and one-click developer setup via CLI or MCP. Built to be minimal, modular, and expandable.

## Features

- 🚀 CLI-based setup with interactive prompts
- ⚛️ React + Vite + TypeScript foundation
- 🎨 Tailwind CSS with dark mode
- 🔒 Optional Firebase authentication & Firestore
- 🧩 Zustand for simple state management
- 🧪 Optional React Router
- 🤖 Optional AI integration (GPT/Claude)
- 💳 Optional Stripe payment integration
- 📱 PWA configuration for installable web apps
- 🔘 MCP button launcher support
- 🏗️ Modular architecture
- 🧪 ESLint & Prettier pre-configured

## Installation

```bash
# Install globally
npm install -g boilrkit

# Or use directly with npx
npx boilrkit create my-app
```

## Usage

### Creating a new app

```bash
# Using the installed CLI
boilrkit create my-app

# With specific features
boilrkit create my-app --firebase --router --pwa --mcp

# Skip certain steps
boilrkit create my-app --no-git --no-install
```

### Available options

- `--firebase`: Include Firebase Auth and Firestore
- `--router`: Include React Router
- `--ai`: Include AI helpers for GPT/Claude
- `--pwa`: Configure as PWA (Progressive Web App)
- `--payment`: Include payment integration
- `--mcp`: Generate MCP button file
- `--template <name>`: Use a specific template (default: "default")
- `--no-git`: Skip git repository initialization
- `--no-install`: Skip package installation

### Adding features to existing projects

You can also add features to an existing project:

```bash
# Add authentication to an existing project
boilrkit add auth

# Add payment integration
boilrkit add payments

# Add AI capabilities
boilrkit add ai

# Add PWA support
boilrkit add pwa
```

### Configuration

BoilrKit supports configuration files to set default options:

```bash
# Initialize a config file
boilrkit init
```

This creates a `.boilrkitrc` file with default settings. You can place this in your home directory for global settings or in a project directory for project-specific settings.

Example `.boilrkitrc` configuration:

```json
{
  "defaults": {
    "firebase": true,
    "router": true,
    "ai": true,
    "pwa": true,
    "payment": false,
    "mcp": true,
    "template": "default"
  },
  "templates": {
    "repo": "jjwprotozoa/boilrkit-templates",
    "branch": "main",
    "path": "/path/to/templates"
  }
}
```

## Project Structure

```
my-app/
├── node_modules/
├── public/
├── src/
│   ├── ai/                  # AI integration helpers (if enabled)
│   │   ├── useClaude.ts
│   │   └── useGPT.ts
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   └── payments/        # Payment components (if enabled)
│   ├── pages/               # Page components
│   │   ├── Account.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Payments.tsx
│   │   └── Register.tsx
│   ├── App.tsx              # Main application component
│   ├── auth.ts              # Authentication logic (if Firebase enabled)
│   ├── firebase.ts          # Firebase configuration (if enabled)
│   ├── index.css            # Global styles with Tailwind
│   ├── main.tsx             # Entry point
│   └── store.ts             # Zustand state store
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── .gitignore
├── index.html
├── mcp.json                 # MCP button configuration (if enabled)
├── package.json
├── postcss.config.js        # PostCSS configuration for Tailwind
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Development

After creating your app:

```bash
# Navigate to your project directory
cd my-app

# Start the development server
yarn dev  # or npm run dev

# Build for production
yarn build  # or npm run build

# Preview the production build
yarn preview  # or npm run preview
```

## MCP Button Support

The MCP (Multi-Command Palette) button file allows you to quickly access common commands. By default, it includes:

- ▶️ Start Dev: `yarn dev`
- 🚀 Build Project: `yarn build`
- 🧪 Preview Production Build: `yarn preview`
- 🔄 Install Dependencies: `yarn install`
- 🧹 Format Code: `yarn format`
- 📂 Directory Summary: `./directory-summary.ps1`
- 🧠 Add AI (GPT/Claude): `boilrkit add ai`
- 🧱 Add Auth: `boilrkit add auth`
- 💳 Add Payments: `boilrkit add payments`
- 📱 Add PWA Support: `boilrkit add pwa`
- ⚙️ Reinitialize Config: `boilrkit init`

## Environment Variables

For projects with Firebase enabled, create a `.env` file with:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

For AI features:
```
VITE_OPENAI_API_KEY=your_openai_key
VITE_ANTHROPIC_API_KEY=your_anthropic_key
```

For Stripe integration:
```
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Lean Six Sigma Design Principles

BoilrKit follows Lean Six Sigma principles to eliminate waste and optimize efficiency:

- **Eliminate waste**: No unnecessary dependencies or bloated features
- **Standardize components**: Consistent design patterns and interfaces
- **Value stream mapping**: Streamlined scaffolding focused on developer flow
- **Continuous improvement**: Regular updates and refinements
- **Minimize defects**: Robust error handling and TypeScript type safety

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.