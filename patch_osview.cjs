const fs = require('fs');
let code = fs.readFileSync('src/components/OSView.tsx', 'utf8');

// Imports
if (!code.includes("import ExploreApp from './ExploreApp';")) {
  code = code.replace("import AdminPanel from './AdminPanel';", "import AdminPanel from './AdminPanel';\nimport ExploreApp from './ExploreApp';\nimport SettingsApp from './SettingsApp';");
}

// State
if (!code.includes("showExploreModal")) {
  code = code.replace("const [showStoreModal, setShowStoreModal] = useState(false);", "const [showStoreModal, setShowStoreModal] = useState(false);\n  const [showExploreModal, setShowExploreModal] = useState(false);\n  const [showSettingsModal, setShowSettingsModal] = useState(false);");
}

// Keydown
code = code.replace("showStoreModal || showLoginModal", "showStoreModal || showExploreModal || showSettingsModal || showLoginModal");

// Explore Action
code = code.replace(
  "icon: <Menu className=\"w-10 h-10 text-white\" />,\n      type: 'app'",
  "icon: <Menu className=\"w-10 h-10 text-white\" />,\n      action: () => setShowExploreModal(true),\n      type: 'app'"
);

// Settings Action
code = code.replace(
  "<button className=\"text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/5 p-2.5 rounded-full hover:bg-white/10 backdrop-blur-md\">\n            <Settings className=\"w-6 h-6\" />\n          </button>",
  "<button onClick={() => setShowSettingsModal(true)} className=\"text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer bg-white/5 p-2.5 rounded-full hover:bg-white/10 backdrop-blur-md\">\n            <Settings className=\"w-6 h-6\" />\n          </button>"
);

// Render Modals
const modals = `
        {showExploreModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[120] bg-black"
          >
            <button 
              onClick={() => setShowExploreModal(false)}
              className="absolute top-8 right-8 z-[130] bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur-md transition-all shadow-lg group"
            >
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <ExploreApp />
          </motion.div>
        )}

        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[120] bg-black"
          >
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-8 right-8 z-[130] bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur-md transition-all shadow-lg group"
            >
              <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <SettingsApp />
          </motion.div>
        )}
`;

code = code.replace("{showStoreModal && (", modals + "\n        {showStoreModal && (");

fs.writeFileSync('src/components/OSView.tsx', code);
