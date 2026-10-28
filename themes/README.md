# Chrome themes

Three themes for the Chrome Web Store. **Only Desert Dusk will be published** (Nazzal, 28 Oct 2026: one theme only); the other two are kept here but dropped (themes only; extensions go to Firefox AMO and Edge, see [../extensions](../extensions)).

| Theme | Look | Folder |
|---|---|---|
| Desert Dusk (published) | indigo to gold desert sunset, stars, low sun, dunes | [desert-dusk](desert-dusk) |
| Fresh Foam (dropped) | light blue water, bubbles, waves | [fresh-foam](fresh-foam) |
| Midnight Detail (dropped) | dark glossy night-drive look, amber road lines | [midnight-detail](midnight-detail) |

Each folder has `manifest.json`, `images/`, `store/` graphics at the store sizes, the upload zip, a README and a `LISTING.md` with every store field.

```
pip install pillow
python themes/_tools/make_themes.py
python -m unittest discover -s themes/_tools
```

The themes contain no link to or mention of any website. The published theme also avoids brand, trademark and place names. The site URL appears only in the Homepage / Support URL fields recorded in each `LISTING.md`.
