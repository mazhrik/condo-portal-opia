import Header from "@/components/admin/Header";

const Announcements = () => {
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
            <h2 className="text-2xl font-light mb-6">Announcements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-card/80 border border-primary/10">
                <h3 className="text-lg font-medium mb-4">Recent Announcements</h3>
                <div className="space-y-4">
                  {/* Placeholder for announcements list */}
                  <p className="text-muted-foreground">No announcements yet</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card/80 border border-primary/10">
                <h3 className="text-lg font-medium mb-4">Create Announcement</h3>
                <div className="space-y-4">
                  {/* Placeholder for announcement form */}
                  <p className="text-muted-foreground">Creation form coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;