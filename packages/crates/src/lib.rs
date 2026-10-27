//! Parked-car heat estimates for hot, sunny climates such as the UAE.
//!
//! The model is a simple exponential warm-up toward a maximum temperature rise. It is a planning
//! aid built from rule-of-thumb figures, not a measurement: real cars vary with colour, glass,
//! windscreen shades and wind. Never rely on it to decide whether it is safe to leave a child or
//! a pet in a car. It is never safe.

/// Parking and car conditions.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Conditions {
    /// Outside air temperature in degrees Celsius.
    pub ambient_c: f64,
    /// Minutes the car has been parked.
    pub minutes: f64,
    /// Parked in shade or under cover.
    pub shaded: bool,
    /// Window tint fitted.
    pub tinted: bool,
    /// Windows left slightly open.
    pub windows_cracked: bool,
    /// Dark exterior paint (affects panel temperature).
    pub dark_paint: bool,
}

impl Default for Conditions {
    fn default() -> Self {
        Conditions { ambient_c: 35.0, minutes: 0.0, shaded: false, tinted: false, windows_cracked: false, dark_paint: false }
    }
}

/// Estimated temperatures in degrees Celsius.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Estimate {
    pub cabin_c: f64,
    pub dashboard_c: f64,
    pub steering_wheel_c: f64,
    pub dark_leather_seat_c: f64,
    pub fabric_seat_c: f64,
    pub body_panel_c: f64,
}

/// How dangerous the cabin air is for people and pets.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Risk {
    Comfortable,
    Warm,
    Hot,
    Dangerous,
}

impl Risk {
    pub fn label(self) -> &'static str {
        match self {
            Risk::Comfortable => "comfortable",
            Risk::Warm => "warm",
            Risk::Hot => "hot",
            Risk::Dangerous => "dangerous",
        }
    }
}

/// Time constant of the warm-up in minutes.
const TAU_MINUTES: f64 = 35.0;
/// Maximum cabin rise above ambient in full sun with no mitigation.
const MAX_RISE_C: f64 = 32.0;
/// Skin burns quickly above this surface temperature.
pub const BURN_SURFACE_C: f64 = 60.0;
/// Panels cooler than this are suitable for washing without fast water spotting.
pub const PANEL_WASH_LIMIT_C: f64 = 40.0;

fn rise_factor(c: &Conditions) -> f64 {
    let mut f = 1.0;
    if c.shaded {
        f *= 0.35;
    }
    if c.tinted {
        f *= 0.85;
    }
    if c.windows_cracked {
        f *= 0.8;
    }
    f
}

fn warmup(minutes: f64) -> f64 {
    1.0 - (-minutes.max(0.0) / TAU_MINUTES).exp()
}

/// Estimate the temperatures after `minutes` parked.
pub fn estimate(c: &Conditions) -> Estimate {
    let w = warmup(c.minutes);
    let cabin = c.ambient_c + MAX_RISE_C * rise_factor(c) * w;
    let sun = if c.shaded { 0.15 } else { 1.0 };
    let paint_extra = if c.dark_paint { 28.0 } else { 18.0 };
    Estimate {
        cabin_c: round1(cabin),
        dashboard_c: round1(c.ambient_c + 38.0 * sun * w),
        steering_wheel_c: round1(c.ambient_c + 30.0 * sun * w),
        dark_leather_seat_c: round1(c.ambient_c + 28.0 * sun * w),
        fabric_seat_c: round1(c.ambient_c + 20.0 * sun * w),
        body_panel_c: round1(c.ambient_c + paint_extra * sun * warmup(c.minutes.min(20.0) * 1.75)),
    }
}

fn round1(v: f64) -> f64 {
    (v * 10.0).round() / 10.0
}

/// Classify cabin air temperature.
pub fn risk_for_cabin(cabin_c: f64) -> Risk {
    if cabin_c >= 50.0 {
        Risk::Dangerous
    } else if cabin_c >= 40.0 {
        Risk::Hot
    } else if cabin_c >= 32.0 {
        Risk::Warm
    } else {
        Risk::Comfortable
    }
}

/// Surfaces hot enough to burn skin on contact.
pub fn burn_hazards(e: &Estimate) -> Vec<&'static str> {
    let mut v = Vec::new();
    if e.dashboard_c >= BURN_SURFACE_C {
        v.push("dashboard");
    }
    if e.steering_wheel_c >= BURN_SURFACE_C {
        v.push("steering wheel");
    }
    if e.dark_leather_seat_c >= BURN_SURFACE_C {
        v.push("dark leather seat");
    }
    if e.fabric_seat_c >= BURN_SURFACE_C {
        v.push("fabric seat");
    }
    v
}

/// Minutes until the cabin reaches `target_c`, or `None` if it never does under these conditions.
pub fn minutes_until_cabin(c: &Conditions, target_c: f64) -> Option<f64> {
    let max_rise = MAX_RISE_C * rise_factor(c);
    let need = target_c - c.ambient_c;
    if need <= 0.0 {
        return Some(0.0);
    }
    if need >= max_rise {
        return None;
    }
    Some(round1(-TAU_MINUTES * (1.0 - need / max_rise).ln()))
}

/// Is the body panel cool enough to wash right now?
pub fn panel_cool_enough_to_wash(c: &Conditions) -> bool {
    estimate(c).body_panel_c < PANEL_WASH_LIMIT_C
}

/// A one-line care tip for the estimate.
pub fn advice(c: &Conditions) -> String {
    let e = estimate(c);
    let risk = risk_for_cabin(e.cabin_c);
    let mut parts: Vec<String> = Vec::new();
    match risk {
        Risk::Dangerous => parts.push("Cabin is in the danger range: never leave children or pets inside, even briefly.".into()),
        Risk::Hot => parts.push("Cabin is hot: ventilate with the doors open before getting in.".into()),
        Risk::Warm => parts.push("Cabin is warm: run the AC with the windows down for the first minute.".into()),
        Risk::Comfortable => parts.push("Cabin temperature is comfortable.".into()),
    }
    let hazards = burn_hazards(&e);
    if !hazards.is_empty() {
        parts.push(format!("Burn risk on contact: {}.", hazards.join(", ")));
    }
    if panel_cool_enough_to_wash(c) {
        parts.push("Body panels are cool enough to wash.".into());
    } else {
        parts.push("Body panels are too hot to wash: wait for shade, early morning or evening to avoid water spots.".into());
    }
    parts.join(" ")
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sun(ambient: f64, minutes: f64) -> Conditions {
        Conditions { ambient_c: ambient, minutes, ..Conditions::default() }
    }

    #[test]
    fn zero_minutes_is_ambient() {
        let e = estimate(&sun(40.0, 0.0));
        assert_eq!(e.cabin_c, 40.0);
        assert_eq!(e.dashboard_c, 40.0);
    }

    #[test]
    fn cabin_warms_monotonically_toward_the_limit() {
        let mut last = 0.0;
        for m in [0.0, 10.0, 30.0, 60.0, 180.0] {
            let t = estimate(&sun(40.0, m)).cabin_c;
            assert!(t >= last);
            last = t;
        }
        assert!(last < 40.0 + MAX_RISE_C + 0.1);
        assert!(last > 70.0);
    }

    #[test]
    fn shade_tint_and_ventilation_all_help() {
        let base = estimate(&sun(42.0, 45.0)).cabin_c;
        let shaded = estimate(&Conditions { shaded: true, ..sun(42.0, 45.0) }).cabin_c;
        let tinted = estimate(&Conditions { tinted: true, ..sun(42.0, 45.0) }).cabin_c;
        let cracked = estimate(&Conditions { windows_cracked: true, ..sun(42.0, 45.0) }).cabin_c;
        assert!(shaded < tinted && tinted < base);
        assert!(cracked < base);
    }

    #[test]
    fn risk_bands() {
        assert_eq!(risk_for_cabin(25.0), Risk::Comfortable);
        assert_eq!(risk_for_cabin(32.0), Risk::Warm);
        assert_eq!(risk_for_cabin(40.0), Risk::Hot);
        assert_eq!(risk_for_cabin(55.0), Risk::Dangerous);
        assert!(Risk::Dangerous > Risk::Hot);
        assert_eq!(Risk::Hot.label(), "hot");
    }

    #[test]
    fn hot_summer_afternoon_has_burn_hazards() {
        let e = estimate(&sun(46.0, 60.0));
        let h = burn_hazards(&e);
        assert!(h.contains(&"dashboard"));
        assert!(h.contains(&"steering wheel"));
        let cool = estimate(&Conditions { shaded: true, ..sun(30.0, 60.0) });
        assert!(burn_hazards(&cool).is_empty());
    }

    #[test]
    fn minutes_until_cabin_inverts_the_model() {
        let c = sun(40.0, 0.0);
        let m = minutes_until_cabin(&c, 50.0).unwrap();
        let t = estimate(&Conditions { minutes: m, ..c }).cabin_c;
        assert!((t - 50.0).abs() < 0.3, "{t}");
        assert_eq!(minutes_until_cabin(&c, 35.0), Some(0.0));
        assert_eq!(minutes_until_cabin(&Conditions { shaded: true, ..c }, 60.0), None);
    }

    #[test]
    fn panel_wash_guidance() {
        assert!(!panel_cool_enough_to_wash(&sun(44.0, 30.0)));
        assert!(panel_cool_enough_to_wash(&Conditions { shaded: true, ..sun(30.0, 30.0) }));
        assert!(panel_cool_enough_to_wash(&sun(25.0, 0.0)));
    }

    #[test]
    fn advice_mentions_the_danger() {
        let a = advice(&sun(46.0, 60.0));
        assert!(a.contains("never leave children or pets"));
        assert!(a.contains("too hot to wash"));
    }
}
