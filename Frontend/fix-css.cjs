const fs = require('fs');
let css = fs.readFileSync('src/components/pages/About.css', 'utf8');

// The issue is missing closing brackets for most rules.
// Whenever a new rule starts with `.` or `@media` or `@keyframes`, and the previous character isn't `}`, we add a `}`.
css = css.replace(/([^}])\n(\s*\.[a-zA-Z0-9_-]+ {)/g, '$1\n}\n$2');
css = css.replace(/([^}])\n(\s*@keyframes)/g, '$1\n}\n$2');
css = css.replace(/([^}])\n(\s*@media)/g, '$1\n}\n$2');

// Fix the last rule
css += '\n}';

fs.writeFileSync('src/components/pages/About.css', css);
