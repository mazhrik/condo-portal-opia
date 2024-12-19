import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex justify-between items-center backdrop-blur-md bg-card/30 p-6 rounded-lg border border-primary/10">
      <div className="flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
          alt="Logo"
          className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
        />
        <div>
          <h1 className="text-3xl font-light bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Building Management System</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" className="border-primary/20 hover:border-primary/40">
          Settings
        </Button>
        <Button 
          variant="outline" 
          className="border-primary/20 hover:border-primary/40"
          onClick={() => window.location.href = "/"}
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;