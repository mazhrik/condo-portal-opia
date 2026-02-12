import { useState, useEffect } from "react";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPaymentIntent, getPayments } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { formatToUserTimezone } from "@/utils/date";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_... ");

const CheckoutForm = ({ onPaymentSuccess }: { onPaymentSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("250.00");
  const [isProcessing, setIsProcessing] = useState(false);

  const payMutation = useMutation({
    mutationFn: createPaymentIntent,
    onError: (error: any) => {
      setIsProcessing(false);
      toast({
        title: "Payment Initialization Failed",
        description: error.response?.data?.detail || "Could not start payment.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    payMutation.mutate({ amount: parseFloat(amount) }, {
      onSuccess: async (data: any) => {
        const { clientSecret } = data;

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          }
        });

        if (result.error) {
          setIsProcessing(false);
          toast({
            title: "Payment Failed",
            description: result.error.message,
            variant: "destructive"
          });
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            setIsProcessing(false);
            toast({
              title: "Payment Successful",
              description: `Successfully paid $${amount}`,
            });
            onPaymentSuccess();
          }
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Payment Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="p-4 border rounded-md">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      <Button type="submit" className="w-full" disabled={!stripe || isProcessing}>
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
        Pay ${amount}
      </Button>
    </form>
  );
};

const Payments = () => {
  const { data: payments, isLoading, refetch } = useQuery({ queryKey: ["payments"], queryFn: getPayments });

  return (
    <ResidentLayout>
      <div className="p-8 relative">
        <header className="mb-8">
          <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
            <CreditCard className="h-8 w-8" />
            Payments & Billing
          </h1>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Securely pay your HOA fees or other charges.</CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <CheckoutForm onPaymentSuccess={refetch} />
              </Elements>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-sm text-muted-foreground text-center py-8">Loading payments...</div>
              ) : (payments && payments.length > 0) ? (
                <ul className="space-y-4">
                  {payments.map((payment: any) => (
                    <li key={payment.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">${payment.amount}</p>
                        <p className="text-sm text-muted-foreground">{formatToUserTimezone(payment.date)}</p>
                      </div>
                      <span className="text-sm text-green-500 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> {payment.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No recent payments found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default Payments;
