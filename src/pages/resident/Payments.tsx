import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const Payments = () => {
  return (
    <ResidentLayout>
      <div className="p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Payments</h1>
            <p className="text-gray-600">Manage your payments and billing</p>
          </header>

          <div className="space-y-6">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center space-x-4">
                <CreditCard className="w-8 h-8 text-amber-500" />
                <CardTitle className="text-primary">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Next Payment Due</p>
                  <p className="text-2xl font-bold text-amber-500">$1,500</p>
                  <p className="text-sm text-gray-500">Due: May 1, 2024</p>
                  <Button className="w-full mt-4 btn-gradient">Make Payment</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default Payments;