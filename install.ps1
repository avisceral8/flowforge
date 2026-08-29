# FlowForge installer for Windows (PowerShell).
# Upstream base: tt-a1i/archify (MIT). FlowForge changes: MIT.
param(
    [Parameter(Position = 0)]
    [ValidateSet('all', 'pi', 'claude', 'codex', 'opencode')]
    [string]$Target = 'all'
)

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $scriptDir 'flowforge'

if (-not (Test-Path (Join-Path $src 'SKILL.md'))) {
    Write-Error "error: $src\SKILL.md not found - run from the FlowForge repository root"
}

function Install-To {
    param([string]$DestDir)
    $dest = Join-Path $DestDir 'flowforge'
    New-Item -ItemType Directory -Force -Path $DestDir | Out-Null
    if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    # Tracked-only copy: excludes node_modules, tests, and dev scripts.
    foreach ($item in @('SKILL.md', 'schemas', 'renderers', 'references', 'recipes', 'examples', 'assets', 'bin', 'delta', 'package.json')) {
        $from = Join-Path $src $item
        if (Test-Path $from) { Copy-Item -Recurse -Force $from (Join-Path $dest $item) }
    }
    Write-Host "installed: $dest"
}

switch ($Target) {
    'pi'      { Install-To (Join-Path $env:USERPROFILE '.pi\skills') }
    'claude'  { Install-To (Join-Path $env:USERPROFILE '.claude\skills') }
    'codex'   { Install-To (Join-Path $env:USERPROFILE '.codex\skills') }
    'opencode'{ Install-To (Join-Path $env:USERPROFILE '.config\opencode\skills') }
    'all' {
        if (Test-Path (Join-Path $env:USERPROFILE '.pi')) { Install-To (Join-Path $env:USERPROFILE '.pi\skills') }
        if (Test-Path (Join-Path $env:USERPROFILE '.claude')) { Install-To (Join-Path $env:USERPROFILE '.claude\skills') }
        if (Test-Path (Join-Path $env:USERPROFILE '.codex')) { Install-To (Join-Path $env:USERPROFILE '.codex\skills') }
        if (Test-Path (Join-Path $env:USERPROFILE '.config\opencode')) { Install-To (Join-Path $env:USERPROFILE '.config\opencode\skills') }
    }
}

Write-Host 'FlowForge installed. Ask your agent: "Map our expense approval process."'
