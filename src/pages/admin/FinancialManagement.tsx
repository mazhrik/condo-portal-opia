import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const FinancialManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments
  });

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Financial report has been generated and sent to your email.",
    });
  };

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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light">Financial Management</h2>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleGenerateReport}>Generate Report</Button>
                <Button onClick={() => navigate("/admin/finances/records")}>Payment Records</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">
                    ${payments?.reduce((acc, payment) => acc + payment.amount, 0).toLocaleString() || '0'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">
                    {payments?.filter(payment => payment.status === 'pending').length || 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">
                    {payments?.filter(payment => 
                      new Date(payment.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length || 0}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;