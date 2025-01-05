import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const Payments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
      <div className="fixed inset-0 -z-10">
        <img
          src="/lovable-uploads/5f307eb2-750f-41ff-aeb3-659ec419eb29.png"
          alt="Modern interior"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Payments</h1>
          <p className="text-gray-400">Manage your payments and billing</p>
        </header>

        <div className="space-y-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center space-x-4">
              <CreditCard className="w-8 h-8 text-amber-500" />
              <CardTitle className="text-white">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-300">Next Payment Due</p>
                <p className="text-2xl font-bold text-amber-500">$1,500</p>
                <p className="text-sm text-gray-400">Due: May 1, 2024</p>
                <Button className="w-full mt-4 btn-gradient">Make Payment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payments;