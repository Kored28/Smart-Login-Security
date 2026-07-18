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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#E5EEFF]">
          <Icon className="h-5 w-5 text-[#0058BE]" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-primary-foreground leading-6">{title}</h3>
          <p className="text-[13px] leading-4.5 text-secondary-foreground">{description}</p>
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
            <Card className="p-6 bg-white rounded-[12px] border border-bd-secondary shadow-sm">
                <SectionHeader
                icon={ShieldCheck}
                title="Brute Force Protection"
                description="Stop automated login attempts."
                action={
                    <Switch
                    checked={bruteForceEnabled}
                    onCheckedChange={setBruteForceEnabled}
                    className="data-[state=checked]:bg-accent"
                    />
                }
                />

                <div className="mt-5 flex flex-col space-y-2">
                    <label className="text-[12px] font-medium text-p-foreground leading-4 tracking-[0.6px]">
                        Login Attempt Limit
                    </label>
                    <div className="flex items-center gap-3">
                        <Input
                        type="number"
                        value={attemptLimit}
                        onChange={(e) => setAttemptLimit(e.target.value)}
                        className="max-w-[80%] bg-background rounded-[8px] px-2 py-4 border border-[#727785]"
                        />
                        <span className="text-[13px] leading-4.5 text-secondary-foreground">Attempts</span>
                    </div>
                    <p className="ext-[11px] leading-4.5 text-secondary-foreground">
                        Maximum number of failed tries before a temporary lockout
                        occurs.
                    </p>
                </div>
            </Card>

          {/* Login Limits */}
            <Card className="p-6 bg-white rounded-[12px] border border-bd-secondary shadow-sm">
                <SectionHeader
                icon={Timer}
                title="Login Limits"
                description="Set the duration of temporary bans."
                />

                <div className="mt-5 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[12px] font-medium text-p-foreground leading-4 tracking-[0.6px]">
                    Lockout Duration
                    </label>
                    <span className="text-[12px] font-bold text-accent leading-4 tracking-[0.6px]">
                    {lockoutDuration[0]} Minutes
                    </span>
                </div>
                <Slider
                    value={lockoutDuration}
                    onValueChange={setLockoutDuration}
                    min={5}
                    max={120}
                    step={5}
                    className="**:[[role=slider]]:bg-accent **:[[role=slider]]:border-accent bg-accent **:data-[slot=slider-range]:bg-accent"
                />
                <div className="flex justify-between text-[11px] font-medium text-[#727785]]">
                    <span>5m</span>
                    <span>120m</span>
                </div>
                </div>
            </Card>

          {/* Email Alerts */}
          <Card className="p-6 bg-white rounded-[12px] border border-bd-secondary shadow-sm">
            <SectionHeader
              icon={Mail}
              title="Email Alerts"
              description="Stay informed about suspicious activity."
            />

            <div className="mt-5 flex flex-col space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium text-primary-foreground leading-4 tracking-[0.6px]">
                    Notify on Block
                  </p>
                  <p className="text-[13px] leading-4.5 text-secondary-foreground">
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
                  <p className="text-[12px] font-medium text-primary-foreground leading-4 tracking-[0.6px]">
                    Notify on Failed Login
                  </p>
                  <p className="text-[13px] leading-4.5 text-secondary-foreground">
                    Alert me for every failed attempt.
                  </p>
                </div>
                <Switch
                  checked={notifyOnFailedLogin}
                  onCheckedChange={setNotifyOnFailedLogin}
                  className="data-[state=checked]:bg-accent"
                />
              </div>
            </div>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="p-6 bg-white rounded-[12px] border border-bd-secondary shadow-sm flex flex-col gap-3">
            <SectionHeader
              icon={Fingerprint}
              title="Two-Factor Authentication"
              description="Extra layer of protection for admin accounts."
            />

            <div className="mt-6 p-4 flex items-center justify-between rounded-[8px] bg-[#2170E41A]">
              <div>
                <p className="text-[12px] font-bold text-accent leading-4 tracking-[0.6px]">
                  Require 2FA for Admins
                </p>
                <p className="text-[13px] leading-4.5 text-[#586377]">
                  Force all administrators to use an authenticator app.
                </p>
              </div>
              <Switch
                checked={require2FA}
                onCheckedChange={setRequire2FA}
                className="data-[state=checked]:bg-accent"
              />
            </div>

            <p className="text-xs text-slate-400">
              Recommended for sites with multiple editors or administrators.
            </p>
          </Card>
        </div>

        {/* Session Management - full width */}
        <Card className="mt-6 p-6 bg-white rounded-[12px] border border-bd-secondary shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <SectionHeader
              icon={LogOut}
              title="Session Management"
              description="Automatically log users out after inactivity."
            />

            <div className="flex items-center gap-3">
              <label className="text-[12px] font-medium text-p-foreground leading-4 tracking-[0.6px] whitespace-nowrap">
                Idle Timeout
              </label>
              <Select value={idleTimeout} onValueChange={setIdleTimeout}>
                <SelectTrigger className="w-40 bg-background rounded-[12px] py-2 px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                    position="popper"
                    className="bg-primary rounded-[8px]"
                >
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
        <div className="mt-8 flex items-center justify-between border-t border-bd-secondary py-6">
          <p className="text-[13px] leading-4.5 text-secondary-foreground">Last saved: 12 minutes ago</p>
          <div className="flex gap-3">
            <Button variant="outline"
                className="px-6 py-2.5 rounded-[8px] border border-[#727785] text-primary-foreground text-base leading-6"
            >
                Discard Changes
            </Button>
            <Button 
                className="bg-accent hover:bg-blue-700 px-8 py-3.5 rounded-[8px] text-white text-[14px] font-bold leading-6"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;