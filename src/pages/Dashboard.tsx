import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-white/70">
        Your condo portal is ready. This is the Phase 0 landing area where upcoming
        modules will appear.
      </p>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-white/10 bg-slate-900/60 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Account status</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/70">
          Connected to the condo portal. You can now navigate once Phase 1 modules are
          enabled.
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-slate-900/60 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Next steps</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/70">
          Use the navigation placeholder above to preview where dashboard links will live.
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Dashboard;
