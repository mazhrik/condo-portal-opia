import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, signInWithGoogle, resetPassword } from "@/utils/supabase";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user } = await signInWithEmail(email, password);
      if (user?.email?.endsWith("@admin.com")) {
        navigate("/admin");
      } else {
        navigate("/resident");
      }
      toast.success("Successfully logged in!");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success("Redirecting to Google...");
    } catch (error: any) {
      toast.error("Failed to initialize Google Sign In");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    try {
      await resetPassword(email);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2942] relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/66879088-b665-4d16-8b71-dd39e82fd024.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <Card className="w-[420px] z-10 bg-[#1e2a47]/90 backdrop-blur-sm border-white/10 shadow-2xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#2a3854] border-0 text-white placeholder:text-gray-400 h-12"
              />
            </div>
            <div className="space-y-2 relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#2a3854] border-0 text-white placeholder:text-gray-400 h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2 text-sm text-gray-400">
                <input type="checkbox" className="rounded border-gray-400" />
                <span>Remember Me</span>
              </label>
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
              className="w-full bg-[#4169e1] hover:bg-[#3154b7] text-white h-12"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-500/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1e2a47] px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="bg-[#2a3854] border-0 hover:bg-[#344567] text-white w-12 h-12 p-0"
              >
                <FcGoogle className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-[#2a3854] border-0 hover:bg-[#344567] text-white w-12 h-12 p-0"
              >
                <FaFacebook className="h-5 w-5 text-blue-500" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-[#2a3854] border-0 hover:bg-[#344567] text-white w-12 h-12 p-0"
              >
                <FaApple className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;