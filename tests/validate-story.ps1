param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[A-Z][A-Z0-9]+-\d+$')]
  [string]$JiraId
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $root "docs/$JiraId"
$failures = @()

$required = @(
  '01-requirements.md',
  '02-architecture.md',
  '03-design-review.md',
  '04-impl-plan.md',
  '05-implementation-summary.md',
  '06-code-review.md'
)

foreach ($name in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $dir $name))) {
    $failures += "Missing: docs/$JiraId/$name"
  }
}

$statePath = Join-Path $dir 'pipeline-state.json'
if (-not (Test-Path -LiteralPath $statePath)) {
  $failures += "Missing: docs/$JiraId/pipeline-state.json"
} else {
  try {
    $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    $cr = $state.stages.'code-review'
    if (-not $cr -or $cr.approval -ne 'approved') {
      $failures += "code-review is not approved in pipeline-state.json"
    }
  } catch {
    $failures += "pipeline-state.json is not valid JSON"
  }
}

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Host "FAIL: $_" }
  exit 1
}

Write-Host "PASS: $JiraId docs 01-06 present and code-review approved"
exit 0
