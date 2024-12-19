import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/utils/api";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.access);
      
      if (email.endsWith("@admin.com")) {
        navigate("/admin");
      } else {
        navigate("/resident");
      }
      
      toast.success("Successfully logged in!");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6e9f0] to-[#eef1f5] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent backdrop-blur-sm"></div>
      </div>

      {/* Floating shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Login card */}
      <Card className="w-[400px] z-10 bg-white/80 backdrop-blur-lg border-white/20 shadow-xl animate-fade-in">
        <CardHeader className="space-y-4">
          <div className="w-20 h-20 mx-auto mb-4">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"
              alt="CondoConnect Logo"
              className="w-full h-full object-cover rounded-2xl shadow-lg animate-float"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CondoConnect
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Welcome back! Please login to your account.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 border-white/30 focus:border-primary/50 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/50 border-white/30 focus:border-primary/50 transition-all duration-300"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;