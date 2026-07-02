const fs = require('fs');
let code = fs.readFileSync('src/components/OSView.tsx', 'utf8');

if (!code.includes('const themeClass')) {
  // inject theme logic
  const replaceStr = `
  const { settings } = useStore();
  const themeClass = settings.darkMode ? "bg-black text-white" : "bg-gray-100 text-black";
`;
  code = code.replace("const store = useStore();", "const store = useStore();" + replaceStr);
  
  // Actually applying the theme to the main div is complex because of all the fixed bg colors, but let's try something simple for now.
  code = code.replace(
    'className="h-screen w-full bg-black text-white overflow-hidden flex flex-col font-sans relative selection:bg-white/30"',
    'className={`h-screen w-full ${settings.darkMode ? "bg-black text-white" : "bg-gray-200 text-gray-900"} overflow-hidden flex flex-col font-sans relative selection:bg-white/30 transition-colors duration-500`}'
  );
  
  fs.writeFileSync('src/components/OSView.tsx', code);
}
