const fs = require('fs');
let code = fs.readFileSync('src/lib/store.ts', 'utf8');

if (!code.includes('interface Settings')) {
  const settingsInterface = `
export interface AppSettings {
  darkMode: boolean;
  language: string;
  notifications: boolean;
  performanceMode: boolean;
  autoUpdate: boolean;
  voiceChat: boolean;
  remotePlay: boolean;
  theme: string;
}
`;
  
  code = code.replace("interface GlobalState {", settingsInterface + "\ninterface GlobalState {");
  
  code = code.replace("currentUser: User | null;", "currentUser: User | null;\n  settings: AppSettings;\n  updateSettings: (newSettings: Partial<AppSettings>) => void;");
  
  code = code.replace("currentUser: null,", "currentUser: null,\n  settings: {\n    darkMode: true,\n    language: 'English',\n    notifications: true,\n    performanceMode: false,\n    autoUpdate: true,\n    voiceChat: false,\n    remotePlay: false,\n    theme: 'Cosmic Slate'\n  },\n  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),");
  
  fs.writeFileSync('src/lib/store.ts', code);
}
