#!/usr/bin/env node

/**
 * Interactive CLI script to update an existing release in Supabase
 * Usage: npm run release:update
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
const https = require('https');
const http = require('http');
const { URL } = require('url');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Validate URL format
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Check if URL exists via HEAD request
function checkUrlExists(url) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;

      const req = protocol.request(
        url,
        { method: 'HEAD', timeout: 10000 },
        (res) => {
          resolve(res.statusCode >= 200 && res.statusCode < 400);
        }
      );

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    } catch (error) {
      resolve(false);
    }
  });
}

// Validate semver format
function isValidSemver(version) {
  const semverRegex = /^v?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(version);
}

async function main() {
  console.log('\n🔄 Update Existing Release\n');

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
  const supabaseKey = process.env.SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_PROJECT_URL and SUPABASE_API_KEY must be set in .env file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Fetch recent releases
    console.log('📋 Fetching recent releases...\n');

    const { data: releases, error: fetchError } = await supabase
      .from('app_releases')
      .select('*')
      .eq('platform', 'android')
      .order('published_at', { ascending: false })
      .limit(10);

    if (fetchError) {
      console.error('❌ Error fetching releases:', fetchError.message);
      process.exit(1);
    }

    if (!releases || releases.length === 0) {
      console.log('No releases found. Create one first using npm run release:create');
      process.exit(0);
    }

    // Display releases
    console.log('Recent Releases:');
    releases.forEach((release, index) => {
      console.log(`  ${index + 1}. Version ${release.version} (ID: ${release.id.substring(0, 8)}...)`);
      console.log(`     Force Update: ${release.force_update ? 'Yes' : 'No'}`);
      console.log(`     Published: ${new Date(release.published_at).toLocaleString()}`);
      console.log(`     ABIs: ${Object.keys(release.apk_urls).join(', ')}`);
      console.log('');
    });

    // Select release to update
    let selectedRelease = null;
    while (!selectedRelease) {
      const selection = await question('Select release number to update (or "q" to quit): ');
      
      if (selection.trim().toLowerCase() === 'q') {
        console.log('❌ Cancelled');
        process.exit(0);
      }

      const index = parseInt(selection) - 1;
      if (index >= 0 && index < releases.length) {
        selectedRelease = releases[index];
      } else {
        console.log('❌ Invalid selection');
      }
    }

    console.log(`\n📝 Updating Release: ${selectedRelease.version}\n`);

    // Update version
    const versionInput = await question(`Version [${selectedRelease.version}]: `);
    let newVersion = versionInput.trim() || selectedRelease.version;
    
    if (versionInput.trim()) {
      newVersion = newVersion.replace(/^v/, '');
      if (!isValidSemver(newVersion)) {
        console.log('❌ Invalid semver format, keeping original version');
        newVersion = selectedRelease.version;
      }
    }

    // Update force_update
    const forceUpdateInput = await question(`Force update? (yes/no) [${selectedRelease.force_update ? 'yes' : 'no'}]: `);
    const newForceUpdate = forceUpdateInput.trim() 
      ? forceUpdateInput.toLowerCase() === 'yes'
      : selectedRelease.force_update;

    // Update release notes
    const releaseNotesInput = await question(`Release notes [${selectedRelease.release_notes || '(none)'}]: `);
    const newReleaseNotes = releaseNotesInput.trim() || selectedRelease.release_notes;

    // Update APK URLs
    console.log('\n📦 Update APK URLs (press Enter to keep existing, or paste new URL):\n');
    
    const abis = ['arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64', 'universal'];
    const newApkUrls = { ...selectedRelease.apk_urls };

    for (const abi of abis) {
      const currentUrl = newApkUrls[abi] || '(none)';
      const displayUrl = currentUrl.length > 60 ? currentUrl.substring(0, 57) + '...' : currentUrl;
      
      const url = await question(`  ${abi} [${displayUrl}]: `);
      const trimmedUrl = url.trim();

      if (trimmedUrl) {
        // Validate URL format
        if (!isValidUrl(trimmedUrl)) {
          console.log(`  ⚠️  Invalid URL format for ${abi}, keeping existing...`);
          continue;
        }

        // Check if URL exists
        console.log(`  🔍 Checking URL...`);
        const exists = await checkUrlExists(trimmedUrl);
        
        if (!exists) {
          console.log(`  ⚠️  Warning: URL may not be accessible (got non-200 response)`);
          const proceed = await question(`  Continue anyway? (yes/no) [no]: `);
          if (proceed.trim().toLowerCase() !== 'yes') {
            console.log(`  Keeping existing URL for ${abi}...`);
            continue;
          }
        } else {
          console.log(`  ✅ URL verified`);
        }

        newApkUrls[abi] = trimmedUrl;
      }
    }

    // Show diff
    console.log('\n📊 Changes:');
    
    if (newVersion !== selectedRelease.version) {
      console.log(`  Version: ${selectedRelease.version} → ${newVersion}`);
    }
    
    if (newForceUpdate !== selectedRelease.force_update) {
      console.log(`  Force Update: ${selectedRelease.force_update ? 'Yes' : 'No'} → ${newForceUpdate ? 'Yes' : 'No'}`);
    }
    
    if (newReleaseNotes !== selectedRelease.release_notes) {
      console.log(`  Release Notes: Updated`);
    }

    const urlChanges = Object.keys(newApkUrls).filter(
      abi => newApkUrls[abi] !== selectedRelease.apk_urls[abi]
    );
    
    if (urlChanges.length > 0) {
      console.log(`  APK URLs: Updated for ${urlChanges.join(', ')}`);
    }

    if (newVersion === selectedRelease.version && 
        newForceUpdate === selectedRelease.force_update &&
        newReleaseNotes === selectedRelease.release_notes &&
        urlChanges.length === 0) {
      console.log('  (No changes)');
    }

    const confirm = await question('\n✅ Save changes? (yes/no): ');
    
    if (confirm.trim().toLowerCase() !== 'yes') {
      console.log('❌ Cancelled');
      process.exit(0);
    }

    // Update in Supabase
    console.log('\n⏳ Updating release...');

    const { data, error } = await supabase
      .from('app_releases')
      .update({
        version: newVersion,
        force_update: newForceUpdate,
        apk_urls: newApkUrls,
        release_notes: newReleaseNotes,
      })
      .eq('id', selectedRelease.id)
      .select()
      .single();

    if (error) {
      console.error('\n❌ Error updating release:', error.message);
      process.exit(1);
    }

    console.log('\n✅ Release updated successfully!');
    console.log(`   ID: ${data.id}`);
    console.log(`   Version: ${data.version}`);
    console.log(`   Force Update: ${data.force_update ? 'Yes' : 'No'}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
