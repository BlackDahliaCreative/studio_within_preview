/**
 * deploy.js — generic gh-pages replacement for Windows.
 *
 * Avoids the ENAMETOOLONG error that gh-pages triggers on Windows by using
 * `git add -A` instead of passing every filename as a CLI argument to git rm.
 *
 * Usage (from package.json scripts):
 *   node scripts/deploy.js <branch> <remote-url>
 *
 * Example:
 *   "deploy:preview": "node scripts/deploy.js live https://github.com/org/repo-preview.git"
 *   "deploy:official": "node scripts/deploy.js live https://github.com/org/repo-official.git"
 */

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ── Args ──────────────────────────────────────────────────────────────────────
const [,, BRANCH, REMOTE] = process.argv;

if (!BRANCH || !REMOTE) {
    console.error('Usage: node scripts/deploy.js <branch> <remote-url>');
    process.exit(1);
}

const BUILD_DIR = path.resolve(__dirname, '..', 'build');
// ─────────────────────────────────────────────────────────────────────────────

function exec(cmd, opts = {}) {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit', ...opts });
}

function copyDir(src, dest) {
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath  = path.join(src,  entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function hasChanges(cwd) {
    try {
        execSync('git diff --cached --quiet', { cwd });
        return false;
    } catch {
        return true;
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────
if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌  build/ directory not found. Run the build step first.');
    process.exit(1);
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-'));
console.log(`\nDeploying to: ${REMOTE} (branch: ${BRANCH})`);
console.log(`Using temp dir: ${tmpDir}\n`);

try {
    // Clone the target branch (shallow); fall back to a fresh init on first deploy.
    try {
        exec(`git clone --depth 1 --branch ${BRANCH} ${REMOTE} "${tmpDir}"`);
    } catch {
        console.log(`Branch "${BRANCH}" not found — initialising fresh repo.`);
        exec(`git init "${tmpDir}"`);
        exec(`git remote add origin ${REMOTE}`, { cwd: tmpDir });
    }

    // Wipe everything except .git so removed files get cleaned up.
    for (const entry of fs.readdirSync(tmpDir)) {
        if (entry === '.git') continue;
        fs.rmSync(path.join(tmpDir, entry), { recursive: true, force: true });
    }

    // Copy the fresh build in.
    console.log('\nCopying build files…');
    copyDir(BUILD_DIR, tmpDir);

    // Stage everything (no file-list → no ENAMETOOLONG).
    exec('git add -A', { cwd: tmpDir });

    if (!hasChanges(tmpDir)) {
        console.log('\nℹ️  Nothing to deploy — already up to date.');
        process.exit(0);
    }

    exec('git commit -m "Deploy"', { cwd: tmpDir });
    exec(`git push origin HEAD:${BRANCH} --force`, { cwd: tmpDir });

    console.log('\n✅  Deployed successfully!');
} finally {
    // Always clean up the temp dir.
    fs.rmSync(tmpDir, { recursive: true, force: true });
}
