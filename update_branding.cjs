const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDir(fullPath);
        } else if (/\.(tsx|ts|css|html)$/.test(entry.name)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Fix image src paths
            content = content.replace(/src=["']\/(Airtel Congo\.png|ecocash\.png|logo\.png|Airtel Congo\.svg)["']/gi, 'src="/airtel.svg"');

            // Replace blue & purple colors with Airtel red theme
            content = content.replace(/#667eea/gi, '#e40000');
            content = content.replace(/#764ba2/gi, '#c40000');
            content = content.replace(/#3b82f6/gi, '#e40000');
            content = content.replace(/#2563eb/gi, '#e40000');
            content = content.replace(/#1d4ed8/gi, '#c40000');
            content = content.replace(/#6366f1/gi, '#e40000');
            content = content.replace(/#4f46e5/gi, '#c40000');
            content = content.replace(/#5a67d8/gi, '#c40000');
            content = content.replace(/#4c51bf/gi, '#b80000');
            content = content.replace(/#1e40af/gi, '#b80000');
            content = content.replace(/#e0e7ff/gi, '#fee2e2');
            content = content.replace(/#eff6ff/gi, '#fff5f5');
            content = content.replace(/#dbeafe/gi, '#fecaca');

            // Replace rgba shadows
            content = content.replace(/rgba\(102,\s*126,\s*234,\s*([0-9.]+)\)/gi, 'rgba(228, 0, 0, $1)');
            content = content.replace(/rgba\(59,\s*130,\s*246,\s*([0-9.]+)\)/gi, 'rgba(228, 0, 0, $1)');
            content = content.replace(/rgba\(99,\s*102,\s*241,\s*([0-9.]+)\)/gi, 'rgba(228, 0, 0, $1)');
            content = content.replace(/rgba\(79,\s*70,\s*229,\s*([0-9.]+)\)/gi, 'rgba(228, 0, 0, $1)');
            content = content.replace(/rgba\(37,\s*99,\s*235,\s*([0-9.]+)\)/gi, 'rgba(228, 0, 0, $1)');

            // Ensure no broken variable names
            content = content.replace(/Airtel CongoAccount/g, 'AirtelCongoAccount');
            content = content.replace(/Airtel CongoOtpMessage/g, 'AirtelCongoOtpMessage');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDir(srcDir);
console.log('Branding replacement completed.');
