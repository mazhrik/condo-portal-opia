import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const Payments = () => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Payments</h1>
        <p className="text-gray-600">Manage your payments and billing</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <CreditCard className="w-8 h-8 text-primary" />
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Next Payment Due</p>
              <p className="text-2xl font-bold text-primary">$1,500</p>
              <p className="text-sm text-gray-600">Due: May 1, 2024</p>
              <Button className="w-full mt-4">Make Payment</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;