# Fresh Foam (Chrome theme)

A bright, clean theme of soft blue water, drifting bubbles and gentle waves.

Preview: [store/screenshot-1280x800.png](store/screenshot-1280x800.png)

## Contents
- `manifest.json`: Manifest V3 theme. No permissions, no scripts, no icons key.
- `images/`: `theme_frame.png` 1920×80, `theme_toolbar.png` 1920×48, `theme_ntp_background.png` 1920×1080.
- `store/`: Chrome Web Store graphics (icon 128, screenshot 1280×800, small promo 440×280, marquee 1400×560).
- `fresh-foam.zip`: the upload package (manifest and 3 images, manifest at the zip root).

## Rebuild and check
```
pip install pillow
python themes/_tools/make_themes.py          # deterministic: same bytes every run
python -m unittest discover -s themes/_tools # sizes, manifest limits, zip layout
```

To try it locally: open `chrome://extensions`, switch on Developer mode, choose Load unpacked and pick this folder.

Licence: MIT.
