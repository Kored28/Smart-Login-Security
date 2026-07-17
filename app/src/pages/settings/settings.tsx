"use client";

import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { Slider } from "../../components/ui/slider";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  ShieldCheck,
  Timer,
  Mail,
  Fingerprint,
  LogOut,
} from "lucide-react";
import Header from "../../components/header";

// ---- Reusable section header (icon + title + description) ----
function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

const Settings = () => {
  // Brute Force Protection
  const [bruteForceEnabled, setBruteForceEnabled] = useState(true);
  const [attemptLimit, setAttemptLimit] = useState("5");

  // Login Limits
  const [lockoutDuration, setLockoutDuration] = useState([30]);

  // Email Alerts
  const [notifyOnBlock, setNotifyOnBlock] = useState(true);
  const [notifyOnFailedLogin, setNotifyOnFailedLogin] = useState(false);

  // Two-Factor Authentication
  const [require2FA, setRequire2FA] = useState(false);

  // Session Management
  const [idleTimeout, setIdleTimeout] = useState("30");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col gap-8 mx-6 lg:mx-auto max-w-5xl py-8">
        {/* Header */}
        <Header
            heading="Security Configurations"
            text="Configure how Smart Login Security protects your WordPress site from unauthorized access."
        />

        {/* Top grid: 2 columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Brute Force Protection */}
          <Card className="p-6">
            <SectionHeader
              icon={ShieldCheck}
              title="Brute Force Protection"
              description="Stop automated login attempts."
              action={
                <Switch
                  checked={bruteForceEnabled}
                  onCheckedChange={setBruteForceEnabled}
                  className="data-[state=checked]:bg-blue-600"
                />
              }
            />

            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Login Attempt Limit
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={attemptLimit}
                  onChange={(e) => setAttemptLimit(e.target.value)}
                  className="max-w-[140px]"
                />
                <span className="text-sm text-slate-500">Attempts</span>
              </div>
              <p className="text-xs text-slate-400">
                Maximum number of failed tries before a temporary lockout
                occurs.
              </p>
            </div>
          </Card>

          {/* Login Limits */}
          <Card className="p-6">
            <SectionHeader
              icon={Timer}
              title="Login Limits"
              description="Set the duration of temporary bans."
            />

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Lockout Duration
                </label>
                <span className="text-sm font-semibold text-blue-600">
                  {lockoutDuration[0]} Minutes
                </span>
              </div>
              <Slider
                value={lockoutDuration}
                onValueChange={setLockoutDuration}
                min={5}
                max={120}
                step={5}
                className="[&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>5m</span>
                <span>120m</span>
              </div>
            </div>
          </Card>

          {/* Email Alerts */}
          <Card className="p-6">
            <SectionHeader
              icon={Mail}
              title="Email Alerts"
              description="Stay informed about suspicious activity."
            />

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Notify on Block
                  </p>
                  <p className="text-xs text-slate-400">
                    Send email when an IP is banned.
                  </p>
                </div>
                <Switch
                  checked={notifyOnBlock}
                  onCheckedChange={setNotifyOnBlock}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Notify on Failed Login
                  </p>
                  <p className="text-xs text-slate-400">
                    Alert me for every failed attempt.
                  </p>
                </div>
                <Switch
                  checked={notifyOnFailedLogin}
                  onCheckedChange={setNotifyOnFailedLogin}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="p-6">
            <SectionHeader
              icon={Fingerprint}
              title="Two-Factor Authentication"
              description="Extra layer of protection for admin accounts."
            />

            <div className="mt-5 flex items-center justify-between rounded-lg bg-blue-50/60 p-4">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Require 2FA for Admins
                </p>
                <p className="text-xs text-slate-500">
                  Force all administrators to use an authenticator app.
                </p>
              </div>
              <Switch
                checked={require2FA}
                onCheckedChange={setRequire2FA}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Recommended for sites with multiple editors or administrators.
            </p>
          </Card>
        </div>

        {/* Session Management - full width */}
        <Card className="mt-6 p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <SectionHeader
              icon={LogOut}
              title="Session Management"
              description="Automatically log users out after inactivity."
            />

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Idle Timeout
              </label>
              <Select value={idleTimeout} onValueChange={setIdleTimeout}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Minutes</SelectItem>
                  <SelectItem value="30">30 Minutes</SelectItem>
                  <SelectItem value="60">60 Minutes</SelectItem>
                  <SelectItem value="120">120 Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-400">Last saved: 12 minutes ago</p>
          <div className="flex gap-3">
            <Button variant="outline">Discard Changes</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;