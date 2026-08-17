# Smart Login Security

A WordPress plugin that protects your site from brute force login attacks and gives you full visibility into login activity, all through a clean, modern admin dashboard built with React.

![WordPress](https://img.shields.io/badge/WordPress-Plugin-blue)
![PHP](https://img.shields.io/badge/PHP-8%2B-777BB4)
![React](https://img.shields.io/badge/React-19-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Why Smart Login Security?

WordPress's default login system has no protection against automated attacks. Bots can attempt thousands of username and password combinations with nothing standing in their way. Smart Login Security closes that gap by watching every login attempt in real time, automatically blocking IPs that show brute force behavior, and giving admins a live dashboard to see exactly what's happening on their site.

## Features

🛡️ **Automatic Brute Force Protection**
Detects repeated failed login attempts from the same IP within a short window and blocks it automatically. No manual intervention needed.

📊 **Live Login Activity Dashboard**
See every login attempt, successful, failed, or blocked, with IP address, username, device, and timestamp, in a searchable, filterable table.

📋 **Security Event Log**
A separate, higher level audit trail of meaningful security events (blocks, warnings, manual admin actions), not just raw login noise.

🚫 **Manual IP Blocking**
Spot a suspicious IP in your logs? Block it yourself, permanently, with one click, independent of the automatic threshold system.

⚙️ **Fully Configurable**
Tune the failed attempt threshold, lockout duration, and more from a settings panel. All changes take effect immediately, no code required.

⏱️ **Session Idle Timeout**
Optionally log admin users out automatically after a period of inactivity, adding another layer of protection for shared or unattended devices.

🔌 **REST API Powered**
The entire dashboard runs on a documented REST API under `smart-login-security/v1`, so the data is yours to extend or integrate elsewhere if you want.

## Screenshots

*(Add screenshots of the Dashboard, Login Activity, Security Logs, and Settings pages here)*

## How It Works

1. **Every login attempt is tracked.** Success or failure, each attempt is logged with the IP, username, and device info.
2. **Failed attempts are watched in real time.** If an IP racks up too many failures too quickly, the plugin first logs a warning, then, if it keeps going, blocks the IP outright.
3. **Blocked IPs are rejected before WordPress even checks the password.** The block happens early in the login pipeline, so there's no wasted processing on attempts that are already known to be malicious.
4. **Everything is visible.** The dashboard shows you exactly what happened, when, and why. No digging through server logs required.

## Installation

1. Download or clone this repository into your `wp-content/plugins/` directory:
   ```bash
   cd wp-content/plugins
   git clone https://github.com/your-username/smart-login-security.git
   ```
2. Activate **Smart Login Security** from the WordPress admin **Plugins** page.
3. Head to the new **Smart Security** menu item in your WordPress sidebar.
4. Visit **Settings** to configure your preferred failed attempt threshold and lockout duration, or just use the sensible defaults out of the box.

## Requirements

- WordPress with the REST API enabled (default on any modern install)
- PHP 8.0 or higher

## Building From Source

The admin dashboard is a React and TypeScript app built with Vite. If you're contributing or want to build it yourself:

```bash
cd app
npm install
npm run build
```

This outputs the compiled dashboard into `app/dist/`, which the plugin serves automatically.

For live development with auto rebuild on save:

```bash
npm run dev
```

## Tech Stack

- **Backend:** PHP, WordPress REST API, custom database tables via `dbDelta()`
- **Frontend:** React 19, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Build tooling:** Vite

## Roadmap

- [ ] Email notifications on IP blocks and failed logins
- [ ] Two factor authentication enforcement for admin accounts
- [ ] CSV export for login logs
- [ ] Countdown warning before session idle timeout logout

## Contributing

Issues and pull requests are welcome. If you're planning a larger change, please open an issue first to discuss what you'd like to do.

## License

MIT