import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-gray-600">Building Management System</p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline">Settings</Button>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;