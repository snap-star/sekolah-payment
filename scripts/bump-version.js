const fs = require('fs');
const path = require('path');
const semver = require('semver');

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const VERSION_FILE = path.join(ROOT_DIR, 'version.json');
const FRONTEND_PACKAGE = path.join(ROOT_DIR, 'frontend', 'sekolahpay-frontend', 'package.json');
const BACKEND_COMPOSER = path.join(ROOT_DIR, 'backend', 'sekolahpay_server', 'composer.json');
const CHANGELOG = path.join(ROOT_DIR, 'frontend', 'sekolahpay-frontend', 'CHANGELOG.md');

function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    // Preserve the original error to let caller handle ENOENT specifically
    throw error;
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`✓ Updated ${path.relative(ROOT_DIR, filePath)}`);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error.message);
    process.exit(1);
  }
}

function validateVersion(currentVersion, newVersion) {
  if (!semver.valid(newVersion)) {
    console.error(`❌ Invalid version: ${newVersion}`);
    process.exit(1);
  }
  
  if (semver.lte(newVersion, currentVersion)) {
    console.error(`❌ New version ${newVersion} must be greater than current version ${currentVersion}`);
    process.exit(1);
  }
  
  return true;
}

function bumpVersion(bumpType, prereleaseId = null) {
  // Read current versions (these are required files that must exist)
  let versionData, frontendPkg;
  try {
    versionData = readJson(VERSION_FILE);
    frontendPkg = readJson(FRONTEND_PACKAGE);
  } catch (error) {
    console.error(`Error reading required file:`, error.message);
    process.exit(1);
  }
  const currentVersion = versionData.version;
  
  console.log(`\nCurrent version: ${currentVersion}`);
  
  // Calculate new version
  let newVersion;
  if (bumpType === 'prerelease' && prereleaseId) {
    newVersion = semver.inc(currentVersion, bumpType, prereleaseId);
  } else {
    newVersion = semver.inc(currentVersion, bumpType);
  }
  
  if (!newVersion) {
    console.error('❌ Failed to calculate new version');
    process.exit(1);
  }
  
  validateVersion(currentVersion, newVersion);
  console.log(`New version: ${newVersion} (${bumpType} bump)`);
  
  // Calculate version code (MAJOR*10000 + MINOR*100 + PATCH)
  const semverParts = semver.parse(newVersion);
  const newVersionCode = semverParts.major * 10000 + semverParts.minor * 100 + semverParts.patch;
  
  // Update version.json
  versionData.version = newVersion;
  versionData.version_code = newVersionCode;
  versionData.release_date = new Date().toISOString().split('T')[0];
  writeJson(VERSION_FILE, versionData);
  
  // Update frontend package.json
  frontendPkg.version = newVersion;
  writeJson(FRONTEND_PACKAGE, frontendPkg);
  
  // Update backend composer.json (handle ENOENT if file doesn't exist)
  try {
    const backendComposer = readJson(BACKEND_COMPOSER);
    backendComposer.version = newVersion;
    writeJson(BACKEND_COMPOSER, backendComposer);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, skip update silently
    } else {
      console.error(`Error updating ${path.relative(ROOT_DIR, BACKEND_COMPOSER)}:`, error.message);
      process.exit(1);
    }
  }
  
  // Add new entry to CHANGELOG.md (handle ENOENT if file doesn't exist)
  try {
    const changelogContent = fs.readFileSync(CHANGELOG, 'utf8');
    const today = new Date().toISOString().split('T')[0];
    const newChangelogEntry = `## [${newVersion}] - ${today}\n\n### Summary\nVersion bump from ${currentVersion} to ${newVersion} (${bumpType})\n\n---\n\n`;
    
    // Insert after the header
    const headerEnd = changelogContent.indexOf('## [');
    if (headerEnd !== -1) {
      const updatedChangelog = changelogContent.slice(0, headerEnd) + newChangelogEntry + changelogContent.slice(headerEnd);
      
      if (updatedChangelog !== changelogContent) {
        fs.writeFileSync(CHANGELOG, updatedChangelog);
        console.log(`✓ Updated ${path.relative(ROOT_DIR, CHANGELOG)}`);
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, skip update silently
    } else {
      console.error(`Error updating ${path.relative(ROOT_DIR, CHANGELOG)}:`, error.message);
      process.exit(1);
    }
  }
  
  console.log(`\n✅ Successfully bumped version to ${newVersion}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review the changes`);
  console.log(`2. Commit: git commit -am "chore: bump version to ${newVersion}"`);
  console.log(`3. Tag: git tag -a v${newVersion} -m "Release v${newVersion}"`);
  console.log(`4. Push: git push && git push --tags\n`);
}

function checkVersion() {
  // Read required version files (these must exist)
  let versionData, frontendPkg;
  try {
    versionData = readJson(VERSION_FILE);
    frontendPkg = readJson(FRONTEND_PACKAGE);
  } catch (error) {
    console.error(`Error reading required file:`, error.message);
    process.exit(1);
  }
  const currentVersion = versionData.version;
  
  console.log(`\n📋 Version Check:`);
  console.log(`   version.json: ${currentVersion}`);
  console.log(`   package.json: ${frontendPkg.version}`);
  
  if (versionData.version === frontendPkg.version) {
    console.log(`\n✅ All versions are in sync!`);
    
    if (semver.valid(currentVersion)) {
      console.log(`✅ ${currentVersion} is a valid SemVer version`);
    } else {
      console.error(`❌ ${currentVersion} is NOT a valid SemVer version`);
      process.exit(1);
    }
  } else {
    console.error(`\n❌ Version mismatch detected!`);
    process.exit(1);
  }
  
  // Calculate next possible versions
  console.log(`\n🔮 Possible next versions:`);
  console.log(`   Patch: ${semver.inc(currentVersion, 'patch')}`);
  console.log(`   Minor: ${semver.inc(currentVersion, 'minor')}`);
  console.log(`   Major: ${semver.inc(currentVersion, 'major')}`);
  console.log(`   Prerelease (rc): ${semver.inc(currentVersion, 'prerelease', 'rc')}\n`);
}

// CLI handling
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(`
SekolahPay SemVer Version Manager

Usage:
  node scripts/bump-version.js [command] [options]

Commands:
  check                  Check if all versions are in sync and valid
  bump <major|minor|patch|prerelease> [id]
                         Bump version (prerelease optional accepts identifier like beta, rc)
                        
Examples:
  node scripts/bump-version.js check
  node scripts/bump-version.js bump patch
  node scripts/bump-version.js bump minor
  node scripts/bump-version.js bump prerelease rc
  `);
  process.exit(0);
}

switch (command) {
  case 'check':
    checkVersion();
    break;
  case 'bump':
    const bumpType = args[1];
    const prereleaseId = args[2];
    const validBumpTypes = ['major', 'minor', 'patch', 'prerelease'];
    
    if (!validBumpTypes.includes(bumpType)) {
      console.error(`❌ Invalid bump type: ${bumpType}. Must be one of: ${validBumpTypes.join(', ')}`);
      process.exit(1);
    }
    
    bumpVersion(bumpType, prereleaseId);
    break;
  default:
    console.error(`❌ Unknown command: ${command}`);
    process.exit(1);
}