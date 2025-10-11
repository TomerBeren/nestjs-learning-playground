# Kafka Testing Script
# This script tests all Kafka endpoints

$baseUrl = "http://localhost:3000/api/v1"

Write-Host "`n=== Testing Kafka Self-Communication ===" -ForegroundColor Cyan
Write-Host "This demonstrates the app sending Kafka messages to itself`n" -ForegroundColor Yellow

# 1. Get endpoint info
Write-Host "1. Getting available test endpoints..." -ForegroundColor Green
Invoke-RestMethod -Uri "$baseUrl/kafka-test" -Method GET | ConvertTo-Json -Depth 5

Start-Sleep -Seconds 2

# 2. Test Order Creation (Request/Response)
Write-Host "`n2. Testing Order Creation (Request/Response pattern)..." -ForegroundColor Green
$orderPayload = @{
    product = "MacBook Pro"
    quantity = 1
    price = 2499.99
} | ConvertTo-Json

Write-Host "Sending order: $orderPayload" -ForegroundColor Gray
Invoke-RestMethod -Uri "$baseUrl/kafka-test/order" -Method POST -Body $orderPayload -ContentType "application/json" | ConvertTo-Json -Depth 5

Start-Sleep -Seconds 2

# 3. Test Payment Processing (Request/Response)
Write-Host "`n3. Testing Payment Processing (Request/Response pattern)..." -ForegroundColor Green
$paymentPayload = @{
    amount = 2499.99
    currency = "USD"
    cardLast4 = "1234"
} | ConvertTo-Json

Write-Host "Sending payment: $paymentPayload" -ForegroundColor Gray
Invoke-RestMethod -Uri "$baseUrl/kafka-test/payment" -Method POST -Body $paymentPayload -ContentType "application/json" | ConvertTo-Json -Depth 5

Start-Sleep -Seconds 2

# 4. Test Order Status Update (Fire and Forget)
Write-Host "`n4. Testing Order Status Update (Fire and Forget pattern)..." -ForegroundColor Green
$statusPayload = @{
    orderId = "ORD-2024-001"
    status = "shipped"
    trackingNumber = "TRACK-ABC123"
} | ConvertTo-Json

Write-Host "Emitting status update: $statusPayload" -ForegroundColor Gray
Invoke-RestMethod -Uri "$baseUrl/kafka-test/order-status" -Method POST -Body $statusPayload -ContentType "application/json" | ConvertTo-Json -Depth 5

Start-Sleep -Seconds 1

# 5. Test User Activity Tracking (Fire and Forget)
Write-Host "`n5. Testing User Activity Tracking (Fire and Forget pattern)..." -ForegroundColor Green
$activityPayload = @{
    userId = "user-12345"
    action = "purchase"
    page = "/checkout"
} | ConvertTo-Json

Write-Host "Emitting user activity: $activityPayload" -ForegroundColor Gray
Invoke-RestMethod -Uri "$baseUrl/kafka-test/user-activity" -Method POST -Body $activityPayload -ContentType "application/json" | ConvertTo-Json -Depth 5

Start-Sleep -Seconds 1

# 6. Test Email Notification (Fire and Forget)
Write-Host "`n6. Testing Email Notification (Fire and Forget pattern)..." -ForegroundColor Green
$emailPayload = @{
    to = "customer@example.com"
    subject = "Order Confirmation"
    body = "Thank you for your order!"
} | ConvertTo-Json

Write-Host "Emitting email notification: $emailPayload" -ForegroundColor Gray
Invoke-RestMethod -Uri "$baseUrl/kafka-test/email" -Method POST -Body $emailPayload -ContentType "application/json" | ConvertTo-Json -Depth 5

Write-Host "`n=== Testing Complete ===" -ForegroundColor Cyan
Write-Host "Check your terminal logs to see the Kafka message flow:" -ForegroundColor Yellow
Write-Host "  1. HTTP Request logged" -ForegroundColor Gray
Write-Host "  2. Kafka Producer sends message" -ForegroundColor Gray
Write-Host "  3. Kafka Consumer receives message" -ForegroundColor Gray
Write-Host "  4. Response returned (for request/response)" -ForegroundColor Gray
Write-Host "`nThis demonstrates self-communication: the app talks to itself via Kafka!" -ForegroundColor Green
