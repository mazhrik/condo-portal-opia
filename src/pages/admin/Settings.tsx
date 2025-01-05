import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Users, Bell, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"
          alt="Modern interior"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <Header />
        <div className="grid gap-6">
          <div className="p-6 rounded-lg glass">
            <h2 className="text-2xl font-light mb-6">Settings</h2>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-card/80 border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-medium">System Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about maintenance requests
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Send daily summary reports via email
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>System Email</Label>
                    <Input placeholder="system@example.com" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card/80 border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-medium">Security Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out inactive users
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card/80 border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable push notifications for important updates
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for system alerts
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;