$dir = "C:\Users\nazza\Desktop\Turbo-luxury\_dump\rendered"
$rows = @()
$urls = @{}
foreach ($id in @(590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 603, 585, 584, 583)) {
  $h = Get-Content -Raw "$dir\$id.html"
  $m = [regex]::Match($h, '(?s)<div class="entry-content[^>]*>(.*)</div><!-- .entry-content')
  $b = if ($m.Success) { $m.Groups[1].Value } else { $h }
  $i = 0
  foreach ($mm in [regex]::Matches($b, '<img[^>]+kb-img[^>]*>')) {
    $t = $mm.Value
    $i++
    $src = [regex]::Match($t, 'src="([^"]+)"').Groups[1].Value
    $urls[$src] = 1
    $rows += [pscustomobject]@{
      page    = $id
      n       = $i
      file    = ($src -split '/')[-1]
      srcset  = if ($t -match 'srcset=') { 'Y' } else { '-' }
      sizes   = if ($t -match 'sizes=') { 'Y' } else { '-' }
      wh      = if (($t -match 'width="\d+"') -and ($t -match 'height="\d+"')) { 'Y' } else { '-' }
      loading = if ($t -match 'loading="(\w+)"') { $matches[1] } else { 'eager' }
      fetchpr = if ($t -match 'fetchpriority="(\w+)"') { $matches[1] } else { '-' }
      alt     = if ($t -match 'alt="([^"]*)"') { if ($matches[1].Length -gt 0) { 'Y' } else { 'EMPTY' } } else { 'MISSING' }
    }
  }
}
$rows | Format-Table -AutoSize
Write-Host "`n--- unique image URLs: $($urls.Count) ---"
$bad = 0
foreach ($u in $urls.Keys) {
  $c = (curl.exe -s -o NUL -w "%{http_code}" -I $u)
  if ($c -ne '200') { Write-Host "NOT200 ($c) $u"; $bad++ }
}
Write-Host "non-200: $bad"
