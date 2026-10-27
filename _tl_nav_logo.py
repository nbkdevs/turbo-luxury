from pathlib import Path

css_path = Path(r"C:\Users\nazza\Local Sites\turbo-luxury-car-wash\app\public\wp-content\novamira-sandbox\turbo-luxury.css")
php_path = Path(r"C:\Users\nazza\Local Sites\turbo-luxury-car-wash\app\public\wp-content\novamira-sandbox\turbo-luxury-content.php")

css = css_path.read_text(encoding="utf-8")
css = css.replace(
    """.kadence-header-row-inner {
  min-height: 88px !important;
  padding: 4px 28px !important;
  display: flex !important; justify-content: space-between !important; align-items: center !important;
}
.tl-wordmark { display: flex; flex-direction: column; text-decoration: none !important; color: #fff !important; line-height: 1.05; }
.tl-wordmark.tl-logo { display: inline-flex; flex-direction: row; align-items: center; line-height: 0; }
.tl-logo img {
  display: block; width: 200px; height: 80px; max-width: 200px;
  border-radius: 0 !important; background: transparent;
}
@media (max-width: 780px) {
  .tl-logo img { width: 156px; height: 62px; max-width: 156px; }
  .kadence-header-row-inner { min-height: 74px !important; padding: 4px 16px !important; }
}""",
    """.kadence-header-row-inner {
  min-height: 72px !important;
  padding: 4px 28px !important;
  display: flex !important; justify-content: space-between !important; align-items: center !important;
}
.wp-block-kadence-header .kadence-header-row-inner {
  height: 80px !important;
  min-height: 80px !important;
  max-height: 80px !important;
  overflow: visible !important;
}
.tl-wordmark { display: flex; flex-direction: column; text-decoration: none !important; color: #fff !important; line-height: 1.05; }
.tl-wordmark.tl-logo { display: inline-flex; flex-direction: row; align-items: center; line-height: 0; height: 80px; }
.tl-logo img {
  display: block; width: 240px; height: 96px; max-width: 240px;
  margin-top: 0; margin-bottom: 0;
  border-radius: 0 !important; background: transparent;
  object-fit: contain; object-position: left center;
}
@media (max-width: 780px) {
  .wp-block-kadence-header .kadence-header-row-inner {
    height: 64px !important; min-height: 64px !important; max-height: 64px !important;
    padding: 4px 16px !important;
  }
  .tl-wordmark.tl-logo { height: 64px; }
  .tl-logo img { width: 176px; height: 70px; max-width: 176px; }
}""",
    1,
)

dropdown = """
.wp-block-kadence-header,
.wp-block-kadence-header.item-is-stuck {
  overflow: visible !important;
}
.wp-block-kadence-header .sub-menu,
.wp-block-kadence-header .kb-nav-sub-menu,
.wp-block-kadence-header ul.sub-menu {
  background: #141414 !important;
  border: 1px solid #2A2A2A !important;
  border-radius: 4px !important;
  padding: 8px 0 !important;
  min-width: 260px;
  box-shadow: 0 16px 36px rgba(0,0,0,.5) !important;
}
.wp-block-kadence-header .sub-menu .menu-item,
.wp-block-kadence-header .sub-menu .kb-link-wrap,
.wp-block-kadence-header .sub-menu .kb-nav-link-content {
  display: flex !important;
  align-items: flex-start !important;
  width: 100%;
}
.wp-block-kadence-header .sub-menu a,
.wp-block-kadence-header .sub-menu .kb-nav-link-content {
  color: #fff !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  letter-spacing: 0.02em;
  text-transform: none !important;
  white-space: normal !important;
  line-height: 1.35 !important;
  padding: 10px 18px !important;
}
.wp-block-kadence-header .sub-menu a:hover,
.wp-block-kadence-header .sub-menu a:hover .kb-nav-link-content,
.wp-block-kadence-header .sub-menu a:focus .kb-nav-link-content {
  color: #C5A059 !important;
  background: transparent !important;
}
.wp-block-kadence-header .kb-nav-dropdown-toggle-btn {
  color: #fff !important;
  background: transparent !important;
}
.wp-block-kadence-header .kb-nav-dropdown-toggle-btn:hover,
.wp-block-kadence-header .menu-item-has-children:hover > .kb-link-wrap .kb-nav-dropdown-toggle-btn {
  color: #C5A059 !important;
}
"""
if ".kb-nav-sub-menu" not in css:
    css = css.rstrip() + "\n" + dropdown
css_path.write_text(css, encoding="utf-8", newline="\n")

php = php_path.read_text(encoding="utf-8")
nav_fn = r'''
function tl_nav_item_label($item) {
	if ($item['type'] === 'location') { return tl_place_label($item); }
	$t = $item['title'];
	$t = preg_replace('/,?(\s+Abu Dhabi)+$/i', '', $t);
	return $t;
}
function tl_kadence_nav_link($uid, $label, $url, $children = array()) {
	$attrs = wp_json_encode(array(
		'uniqueID' => $uid,
		'label' => $label,
		'url' => $url,
		'kind' => 'custom',
	));
	if (!$children) {
		return '<!-- wp:kadence/navigation-link ' . $attrs . ' /-->';
	}
	$html = '<!-- wp:kadence/navigation-link ' . $attrs . ' -->' . "\n";
	foreach ($children as $child) {
		$html .= $child . "\n";
	}
	$html .= '<!-- /wp:kadence/navigation-link -->';
	return $html;
}
function tl_sync_primary_nav() {
	$cat = tl_content_catalog();
	$nl = "\n";
	$svc = array();
	$i = 0;
	foreach ($cat['service'] as $item) {
		$svc[] = tl_kadence_nav_link('navsvc' . $i, tl_nav_item_label($item), home_url('/' . $item['slug'] . '/'));
		$i++;
	}
	$loc = array();
	$i = 0;
	foreach ($cat['location'] as $item) {
		$loc[] = tl_kadence_nav_link('navloc' . $i, tl_nav_item_label($item), home_url('/' . $item['slug'] . '/'));
		$i++;
	}
	$cs = array();
	$i = 0;
	foreach ($cat['case_study'] as $item) {
		$cs[] = tl_kadence_nav_link('navcs' . $i, tl_nav_item_label($item), home_url('/' . $item['slug'] . '/'));
		$i++;
	}
	$content = '<!-- wp:kadence/navigation -->' . $nl
		. tl_kadence_nav_link('nav0tl', 'Services', tl_r('services'), $svc) . $nl
		. tl_kadence_nav_link('nav1tl', 'Areas', tl_r('areas'), $loc) . $nl
		. tl_kadence_nav_link('nav2tl', 'Case Studies', tl_r('case_studies'), $cs) . $nl
		. tl_kadence_nav_link('nav3tl', 'Book', tl_r('book')) . $nl
		. '<!-- /wp:kadence/navigation -->';
	return wp_update_post(array('ID' => 344, 'post_content' => $content, 'post_status' => 'publish'));
}
'''
if "function tl_sync_primary_nav()" not in php:
    php = php.replace(
        "	update_option('tl_quiet_finish_pages', $ids);\n	return $created;\n}",
        "	update_option('tl_quiet_finish_pages', $ids);\n	tl_sync_primary_nav();\n	return $created;\n}"
        + nav_fn,
        1,
    )
    php_path.write_text(php, encoding="utf-8", newline="\n")
    print("php nav functions added")
else:
    php_path.write_text(php, encoding="utf-8", newline="\n")
    print("php already had nav fn")
print("css patched", "width: 240px" in css)
