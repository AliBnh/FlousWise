# FlousWise Frontend Testing Guide

## Complete Setup & Testing Instructions

### Prerequisites

Ensure you have:
- Node.js 18+ installed
- Docker installed and running
- Git

### Step 1: Start Backend Services

```bash
# Navigate to project root
cd /home/user/FlousWise

# Start all backend services
docker-compose up -d

# Verify services are running
docker-compose ps

# You should see:
# - mongodb (port 27017)
# - redis (port 6379)
# - kafka (port 9092)
# - zookeeper (port 2181)
# - auth-service (port 8080)
# - finance-service (port 8081)
```

### Step 2: Start Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### Step 3: Test Authentication Flow

#### Register a New User

1. Open browser to `http://localhost:5173`
2. Click **"Get Started"** or **"Register"** button
3. Fill in the registration form:
   - Name: `Ahmed Bennani`
   - Email: `ahmed@example.com`
   - Password: `Password123!`
   - Confirm Password: `Password123!`
4. Click **"Create Account"**
5. You should see success message
6. You'll be redirected to login page after 2 seconds

#### Login

1. On login page, enter:
   - Email: `ahmed@example.com`
   - Password: `Password123!`
2. Click **"Sign In"**
3. You should be redirected to dashboard

### Step 4: Test Dashboard

Once logged in:
- You should see the **Dashboard** page
- Since no profile exists yet, you'll see a welcome message
- The navbar should show your name: **"Welcome, Ahmed Bennani"**
- You should see **Logout** button

### Step 5: Test Analytics

1. Click **"Analytics"** in the navbar
2. You'll see a message: "No analytics available. Please complete your financial profile first."
3. This is expected behavior - analytics require profile data

### Step 6: Test Backend API Integration

You can test the API directly:

#### Test Auth Service

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

#### Test Finance Service

```bash
# First, get the access token from login response above
# Then test profile endpoint

export TOKEN="your_access_token_here"

# Get profile (will return 404 if doesn't exist)
curl -X GET http://localhost:8081/api/profile \
  -H "Authorization: Bearer $TOKEN"

# Create a basic profile
curl -X POST http://localhost:8081/api/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "basicInformation": {
      "fullName": "Ahmed Bennani",
      "age": 28,
      "city": "Casablanca"
    },
    "income": {
      "employmentStatus": "Employed full-time",
      "monthlyNetSalary": 9000,
      "totalMonthlyIncome": 9000
    },
    "fixedExpenses": {
      "rent": 2000,
      "electricity": 200,
      "water": 100,
      "internet": 300,
      "totalFixedExpenses": 2600
    },
    "variableExpenses": {
      "groceryShopping": 1500,
      "eatingOut": 500,
      "totalVariableExpenses": 2000
    },
    "debts": [],
    "assetsAndSavings": {
      "bankAccountBalance": 5000,
      "emergencyFund": 5000,
      "totalAssets": 5000,
      "netWorth": 5000
    }
  }'

# Get dashboard summary
curl -X GET http://localhost:8081/api/profile/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Get analytics
curl -X GET http://localhost:8081/api/analytics \
  -H "Authorization: Bearer $TOKEN"
```

### Expected Behavior

#### Successful Registration
- Status: 201 Created
- Response: `{"message": "Registration successful. You can now login with your credentials."}`

#### Successful Login
- Status: 200 OK
- Response includes:
  - `accessToken`: JWT token for API requests
  - `refreshToken`: Token for refreshing access
  - `user`: User object with id, email, name, verified, createdAt

#### Dashboard with Profile
- Shows 4 cards: Monthly Income, Monthly Expenses, Net Surplus, Financial Health Score
- Health score displayed with progress bar
- Quick action buttons visible

#### Analytics with Profile
- Financial Health Score section with component scores
- Key Financial Ratios with status indicators
- Spending by Category with progress bars
- Insights and recommendations

### Troubleshooting

#### Backend Services Not Starting

```bash
# Check logs
docker-compose logs auth-service
docker-compose logs finance-service

# Restart services
docker-compose restart
```

#### CORS Errors in Browser

The backend services should have CORS enabled. Check:
```bash
# Auth service config
cat auth-service/auth/src/main/java/com/auth_service/auth/config/SecurityConfig.java
```

#### 401 Unauthorized

- Check if JWT token is in localStorage (Browser DevTools → Application → Local Storage)
- Token might be expired - logout and login again
- Check backend service logs for authentication errors

#### Frontend Build Errors

```bash
cd frontend
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Monitoring & Debugging

#### Check Backend Health

```bash
# Auth service health
curl http://localhost:8080/actuator/health

# Finance service health
curl http://localhost:8081/actuator/health
```

#### Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
docker-compose logs -f finance-service
```

#### Browser DevTools

- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests/responses
- **Application → Local Storage**: Check stored tokens
- **Redux DevTools**: (if installed) Monitor state changes

### Complete Test Scenarios

#### Scenario 1: New User Journey

1. Visit landing page
2. Register new account
3. Login with credentials
4. See dashboard welcome message
5. Logout
6. Login again - credentials should work

#### Scenario 2: Profile & Analytics

1. Login to account
2. Create profile via API (curl command above)
3. Refresh dashboard - should show summary
4. Visit analytics - should show health score & ratios
5. Observe spending breakdown

#### Scenario 3: Token Refresh

1. Login and get access token
2. Wait for token to expire (default: 1 hour)
3. Make API request - should auto-refresh
4. Check Network tab - see refresh-token request
5. Request should succeed with new token

### Performance Testing

```bash
# Run production build
cd frontend
npm run build

# Serve production build
npm run preview

# Test build size
ls -lh dist/assets/
```

Expected bundle sizes:
- CSS: ~15-20KB (gzipped ~4KB)
- JS: ~250-300KB (gzipped ~90KB)

### Clean Up

```bash
# Stop all services
docker-compose down

# Remove all data (careful!)
docker-compose down -v

# Remove frontend build
cd frontend
rm -rf dist
```

## Summary

The FlousWise frontend is fully integrated with:
- ✅ Auth Service (registration, login, token refresh)
- ✅ Finance Service (profile, dashboard, analytics)
- ✅ Protected routes with JWT authentication
- ✅ Modern UI with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Responsive design

**What's Working:**
- User registration and login
- JWT token management
- Protected dashboard and analytics routes
- API integration with automatic token refresh
- Beautiful, modern UI

**What's Not Yet Implemented:**
- Profile creation form (13 sections)
- Profile editing modals
- AI chat interface
- Data visualization charts
- PDF/CSV export

**Next Steps:**
1. Build the onboarding form for profile creation
2. Add profile editing capabilities
3. Integrate AI service when ready
4. Add Chart.js for data visualization
5. Implement export features
