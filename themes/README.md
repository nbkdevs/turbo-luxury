# Chrome themes

Three themes for the Chrome Web Store (themes only; extensions go to Firefox AMO and Edge, see [../extensions](../extensions)).

| Theme | Look | Folder |
|---|---|---|
| Abu Dhabi Dusk | indigo to gold desert sunset, skyline, dunes | [abu-dhabi-dusk](abu-dhabi-dusk) |
| Fresh Foam | light blue water, bubbles, waves | [fresh-foam](fresh-foam) |
| Midnight Detail | dark glossy night-drive look, amber road lines | [midnight-detail](midnight-detail) |

Each folder has `manifest.json`, `images/`, `store/` graphics at the store sizes, the upload zip, a README and a `LISTING.md` with every store field.

```
pip install pillow
python themes/_tools/make_themes.py
python -m unittest discover -s themes/_tools
```

The themes contain no link to or mention of any website. The site URL appears only in the Homepage URL field recorded in each `LISTING.md`.
