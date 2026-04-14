# Cleanup script for VelDB unwanted files and unnecessary structures

# 1. Accidental wrapper / Duplicate directories
Remove-Item -Recurse -Force "c:\VelDB\VelDB" -ErrorAction SilentlyContinue

# 2. Stray package-lock in root
Remove-Item -Force "c:\VelDB\package-lock.json" -ErrorAction SilentlyContinue

# 3. Accumulated Log files
Remove-Item -Force "c:\VelDB\server\server.err" -ErrorAction SilentlyContinue
Remove-Item -Force "c:\VelDB\server\server.log" -ErrorAction SilentlyContinue
Remove-Item -Force "c:\VelDB\ui\web\vite.err" -ErrorAction SilentlyContinue
Remove-Item -Force "c:\VelDB\ui\web\vite.log" -ErrorAction SilentlyContinue

# 4. Misplaced Express server inside React Vite frontend
Remove-Item -Force "c:\VelDB\ui\web\src\index.js" -ErrorAction SilentlyContinue

# 5. Unused UI Components / Legacy files
Remove-Item -Force "c:\VelDB\ui\web\src\AppTemp.jsx" -ErrorAction SilentlyContinue
Remove-Item -Force "c:\VelDB\ui\web\src\components\SqlPage.jsx" -ErrorAction SilentlyContinue
Remove-Item -Force "c:\VelDB\ui\web\src\components\ApiExample.jsx" -ErrorAction SilentlyContinue

# 6. Unused default Vite/React assets in src/assets
Remove-Item -Force "c:\VelDB\ui\web\src\assets\hero.png" -ErrorAction SilentlyContinue
Remove-Item -Force "c:\VelDB\ui\web\src\assets\react.svg" -ErrorAction SilentlyContinue
Remove-Item -Force "c:\VelDB\ui\web\src\assets\vite.svg" -ErrorAction SilentlyContinue

# 7. Unused scaffolding skeleton folders in root (those with just a 3-byte README.md)
Remove-Item -Recurse -Force "c:\VelDB\ai" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "c:\VelDB\api" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "c:\VelDB\core" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "c:\VelDB\docs" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "c:\VelDB\devops" -ErrorAction SilentlyContinue

Write-Host "Cleanup completed successfully!"
