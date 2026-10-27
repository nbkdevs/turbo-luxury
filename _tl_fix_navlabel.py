from pathlib import Path
p = Path(r"C:\Users\nazza\Local Sites\turbo-luxury-car-wash\app\public\wp-content\novamira-sandbox\turbo-luxury-content.php")
t = p.read_text(encoding="utf-8")
old = """function tl_nav_item_label($item) {
	if ($item['type'] === 'location') { return tl_place_label($item); }
	$t = $item['title'];
	$t = preg_replace('/,?(\\s+Abu Dhabi)+$/i', '', $t);
	return $t;
}"""
new = """function tl_nav_item_label($item) {
	if ($item['type'] === 'location') { return tl_place_label($item); }
	$t = $item['title'];
	if ($item['type'] === 'service') {
		return trim(preg_replace('/\\s+Abu Dhabi$/i', '', $t));
	}
	return trim(preg_replace('/,\\s*Abu Dhabi$/i', '', $t));
}"""
if old not in t:
    # show nearby
    i = t.find("function tl_nav_item_label")
    print(repr(t[i:i+280]))
    raise SystemExit("mismatch")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("ok")
