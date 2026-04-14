# Cleanup unnecessary files and directories
Remove-Item -Recurse -Force "c:\VelDB\VelDB"
Remove-Item -Force "c:\VelDB\package-lock.json"
Remove-Item -Force "c:\VelDB\server\server.err"
Remove-Item -Force "c:\VelDB\server\server.log"
Remove-Item -Force "c:\VelDB\ui\web\vite.err"
Remove-Item -Force "c:\VelDB\ui\web\vite.log"
Write-Host "Cleanup completed."
