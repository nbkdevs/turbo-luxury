$dir = "C:\Users\nazza\Desktop\Turbo-luxury\_dump\rendered"
$dump = "C:\Users\nazza\Desktop\Turbo-luxury\_dump"

function Norm([string]$s) {
  $s = [regex]::Replace($s, '<[^>]+>', '')
  $s = [System.Net.WebUtility]::HtmlDecode($s)
  $s = $s -replace [char]0x00A0, ' '
  $s = $s -replace [char]0x2019, "'"
  $s = [regex]::Replace($s, '\s+', ' ')
  return $s.Trim()
}

$all = @()
foreach ($id in @(590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 603, 585, 584, 583)) {
  $h = Get-Content -Raw "$dir\$id.html"
  $m = [regex]::Match($h, '(?s)<div class="entry-content[^>]*>(.*)</div><!-- .entry-content')
  $b = if ($m.Success) { $m.Groups[1].Value } else { $h }
  $after = @()
  foreach ($mm in [regex]::Matches($b, '(?s)<(h[123])[^>]*>(.*?)</\1>')) {
    $after += ($mm.Groups[1].Value + "`t" + (Norm $mm.Groups[2].Value))
  }

  $before = @()
  foreach ($line in Get-Content "$dump\inv-before-$id.txt") {
    $p = $line -split "`t", 2
    if ($p.Length -lt 2) { continue }
    if ($p[0] -in @('h1', 'h2', 'h3')) { $before += ($p[0] + "`t" + (Norm $p[1])) }
  }

  $lost = @()
  $tmp = [System.Collections.ArrayList]::new($after)
  foreach ($x in $before) { $i = $tmp.IndexOf($x); if ($i -ge 0) { $tmp.RemoveAt($i) } else { $lost += $x } }
  $added = @($tmp)

  $all += [pscustomobject]@{ id = $id; before = $before.Count; after = $after.Count; lost = $lost.Count; added = $added.Count }
  if ($lost.Count -or $added.Count) {
    Write-Host "=== $id  before=$($before.Count) after=$($after.Count)"
    foreach ($x in $lost) { Write-Host "   LOST $x" }
    foreach ($x in $added) { Write-Host "   NEW  $x" }
  }
}
Write-Host ""
$all | Format-Table -AutoSize
