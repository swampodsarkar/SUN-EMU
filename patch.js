const fs = require('fs');
let code = fs.readFileSync('src/components/OSView.tsx', 'utf8');

if (!code.includes('incrementGuestCount')) {
  code = code.replace(
    'useEffect(() => {',
    'useEffect(() => {\n    store.incrementGuestCount();'
  );
  fs.writeFileSync('src/components/OSView.tsx', code);
}
