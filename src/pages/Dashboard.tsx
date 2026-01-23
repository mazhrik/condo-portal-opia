import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMe } from "@/hooks/useMe";

const Dashboard = () => {
  const { data: me } = useMe();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back{me?.first_name ? `, ${me.first_name}` : ""}
        </h1>
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
            {me ? (
              <>
                Signed in as {me.email}. Role:{" "}
                <span className="font-semibold text-white">{me.role}</span>.
              </>
            ) : (
              "Connected to the condo portal. Loading profile..."
            )}
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
};

export default Dashboard;
