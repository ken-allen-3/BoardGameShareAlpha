const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const lastCommitDate = execSync('git log -1 --format=%cd').toString().trim();
  const filePath = path.join(__dirname, 'src', 'lastCommitDate.json');
  fs.writeFileSync(filePath, JSON.stringify({ lastCommitDate }));
  console.log('Last commit date written to src/lastCommitDate.json');
} catch (error) {
  console.error('Error getting last commit date:', error);
}