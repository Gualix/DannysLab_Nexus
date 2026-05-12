#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         DannysLab_Nexus - Pre-Deployment Validation           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"

FAILED=0
PASSED=0

# Function to check command
check_command() {
  if command -v $1 &> /dev/null; then
    echo -e "${GREEN}✓${NC} $2"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $2"
    ((FAILED++))
  fi
}

# Function to check file
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $2"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $2"
    ((FAILED++))
  fi
}

# Function to check env variable
check_env() {
  if [ -n "${!1}" ]; then
    echo -e "${GREEN}✓${NC} $2"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $2 (set in .env.local)"
    ((FAILED++))
  fi
}

# Function to run command silently
run_silent() {
  if eval "$1" > /dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

echo ""
echo -e "${BLUE}─── System Requirements ───${NC}"
check_command "node" "Node.js installed"
check_command "npm" "npm installed"
check_command "git" "Git installed"
check_command "docker" "Docker installed (optional)"

echo ""
echo -e "${BLUE}─── Node.js Versions ───${NC}"
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  if [[ $NODE_VERSION == v2[2-9].* ]] || [[ $NODE_VERSION == v3*.* ]]; then
    echo -e "${GREEN}✓${NC} Node.js version $NODE_VERSION (22+)"
    ((PASSED++))
  else
    echo -e "${YELLOW}!${NC} Node.js version $NODE_VERSION (22+ recommended)"
    ((PASSED++))
  fi
fi

if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  if [[ $NPM_VERSION == 1[0-9].* ]] || [[ $NPM_VERSION == 2*.* ]]; then
    echo -e "${GREEN}✓${NC} npm version $NPM_VERSION (10+)"
    ((PASSED++))
  else
    echo -e "${YELLOW}!${NC} npm version $NPM_VERSION (10+ recommended)"
    ((PASSED++))
  fi
fi

echo ""
echo -e "${BLUE}─── Project Files ───${NC}"
check_file "package.json" "package.json exists"
check_file ".env.example" ".env.example exists"
check_file ".gitignore" ".gitignore exists"
check_file "Dockerfile" "Dockerfile exists"
check_file "docker-compose.yml" "docker-compose.yml exists"
check_file "SETUP.md" "SETUP.md documentation exists"
check_file "ANALYSIS.md" "ANALYSIS.md documentation exists"

echo ""
echo -e "${BLUE}─── Environment Variables ───${NC}"
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓${NC} .env.local exists"
  ((PASSED++))
  
  source .env.local 2>/dev/null
  check_env "VITE_SUPABASE_URL" "VITE_SUPABASE_URL configured"
  check_env "VITE_SUPABASE_PUBLISHABLE_KEY" "VITE_SUPABASE_PUBLISHABLE_KEY configured"
  check_env "SUPABASE_URL" "SUPABASE_URL configured"
  check_env "SUPABASE_SERVICE_ROLE_KEY" "SUPABASE_SERVICE_ROLE_KEY configured"
else
  echo -e "${YELLOW}!${NC} .env.local not found"
  echo -e "  ${BLUE}Run: cp .env.example .env.local${NC}"
  ((PASSED++))
fi

echo ""
echo -e "${BLUE}─── Dependencies ───${NC}"
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} node_modules exists"
  ((PASSED++))
else
  echo -e "${RED}✗${NC} node_modules not found"
  echo -e "  ${BLUE}Run: npm install${NC}"
  ((FAILED++))
fi

echo ""
echo -e "${BLUE}─── Build Status ───${NC}"
if run_silent "npm run build"; then
  echo -e "${GREEN}✓${NC} npm run build succeeded"
  ((PASSED++))
else
  echo -e "${RED}✗${NC} npm run build failed"
  echo -e "  ${BLUE}Try: npm install && npm run build${NC}"
  ((FAILED++))
fi

echo ""
echo -e "${BLUE}─── Lint Status ───${NC}"
if command -v npx &> /dev/null; then
  # Run lint (don't fail on this one)
  if run_silent "npm run lint"; then
    echo -e "${GREEN}✓${NC} npm run lint passed"
    ((PASSED++))
  else
    echo -e "${YELLOW}!${NC} npm run lint has warnings/errors (check manually)"
    ((PASSED++))
  fi
fi

echo ""
echo -e "${BLUE}─── Docker ───${NC}"
if command -v docker &> /dev/null; then
  if docker --version > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Docker available"
    ((PASSED++))
    
    if docker-compose --version > /dev/null 2>&1; then
      echo -e "${GREEN}✓${NC} Docker Compose available"
      ((PASSED++))
    else
      echo -e "${YELLOW}!${NC} Docker Compose not found"
      ((PASSED++))
    fi
  fi
fi

echo ""
echo -e "${BLUE}─── API Endpoints ───${NC}"
check_file "src/routes/api/health.ts" "/api/health endpoint exists"
check_file "src/routes/api/public/request-submit.ts" "/api/public/request-submit endpoint exists"

echo ""
echo -e "${BLUE}─── Security ───${NC}"
if grep -q "SUPABASE_SERVICE_ROLE_KEY" .gitignore 2>/dev/null; then
  echo -e "${GREEN}✓${NC} .gitignore contains .env rules"
  ((PASSED++))
else
  echo -e "${YELLOW}!${NC} Verify .gitignore excludes .env files"
  ((PASSED++))
fi

if [ ! -f ".env" ]; then
  echo -e "${GREEN}✓${NC} .env not committed"
  ((PASSED++))
else
  echo -e "${RED}✗${NC} .env file found (remove from git!)"
  ((FAILED++))
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Summary:${NC}"
echo -e "  ${GREEN}✓ Checks Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "  ${RED}✗ Checks Failed: $FAILED${NC}"
else
  echo -e "  ${GREEN}✗ Checks Failed: 0${NC}"
fi

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
  echo ""
  echo -e "Next steps:"
  echo -e "  ${BLUE}1. npm run dev${NC}              # Test locally"
  echo -e "  ${BLUE}2. docker-compose up${NC}        # Test in Docker"
  echo -e "  ${BLUE}3. See DEPLOY_CHECKLIST.md${NC}  # Pre-production checklist"
  echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
  exit 0
else
  echo -e "${RED}════════════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}❌ Some checks failed. Please fix issues above.${NC}"
  echo -e "${RED}════════════════════════════════════════════════════════════════${NC}"
  exit 1
fi
