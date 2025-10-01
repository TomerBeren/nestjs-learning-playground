Write-Host "Testing NestJS Cats API..."

# Test GET request (should return empty array initially)
Write-Host "`nTesting GET /cats:"
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/cats" -Method Get
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test POST request to create a cat
Write-Host "`nTesting POST /cats:"
try {
    $body = @{
        name = "Whiskers"
        age = 3
        breed = "Persian"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3000/cats" -Method Post -ContentType "application/json" -Body $body
    Write-Host "Cat created successfully!"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test GET request again (should now return the cat we created)
Write-Host "`nTesting GET /cats again:"
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/cats" -Method Get
    Write-Host "Response: $($response | ConvertTo-Json -Depth 2)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}