# Project Requirements

## System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **VS Code**: Latest version recommended

## NPM Dependencies

### Production Dependencies
```bash
npm install react@^18.3.1 react-dom@^18.3.1 react-router-dom@^7.7.1 lucide-react@^0.344.0
```

### Development Dependencies
```bash
npm install --save-dev @types/react@^18.3.5 @types/react-dom@^18.3.0 @types/react-router-dom@^5.3.3 @vitejs/plugin-react@^4.3.1 typescript@^5.5.3 vite@^5.4.2 tailwindcss@^3.4.1 autoprefixer@^10.4.18 postcss@^8.4.35 eslint@^9.9.1 @eslint/js@^9.9.1 typescript-eslint@^8.3.0 eslint-plugin-react-hooks@^5.1.0-rc.0 eslint-plugin-react-refresh@^0.4.11 globals@^15.9.0
```

## VS Code Extensions

### Essential Extensions
- **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
- **TypeScript Importer** (`pmneo.tsimporter`)
- **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)

### Recommended Extensions
- **Error Lens** (`usernamehw.errorlens`)
- **PostCSS Language Support** (`csstools.postcss`)
- **GitLens** (`eamodio.gitlens`)
- **Thunder Client** (`rangav.vscode-thunder-client`)
- **vscode-icons** (`vscode-icons-team.vscode-icons`)
- **Indent Rainbow** (`oderwat.indent-rainbow`)
- **TODO Highlight** (`wayou.vscode-todo-highlight`)

## VS Code Configuration

Create or update `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.eol": "\n"
}
```

## Installation Steps

1. **Clone/Download the project**
2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```
3. **Install VS Code extensions** (use the extension IDs above)
4. **Configure VS Code settings** (copy the settings.json above)
5. **Start development server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Theme)
├── data/              # Static data and curriculum
├── pages/             # Route components
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles

public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

- Uses Vite for fast development and building
- Tailwind CSS for styling with dark mode support
- React Router for client-side routing
- TypeScript for type safety
- ESLint for code quality
- Responsive design with mobile-first approach