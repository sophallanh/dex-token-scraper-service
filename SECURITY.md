# 🔐 SECURITY: Never Share Your API Keys!

## ⚠️ CRITICAL SECURITY INFORMATION

**NEVER share API keys, tokens, or credentials in:**
- ❌ Public comments
- ❌ Git commits
- ❌ GitHub issues
- ❌ Pull requests
- ❌ Public documentation
- ❌ Screenshots
- ❌ Chat messages
- ❌ Social media

## ✅ Where to Store Credentials

### Local Development
Store in `.env` file (already in `.gitignore`):
```bash
# .env - This file is NEVER committed to git
BIRDEYE_API_KEY=your_real_key_here
GITHUB_TOKEN=your_real_token_here
```

### GitHub Actions
Store in GitHub Secrets:
1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add each secret individually
5. Secrets are encrypted and never visible in logs

## 🚨 What to Do If You Exposed Credentials

If you accidentally shared credentials publicly:

### 1. Revoke Immediately

**GitHub Personal Access Token:**
1. Go to https://github.com/settings/tokens
2. Find the exposed token
3. Click "Delete" or "Revoke"
4. Generate a new one following SETUP_GUIDE.md

**Birdeye API Key:**
1. Log in to https://birdeye.so/
2. Go to API Settings/Dashboard
3. Delete or regenerate the exposed key
4. Generate a new one

**DexScreener API Key:**
1. Contact DexScreener support if you had one
2. Request revocation and new key

### 2. Generate New Credentials
Follow SETUP_GUIDE.md to create new, secure credentials.

### 3. Update Securely
- Update your local `.env` file with new credentials
- Update GitHub Secrets with new credentials
- Never share the new credentials

## 📋 Security Best Practices

### For API Keys
- ✅ Store in `.env` files (local)
- ✅ Store in GitHub Secrets (Actions)
- ✅ Use environment variables
- ✅ Rotate keys regularly (every 90 days)
- ✅ Use different keys for dev/prod
- ✅ Monitor API usage for anomalies

### For GitHub Tokens
- ✅ Use fine-grained tokens with minimal scopes
- ✅ Set expiration dates (90 days max)
- ✅ Only grant necessary permissions
- ✅ Review and revoke unused tokens
- ✅ Never use personal tokens in shared environments

### For Code
- ✅ Check `.gitignore` includes `.env`
- ✅ Use `git secret` or similar tools for sensitive data
- ✅ Scan commits for secrets before pushing
- ✅ Use pre-commit hooks to prevent credential commits

## 🔍 How to Check If You've Committed Secrets

```bash
# Check if .env is in .gitignore
cat .gitignore | grep .env

# Search git history for potential secrets
git log -p | grep -i "api_key\|token\|password\|secret"

# Use tools to scan for secrets
npm install -g git-secrets
git secrets --scan
```

## 🛠️ Tools to Help

- **git-secrets**: Prevents committing secrets
- **truffleHog**: Searches for secrets in git history
- **GitHub Secret Scanning**: Automatic detection (if enabled)
- **1Password/LastPass**: Secure credential storage

## 📚 Additional Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12 Factor App - Config](https://12factor.net/config)

## ✉️ Questions?

If you're unsure about credential security:
1. Read SETUP_GUIDE.md carefully
2. Follow the principle: "If in doubt, don't share it out"
3. Use GitHub Secrets for all automated workflows
4. Keep `.env` file local and never commit it

---

**Remember**: Exposed credentials can lead to:
- 🚨 Unauthorized API access
- 💰 Unexpected charges
- 🔓 Data breaches
- 🗑️ Resource deletion
- 📊 Data theft

**Always keep your credentials secret!**
