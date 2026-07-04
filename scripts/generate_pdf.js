const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Paths
const workspaceRoot = path.join(__dirname, '..');
const resultsPath = path.join(workspaceRoot, 'analysis_results.md');
const proposalsPath = path.join(workspaceRoot, 'system_proposals.md');
const tempHtmlPath = path.join(workspaceRoot, 'temp_analysis.html');
const outputPdfPath = path.join(workspaceRoot, 'caresignal_system_analysis.pdf');

console.log('PDF Generation starting...');
console.log('Reading analysis files...');

if (!fs.existsSync(resultsPath)) {
  console.error(`Error: ${resultsPath} not found!`);
  process.exit(1);
}

const resultsMd = fs.readFileSync(resultsPath, 'utf8');
const proposalsMd = fs.existsSync(proposalsPath) ? fs.readFileSync(proposalsPath, 'utf8') : '';

// Helper to convert basic Markdown to styled HTML
function mdToHtml(md) {
  let html = md;

  // Escape HTML entities to avoid broken tags
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore specific tag shapes after escaping (if any were hardcoded, none in our docs)

  // Block code parsing: ```javascript ... ```
  html = html.replace(/```([\w-]+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
    return `<pre class="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-mono p-4 rounded-xl my-4 overflow-x-auto whitespace-pre-wrap leading-relaxed"><code>${code}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`\n]+)`/g, '<code class="bg-gray-100 border border-gray-200 text-xs font-mono px-1.5 py-0.5 rounded text-teal-600 font-semibold">$1</code>');

  // Headings
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-extrabold text-teal-800 border-b-2 border-teal-800 pb-2 mt-8 mb-4 font-sans">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold text-gray-800 mt-6 mb-3 border-b border-gray-200 pb-1.5 font-sans">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold text-gray-700 mt-5 mb-2 font-sans">$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4 class="text-base font-bold text-gray-600 mt-4 mb-2 font-sans">$1</h4>');

  // Bullet points
  html = html.replace(/^\* (.*?)$/gm, '<li class="ml-6 list-disc text-sm text-gray-600 leading-relaxed mb-1">$1</li>');
  html = html.replace(/^- (.*?)$/gm, '<li class="ml-6 list-disc text-sm text-gray-600 leading-relaxed mb-1">$1</li>');

  // Bold text: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');

  // Mermaid diagrams (rendered placeholder styled nicely since CLI headless edge doesn't execute mermaid JS client easily)
  html = html.replace(/&lt;!-- mermaid diagram placeholder --&gt;/g, '');

  // Line breaks and paragraphs (very basic grouping)
  const lines = html.split('\n');
  let output = '';
  let inList = false;

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('<li')) {
      if (!inList) {
        output += '<ul class="space-y-1.5 my-3">';
        inList = true;
      }
      output += line + '\n';
    } else {
      if (inList) {
        output += '</ul>\n';
        inList = false;
      }
      
      if (trimmed === '' || trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('</pre') || trimmed.startsWith('<ul') || trimmed.startsWith('</ul')) {
        output += line + '\n';
      } else {
        output += `<p class="text-sm text-gray-600 leading-relaxed my-3">${line}</p>\n`;
      }
    }
  }
  if (inList) {
    output += '</ul>\n';
  }

  return output;
}

// Convert markdown documents
const resultsHtml = mdToHtml(resultsMd);
const proposalsHtml = mdToHtml(proposalsMd);

// Standalone HTML template with elegant typography, spacing, and colors
const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>CareSignal 시스템 분석 보고서</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
    
    body {
      font-family: 'Noto Sans KR', 'Inter', sans-serif;
    }

    @media print {
      body {
        background: white !important;
        color: black !important;
        padding: 0 !important;
      }
      .page-break {
        page-break-before: always;
      }
      pre, code, blockquote, table, tr {
        page-break-inside: avoid;
      }
      h1, h2, h3, h4 {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body class="bg-slate-50 text-gray-800 p-8 sm:p-16">
  <div class="max-w-4xl mx-auto bg-white p-12 shadow-sm rounded-3xl border border-gray-100 print:border-none print:shadow-none print:p-0">
    
    <!-- Cover/Header -->
    <div class="border-b-4 border-teal-700 pb-6 mb-8 flex justify-between items-end">
      <div>
        <span class="bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">System Analysis Report</span>
        <h1 class="text-4xl font-extrabold text-teal-900 mt-3">CareSignal (케어시그널)</h1>
        <p class="text-lg text-gray-500 mt-1">시스템 구조 및 기술 연동성 상세 분석 보고서 (A to Z)</p>
      </div>
      <div class="text-right text-xs text-gray-400 font-mono hidden sm:block">
        발행일: ${new Date().toLocaleDateString('ko-KR')}
      </div>
    </div>

    <!-- Contents Section 1 -->
    <div class="space-y-6">
      ${resultsHtml}
    </div>

    <!-- Page Break for Proposals -->
    <div class="page-break my-10 border-t border-dashed border-gray-200 print:my-0 print:border-none"></div>

    <!-- Contents Section 2 -->
    <div class="space-y-6">
      ${proposalsHtml}
    </div>

    <!-- Footer -->
    <div class="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
      CareSignal Team &copy; 2026. All Rights Reserved. Confidential.
    </div>
  </div>
</body>
</html>
`;

// Write the template to a temporary HTML file
fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');
console.log('Temporary HTML file generated at:', tempHtmlPath);

// List of potential paths to Edge executable on Windows
const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'msedge' // system PATH path fallback
];

let edgeFoundPath = 'msedge';
for (const p of edgePaths) {
  if (fs.existsSync(p)) {
    edgeFoundPath = `"${p}"`;
    break;
  }
}

console.log(`Using Edge executable: ${edgeFoundPath}`);

// Shell command to convert HTML to PDF
const command = `${edgeFoundPath} --headless --disable-gpu --print-to-pdf="${outputPdfPath}" "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;

console.log('Generating PDF via headless Edge CLI...');
exec(command, (error, stdout, stderr) => {
  // Clean up temp file
  try {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  } catch (e) {
    console.warn('Warning: Could not clean up temporary HTML file:', e.message);
  }

  if (error) {
    console.error('Error generating PDF:', error.message);
    console.error('Stderr:', stderr);
    process.exit(1);
  }

  console.log('==================================================');
  console.log('SUCCESS! PDF generated successfully.');
  console.log('Output path:', outputPdfPath);
  console.log('==================================================');
  process.exit(0);
});
