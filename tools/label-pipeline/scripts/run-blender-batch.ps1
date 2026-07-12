param(
    [string]$BlenderExe = $env:BLENDER_EXE,
    [string]$InputDir = "figma_labels",
    [int]$Limit = 0,
    [string]$Only = ""
)

$Root = Split-Path -Parent $PSScriptRoot
$RepoRoot = Split-Path -Parent $Root
$BlenderExe = if ($BlenderExe) { $BlenderExe } else { "C:\Program Files\Blender Foundation\Blender 5.1\blender.exe" }

if (-not (Test-Path $BlenderExe)) { throw "Blender not found: $BlenderExe" }

Set-Location $Root

& $BlenderExe --background --python "$Root\blender\setup_vial_scene.py"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$extra = @("--input", (Join-Path $Root $InputDir), "--tmp", (Join-Path $Root "curved_labels_rgba"))
if ($Limit -gt 0) { $extra += @("--limit", $Limit) }
if ($Only) { $extra += @("--only", $Only) }

& $BlenderExe --background "$Root\assets\vial_template.blend" --python "$Root\blender\render_vial_labels.py" -- $extra
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

python "$Root\scripts\composite_product_shots.py"
exit $LASTEXITCODE
