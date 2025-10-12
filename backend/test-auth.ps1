# Test Auth Endpoints Script
# Make sure the server is running on http://localhost:3000

$baseUrl = "http://localhost:3000/api/v1"

Write-Host "`n=== Testing NestJS Authentication ===" -ForegroundColor Cyan

# Step 1: Create a test user
Write-Host "`n1. Creating test user 'john'..." -ForegroundColor Yellow
$createUserBody = @{
    username  = "john"
    firstName = "John"
    lastName  = "Doe"
    password  = "changeme"
    isActive  = $true
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method POST -Body $createUserBody -ContentType "application/json"
    Write-Host "✓ User created successfully!" -ForegroundColor Green
    Write-Host ($createResponse | ConvertTo-Json -Depth 3)
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "✓ User 'john' already exists" -ForegroundColor Green
    } else {
        Write-Host "✗ Error creating user: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 2: Login
Write-Host "`n2. Testing POST /auth/login..." -ForegroundColor Yellow
$loginBody = @{
    username = "john"
    password = "changeme"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "Access Token: $($loginResponse.access_token.Substring(0, [Math]::Min(50, $loginResponse.access_token.Length)))..." -ForegroundColor Cyan
    $token = $loginResponse.access_token
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Get Profile with Token
if ($token) {
    Write-Host "`n3. Testing GET /auth/profile with Bearer token..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    try {
        $profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method GET -Headers $headers
        Write-Host "✓ Profile retrieved successfully!" -ForegroundColor Green
        Write-Host ($profileResponse | ConvertTo-Json -Depth 3)
    } catch {
        Write-Host "✗ Profile request failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 4: Test with invalid credentials
Write-Host "`n4. Testing with invalid credentials..." -ForegroundColor Yellow
$invalidLoginBody = @{
    username = "john"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $invalidLoginBody -ContentType "application/json"
    Write-Host "✗ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected invalid credentials" -ForegroundColor Green
}

# Step 5: Test with invalid token
Write-Host "`n5. Testing with invalid token..." -ForegroundColor Yellow
$invalidHeaders = @{
    "Authorization" = "Bearer invalidtoken123"
}

try {
    $invalidProfileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method GET -Headers $invalidHeaders
    Write-Host "✗ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected invalid token" -ForegroundColor Green
}

Write-Host "`n=== Testing Complete! ===" -ForegroundColor Cyan
