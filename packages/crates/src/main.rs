use std::process::ExitCode;
use turbo_luxury_cabin_heat::{advice, estimate, minutes_until_cabin, risk_for_cabin, Conditions};

const HELP: &str = "turbo-luxury-cabin-heat: estimate how hot a parked car gets

Usage: turbo-luxury-cabin-heat --ambient <C> --minutes <N> [--shade] [--tint] [--cracked] [--dark-paint] [--until <C>]

  --ambient C    outside temperature in degrees Celsius (default 35)
  --minutes N    minutes parked (default 30)
  --shade        parked in shade or under cover
  --tint         window tint fitted
  --cracked      windows left slightly open
  --dark-paint   dark exterior paint
  --until C      also print minutes until the cabin reaches C
";

pub fn run(args: &[String]) -> Result<String, String> {
    let mut c = Conditions { ambient_c: 35.0, minutes: 30.0, ..Conditions::default() };
    let mut until: Option<f64> = None;
    let mut i = 0;
    let num = |args: &[String], i: usize, name: &str| -> Result<f64, String> {
        args.get(i + 1)
            .ok_or_else(|| format!("missing value for {name}"))?
            .parse::<f64>()
            .map_err(|_| format!("{name} needs a number"))
    };
    while i < args.len() {
        match args[i].as_str() {
            "-h" | "--help" => return Ok(HELP.to_string()),
            "--ambient" => { c.ambient_c = num(args, i, "--ambient")?; i += 1; }
            "--minutes" => {
                c.minutes = num(args, i, "--minutes")?;
                if c.minutes < 0.0 { return Err("--minutes must not be negative".into()); }
                i += 1;
            }
            "--until" => { until = Some(num(args, i, "--until")?); i += 1; }
            "--shade" => c.shaded = true,
            "--tint" => c.tinted = true,
            "--cracked" => c.windows_cracked = true,
            "--dark-paint" => c.dark_paint = true,
            other => return Err(format!("unknown option {other}")),
        }
        i += 1;
    }
    if !(-20.0..=65.0).contains(&c.ambient_c) {
        return Err("--ambient must be between -20 and 65".into());
    }
    let e = estimate(&c);
    let mut out = String::new();
    out.push_str(&format!("Ambient {:.1} C, parked {:.0} min\n", c.ambient_c, c.minutes));
    out.push_str(&format!("Cabin air:          {:.1} C ({})\n", e.cabin_c, risk_for_cabin(e.cabin_c).label()));
    out.push_str(&format!("Dashboard:          {:.1} C\n", e.dashboard_c));
    out.push_str(&format!("Steering wheel:     {:.1} C\n", e.steering_wheel_c));
    out.push_str(&format!("Dark leather seat:  {:.1} C\n", e.dark_leather_seat_c));
    out.push_str(&format!("Fabric seat:        {:.1} C\n", e.fabric_seat_c));
    out.push_str(&format!("Body panel:         {:.1} C\n", e.body_panel_c));
    if let Some(t) = until {
        match minutes_until_cabin(&c, t) {
            Some(m) => out.push_str(&format!("Cabin reaches {t:.0} C after about {m:.0} min\n")),
            None => out.push_str(&format!("Cabin never reaches {t:.0} C under these conditions\n")),
        }
    }
    out.push_str(&advice(&c));
    out.push('\n');
    Ok(out)
}

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    match run(&args) {
        Ok(s) => { print!("{s}"); ExitCode::SUCCESS }
        Err(e) => { eprintln!("error: {e}"); ExitCode::from(2) }
    }
}

#[cfg(test)]
mod tests {
    use super::run;

    fn a(v: &[&str]) -> Vec<String> { v.iter().map(|s| s.to_string()).collect() }

    #[test]
    fn prints_estimate() {
        let out = run(&a(&["--ambient", "45", "--minutes", "60", "--until", "50"])).unwrap();
        assert!(out.contains("Cabin air:"));
        assert!(out.contains("(dangerous)"));
        assert!(out.contains("Cabin reaches 50 C"));
    }

    #[test]
    fn rejects_bad_input() {
        assert!(run(&a(&["--ambient", "hot"])).is_err());
        assert!(run(&a(&["--ambient", "99"])).is_err());
        assert!(run(&a(&["--minutes", "-5"])).is_err());
        assert!(run(&a(&["--bogus"])).is_err());
        assert!(run(&a(&["--minutes"])).is_err());
    }

    #[test]
    fn help() {
        assert!(run(&a(&["--help"])).unwrap().starts_with("turbo-luxury-cabin-heat"));
    }
}
