# User Roles and Permissions

## Roles
Admin, Editor, Viewer

## Permissions

| Route       | Admin | Editor | Viewer |
|-------------|-------|--------|--------|
| /run_query  | Yes   | Yes    | No     |
| /schema     | Yes   | Yes    | Yes    |
| /login      | Yes   | Yes    | Yes    |
| /logout     | Yes   | Yes    | Yes    |
| /refresh    | Yes   | Yes    | Yes    |

## Description
Admin: Full access
Editor: Can run queries
Viewer: Read-only schema access