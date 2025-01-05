import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Messages = () => {
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
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400">Communicate with management and neighbors</p>
        </header>

        <div className="space-y-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center space-x-4">
              <MessageSquare className="w-8 h-8 text-amber-500" />
              <CardTitle className="text-white">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-gradient">Start New Conversation</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;