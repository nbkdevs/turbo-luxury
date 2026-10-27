$dir = "C:\Users\nazza\Desktop\Turbo-luxury\_dump\rendered"
$rows = @()
foreach ($f in Get-ChildItem "$dir\*.html" | Sort-Object { [int]$_.BaseName }) {
  $h = Get-Content -Raw $f.FullName
  $m = [regex]::Match($h, '(?s)<div class="entry-content[^>]*>(.*)</div><!-- .entry-content')
  $b = if ($m.Success) { $m.Groups[1].Value } else { $h }
  $cnt = { param($s) ([regex]::Matches($b, [regex]::Escape($s))).Count }
  $legacy = 0
  foreach ($c in @('tl-visual-hero','tl-visual-card','tl-photo','"tl-page ','tl-hub-card','tl-hub-grid')) { $legacy += (& $cnt $c) }
  $imgs = [regex]::Matches($b, '<img[^>]+kb-img[^>]*>')
  $rows += [pscustomobject]@{
    id      = $f.BaseName
    h1      = (& $cnt '<h1')
    h2      = (& $cnt '<h2')
    h3      = (& $cnt '<h3')
    imgs    = $imgs.Count
    legacy  = $legacy
    about   = (& $cnt 'tl-about wp-block-kadence-rowlayout')
    cases   = (& $cnt 'tl-cases wp-block')
    areas   = (& $cnt 'tl-areas')
    steps   = (& $cnt 'tl-steps')
    faq     = (& $cnt 'wp-block-details')
    secHead = (& $cnt 'tl-section-head')
    hero    = (& $cnt 'tl-page-hero')
  }
}
$rows | Format-Table -AutoSize
