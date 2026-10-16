<#
.SYNOPSIS
    Validates that the agentic SDLC pipeline docs exist and are in the expected state for a given Jira story.

.DESCRIPTION
    Structural check used by the verification-engineer / pr-creator agents (see
    skills/02-pr-validation-skill.md). The Jira key is always passed in as a parameter -
    nothing in this script is hardcoded to a specific issue.

.PARAMETER JiraId
    The Jira issue key to validate, e.g. PROJ-123.

.EXAMPLE
    ./tests/validate-story.ps1 -JiraId PROJ-123
#>
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Z][A-Z0-9]+-\d+$')]
    [string]$JiraId
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$storyDocsPath = Join-Path $repoRoot "docs\$JiraId"
$stateFile = Join-Path $storyDocsPath 'pipeline-state.json'

$requiredDocs = @(
    '01-requirements.md',
    '02-architecture.md',
    '03-design-review.md',
    '04-impl-plan.md',
    '05-implementation-summary.md',
    '06-code-review.md'
)

$failures = @()

if (-not (Test-Path $storyDocsPath)) {
    Write-Error "docs\$JiraId does not exist. Run the pipeline for $JiraId before validating."
    exit 1
}

foreach ($doc in $requiredDocs) {
    $docPath = Join-Path $storyDocsPath $doc
    if (-not (Test-Path $docPath)) {
        $failures += "Missing doc: docs\$JiraId\$doc"
    }
}

if (-not (Test-Path $stateFile)) {
    $failures += "Missing docs\$JiraId\pipeline-state.json"
}
else {
    $state = Get-Content $stateFile -Raw | ConvertFrom-Json
    if ($state.jiraId -ne $JiraId) {
        $failures += "pipeline-state.json jiraId ('$($state.jiraId)') does not match -JiraId ('$JiraId')"
    }
    if ($state.stages.'code-review'.approval -ne 'approved') {
        $failures += "code-review stage is not approved (found '$($state.stages.'code-review'.approval)')"
    }
}

if ($failures.Count -gt 0) {
    Write-Host "FAIL: $JiraId" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "PASS: $JiraId - all required docs present and code-review approved." -ForegroundColor Green
exit 0
