```ps1
$env:APP_KEYS = 'mySecretKey1,mySecretKey2'
$env:ADMIN_JWT_SECRET = 'yourAdminJWTSecret'
$env:API_TOKEN_SALT = 'yourApiTokenSalt'
$env:TRANSFER_TOKEN_SALT = 'yourTransferTokenSalt'
$env:FLAG_NPS = 'true'
$env:FLAG_PROMOTE_EE = 'true'
```
# Replace the ip with the 
## 

```ps1
Get-NetIPAddress | Where-Object { $_.AddressFamily -eq 'IPv4' -and $_.PrefixOrigin -eq 'Dhcp' } | Format-Table
```

// Example 

[//]: # ($env:ADMIN_JWT_SECRET = "n4Q8fT6z9V3kE2s5R1pB7mD0L8jA3wX6")

[//]: # ($env:API_TOKEN_SALT = "P5s9X2a6V8d4R1k3F7n0M5z2L8q7C1b9")

[//]: # ($env:TRANSFER_TOKEN_SALT = "Z3w9T6f4R2m7V1q5K8d0P2s6L3a7N1b4")

[//]: # ($env:APP_KEYS = "D1f8S5z2R9q7L3p6, G4m1N8b5X2d7K9p6")

# Print out the values to verify they've been set:
```ps1```

Write-Host "APP_KEYS: $env:APP_KEYS"
Write-Host "ADMIN_JWT_SECRET: $env:ADMIN_JWT_SECRET"
Write-Host "API_TOKEN_SALT: $env:API_TOKEN_SALT"
Write-Host "TRANSFER_TOKEN_SALT: $env:TRANSFER_TOKEN_SALT"
Write-Host "FLAG_NPS: $env:FLAG_NPS"
Write-Host "FLAG_PROMOTE_EE: $env:FLAG_PROMOTE_EE"
```

npm run strapi admin:create-user --firstname=YourFirstName --lastname=YourLastName --email=YourEmail --password=NewPassword

