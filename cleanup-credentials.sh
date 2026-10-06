#!/bin/bash
# CREDENTIALS REMOVAL & ROTATION SCRIPT
# This script removes exposed credentials from git and provides rotation instructions

echo "================================================================================="
echo "                   CREDENTIALS CLEANUP & ROTATION SCRIPT"
echo "================================================================================="
echo ""

# Step 1: Check git status
echo "Step 1: Checking git status for exposed credentials..."
echo "────────────────────────────────────────────────────────────────────────────────"
git log --all --name-only --oneline | grep -E "client_secret|\.env" && {
    echo "⚠️  WARNING: Credentials found in git history!"
    echo ""
    echo "If credentials are in git history, you need to use git filter-branch or BFG:"
    echo "  git filter-branch --tree-filter 'rm -f client_secret_*.json .env' -- --all"
    echo "  git push origin --force"
} || {
    echo "✅ No credentials found in git history - you're safe!"
}

echo ""
echo "Step 2: Verify .gitignore has proper entries..."
echo "────────────────────────────────────────────────────────────────────────────────"
grep -E "client_secret_\*|\.env$" .gitignore && {
    echo "✅ .gitignore properly configured"
} || {
    echo "⚠️  WARNING: .gitignore missing entries for secrets"
    echo "Adding to .gitignore..."
    echo "" >> .gitignore
    echo "# Credentials and secrets" >> .gitignore
    echo "client_secret_*.json" >> .gitignore
    echo ".env" >> .gitignore
    echo "credentials.json" >> .gitignore
    git add .gitignore
    git commit -m "Update .gitignore to prevent committing secrets"
}

echo ""
echo "Step 3: Verify secrets are not tracked in git..."
echo "────────────────────────────────────────────────────────────────────────────────"
git ls-files | grep -E "client_secret|\.env" && {
    echo "⚠️  WARNING: Secrets are tracked in git!"
    echo "Removing from git (keeping local copies)..."
    git rm --cached client_secret_*.json 2>/dev/null || true
    git rm --cached .env 2>/dev/null || true
    git commit -m "Remove secrets from git tracking (files remain locally)"
} || {
    echo "✅ Secrets are not tracked in git"
}

echo ""
echo "Step 4: Verify working directory..."
echo "────────────────────────────────────────────────────────────────────────────────"
ls -la | grep -E "client_secret|\.env" && {
    echo "✅ Credential files exist in working directory (not in git)"
} || {
    echo "⚠️  Credential files not found - you may need to restore them"
}

echo ""
echo "================================================================================="
echo "                              ✅ CLEANUP COMPLETE"
echo "================================================================================="
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. ROTATE GOOGLE OAUTH CREDENTIALS (URGENT!):"
echo "   • Go to: https://console.cloud.google.com/"
echo "   • Delete current OAuth 2.0 credentials"
echo "   • Create new Client ID & Secret"
echo "   • Save to .env with new values"
echo ""
echo "2. GENERATE NEW SESSION_SECRET:"
echo "   node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo "   Update .env with new value"
echo ""
echo "3. VERIFY .env IS IN .gitignore"
echo "   Check: grep '.env' .gitignore"
echo ""
echo "4. TEST APPLICATION:"
echo "   npm install"
echo "   npm start"
echo ""
echo "5. GIT STATUS SHOULD SHOW .env & client_secret AS UNTRACKED"
echo "   git status"
echo ""
echo "================================================================================="
