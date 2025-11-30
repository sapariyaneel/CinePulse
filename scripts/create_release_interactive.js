#!/usr/bin/env node

/**
 * Interactive CLI script to create a new release in Supabase
 * Usage: npm run release:create
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
          // Accept 200, 302, etc.
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
  console.log('\n🚀 Create New Release\n');

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
  const supabaseKey = process.env.SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_PROJECT_URL and SUPABASE_API_KEY must be set in .env file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get version
    let version = '';
    while (!version) {
      const input = await question('Version (semver format, e.g., 1.0.0): ');
      const cleanVersion = input.trim().replace(/^v/, '');
      
      if (isValidSemver(cleanVersion)) {
        version = cleanVersion;
      } else {
        console.log('❌ Invalid semver format. Please use format like 1.0.0');
      }
    }

    // Get force_update
    const forceUpdateInput = await question('Force update? (yes/no) [no]: ');
    const forceUpdate = forceUpdateInput.trim().toLowerCase() === 'yes';

    // Get release notes
    const releaseNotes = await question('Release notes (optional): ');

    // Get APK URLs for each ABI
    console.log('\n📦 APK URLs (paste GitHub release asset direct download URLs, or press Enter to skip):\n');
    
    const abis = ['arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64', 'universal'];
    const apkUrls = {};

    for (const abi of abis) {
      const url = await question(`  ${abi}: `);
      const trimmedUrl = url.trim();

      if (trimmedUrl) {
        // Validate URL format
        if (!isValidUrl(trimmedUrl)) {
          console.log(`  ⚠️  Invalid URL format for ${abi}, skipping...`);
          continue;
        }

        // Check if URL exists
        console.log(`  🔍 Checking URL...`);
        const exists = await checkUrlExists(trimmedUrl);
        
        if (!exists) {
          console.log(`  ⚠️  Warning: URL may not be accessible (got non-200 response)`);
          const proceed = await question(`  Continue anyway? (yes/no) [no]: `);
          if (proceed.trim().toLowerCase() !== 'yes') {
            console.log(`  Skipping ${abi}...`);
            continue;
          }
        } else {
          console.log(`  ✅ URL verified`);
        }

        apkUrls[abi] = trimmedUrl;
      }
    }

    if (Object.keys(apkUrls).length === 0) {
      console.error('\n❌ Error: At least one APK URL is required');
      process.exit(1);
    }

    // Confirm inputs
    console.log('\n📋 Release Summary:');
    console.log(`  Platform: android`);
    console.log(`  Version: ${version}`);
    console.log(`  Force Update: ${forceUpdate ? 'Yes' : 'No'}`);
    console.log(`  Release Notes: ${releaseNotes || '(none)'}`);
    console.log(`  APK URLs:`);
    Object.entries(apkUrls).forEach(([abi, url]) => {
      console.log(`    ${abi}: ${url}`);
    });

    const confirm = await question('\n✅ Create this release? (yes/no): ');
    
    if (confirm.trim().toLowerCase() !== 'yes') {
      console.log('❌ Cancelled');
      process.exit(0);
    }

    // Insert into Supabase
    console.log('\n⏳ Creating release...');

    const { data, error } = await supabase
      .from('app_releases')
      .insert({
        platform: 'android',
        version,
        force_update: forceUpdate,
        apk_urls: apkUrls,
        release_notes: releaseNotes || null,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('\n❌ Error creating release:', error.message);
      process.exit(1);
    }

    console.log('\n✅ Release created successfully!');
    console.log(`   ID: ${data.id}`);
    console.log(`   Version: ${data.version}`);
    console.log(`   Published: ${new Date(data.published_at).toLocaleString()}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
