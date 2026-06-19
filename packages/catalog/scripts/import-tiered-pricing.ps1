# Import tiered 5/10/20 pack pricing from Excel into catalog JSON.
param(
  [string]$XlsxPath = (Join-Path $env:USERPROFILE "Downloads\Tiered_Pricing_5_10_20_Vials.xlsx")
)

$ErrorActionPreference = "Stop"
$Root = Split-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) -Parent
$CatalogPath = Join-Path $Root "product_catalog_usd.json"
$TieredPath = Join-Path $Root "packages\catalog\data\tiered-catalog.json"
$PackPricingTs = Join-Path $Root "revamp\app\src\data\pack-pricing.ts"

function Slugify([string]$value) {
  ($value.ToLower() -replace '[^a-z0-9]+', '-' -replace '(^-+|-+$)', '')
}

function Parse-Strength([string]$name) {
  if ($name -match '(\d+\s*(?:mg|ml|iu|mcg|count(?:\s*\([^)]+\))?)[^\s]*)') {
    $strength = $Matches[1].Trim()
    $base = ($name -replace [regex]::Escape(" $strength") + '$', '').Trim()
    return $base, $strength
  }
  return $name.Trim(), "Standard"
}

function Normalize-TierLabel([int]$qty) {
  if ($qty -eq 1) { return "1 vial" }
  return "$qty vials"
}

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Read-JsonFile([string]$Path) {
  $text = [System.IO.File]::ReadAllText($Path)
  if ($text.Length -gt 0 -and [int][char]$text[0] -eq 0xFEFF) {
    $text = $text.Substring(1)
  }
  return $text | ConvertFrom-Json
}
  $normalized = $pname.Trim().ToLower()
  foreach ($row in $oldRows) {
    $combined = "$($row.name) $($row.strength)".Trim().ToLower()
    if ($combined -eq $normalized -or $row.name.Trim().ToLower() -eq $normalized) {
      return $row.slug, $row.category, $row.storefront_category
    }
  }
  return (Slugify $pname), $null, $null
}

function Read-TierRows([string]$path) {
  $tmpZip = Join-Path $env:TEMP "tiered-pricing-import.zip"
  $tmpDir = Join-Path $env:TEMP "tiered-pricing-import"
  Copy-Item $path $tmpZip -Force
  if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }
  Expand-Archive -Path $tmpZip -DestinationPath $tmpDir -Force

  [xml]$sheet = Get-Content (Join-Path $tmpDir "xl\worksheets\sheet1.xml")
  $ns = @{ m = "http://schemas.openxmlformats.org/spreadsheetml/2006/main" }
  $rows = Select-Xml -Xml $sheet -XPath "//m:sheetData/m:row" -Namespace $ns

  $parsed = @()
  foreach ($row in $rows) {
    $rowNum = [int]$row.Node.r
    if ($rowNum -le 4) { continue }

    $map = @{}
    foreach ($c in $row.Node.ChildNodes) {
      $col = ($c.r -replace '\d+', '')
      $val = if ($c.t -eq "inlineStr") { [string]$c.is.t } elseif ($c.v) { [string]$c.v } else { "" }
      $map[$col] = $val.Trim()
    }

    if (-not $map["B"] -or -not $map["C"]) { continue }
    $status = $map["H"]
    $qty = [int]$map["D"]
    if ($status -ne "ACTIVE" -and $qty -notin 5, 10, 20) { continue }
    if ($qty -notin 5, 10, 20) { continue }

    $parsed += [pscustomobject]@{
      category      = $map["A"]
      product_name  = $map["B"]
      tier          = (Normalize-TierLabel $qty)
      qty           = $qty
      total_price   = [double]$map["E"]
      per_vial      = [double]$map["F"]
      savings       = if ($map["G"]) { [double]$map["G"] } else { 0 }
    }
  }

  Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item $tmpZip -Force -ErrorAction SilentlyContinue
  return $parsed
}

if (-not (Test-Path $XlsxPath)) {
  Write-Error "Missing pricing workbook: $XlsxPath"
}

$oldRows = Read-JsonFile $CatalogPath
$df = Read-TierRows $XlsxPath

$tieredProducts = @()
$flatRows = @()
$unmatched = @()
$groups = $df | Group-Object product_name, category

foreach ($group in $groups) {
  $pname = $group.Group[0].product_name
  $category = $group.Group[0].category
  $slug, $srcCategory, $storefrontCategory = Match-Slug $pname $oldRows
  if (-not $srcCategory) { $unmatched += $pname }

  $packTiers = @(
    $group.Group | Sort-Object qty | ForEach-Object {
      @{
        tier          = $_.tier
        qty           = $_.qty
        price_usd     = [math]::Round($_.total_price, 2)
        per_unit_usd  = [math]::Round($_.per_vial, 2)
        savings_pct   = [math]::Round($_.savings, 4)
      }
    }
  )

  $tieredProducts += @{
    category             = if ($srcCategory) { $srcCategory.Trim() } else { $category.Trim() }
    storefront_category  = $storefrontCategory
    name                 = $pname.Trim()
    slug                 = $slug
    pack_tiers           = $packTiers
  }

  $baseName, $strength = Parse-Strength $pname
  if ($srcCategory) {
    foreach ($row in $oldRows) {
      if ($row.slug -eq $slug) {
        $baseName = $row.name
        $strength = $row.strength
        break
      }
    }
  }

  $flatRows += @{
    category             = if ($srcCategory) { $srcCategory.Trim() } else { $category.Trim() }
    name                 = $baseName
    strength             = $strength
    price_usd            = $packTiers[0].price_usd
    slug                 = $slug
    storefront_category  = $storefrontCategory
    pack_tiers           = $packTiers
  }
}

$tieredPayload = @{
  source   = $XlsxPath
  products = $tieredProducts
}
New-Item -ItemType Directory -Force -Path (Split-Path $TieredPath) | Out-Null
Write-Utf8NoBom $TieredPath ($tieredPayload | ConvertTo-Json -Depth 10)
Write-Utf8NoBom $CatalogPath ($flatRows | ConvertTo-Json -Depth 10)

$tsLines = @(
  "/** Auto-generated from tiered pricing import. Do not edit manually. */",
  "export type PackTier = {",
  "  tier: string;",
  "  qty: number;",
  "  price: number;",
  "  perUnit: number;",
  "  savingsPct: number;",
  "};",
  "",
  "export const packPricingBySlug: Record<string, PackTier[]> = {"
)

foreach ($row in $flatRows) {
  $tierObjects = @(
    $row.pack_tiers | ForEach-Object {
      $tierJson = ($_.tier | ConvertTo-Json -Compress)
      "      { tier: $tierJson, qty: $($_.qty), price: $($_.price_usd), perUnit: $($_.per_unit_usd), savingsPct: $($_.savings_pct) }"
    }
  )
  $slugJson = ($row.slug | ConvertTo-Json -Compress)
  $tsLines += "  $slugJson`: ["
  $tsLines += ($tierObjects -join ",`n") + ","
  $tsLines += "    ],"
}

$tsLines += @(
  "};",
  "",
  "export function getPackTiers(slug: string): PackTier[] | undefined {",
  "  if (packPricingBySlug[slug]) return packPricingBySlug[slug]",
  "  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, '');",
  "  for (const [catalogSlug, tiers] of Object.entries(packPricingBySlug)) {",
  "    if (catalogSlug.replace(/[^a-z0-9]/g, '') === normalized) return tiers;",
  "  }",
  "  return undefined;",
  "}",
  "",
  "export function getDefaultPackTier(slug: string): PackTier | undefined {",
  "  const tiers = getPackTiers(slug);",
  "  return tiers?.[0];",
  "}",
  ""
)

New-Item -ItemType Directory -Force -Path (Split-Path $PackPricingTs) | Out-Null
Write-Utf8NoBom $PackPricingTs ($tsLines -join "`n")

Write-Host "Imported $($tieredProducts.Count) products from $XlsxPath"
Write-Host "Updated $CatalogPath"
Write-Host "Wrote $TieredPath"
if ($unmatched.Count) {
  Write-Host "Unmatched slug mappings ($($unmatched.Count)): $($unmatched[0..9] -join ', ')"
}
