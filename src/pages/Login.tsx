import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/utils/api";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

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

  const handleGoogleLogin = async () => {
    try {
      // This would be replaced with actual Google OAuth implementation
      toast.info("Google Sign In will be implemented with backend integration");
    } catch (error) {
      toast.error("Google Sign In failed");
    }
  };

  const handleForgotPassword = () => {
    // This would be connected to password reset flow
    toast.info("Password reset link will be sent to your email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] relative overflow-hidden">
      {/* Background overlay with modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#243949] to-[#517fa4] opacity-50"></div>

      {/* Animated shapes */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Login Card */}
      <Card className="w-[420px] z-10 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Sign In
          </CardTitle>
          <p className="text-center text-gray-300">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/20 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              Sign In
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-500/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1A1F2C] px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline" 
              onClick={handleGoogleLogin}
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;