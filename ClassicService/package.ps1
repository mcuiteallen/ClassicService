Remove-item -force -R "DBMService.exe"
pkg --config package.json app.js
Remove-item -force -R "./installer/Windows/archives/Database"
Remove-item -force -R "./installer/Windows/archives/config"
Remove-item -force -R "./installer/Windows/archives/DBMService.exe"
Copy-item -force "DBMService.exe" "./installer/Windows/archives"
Copy-item -force -R "Database" "./installer/Windows/archives"
Copy-item -force -R "config" "./installer/Windows/archives"
Remove-item -force -R "DBMService.exe"