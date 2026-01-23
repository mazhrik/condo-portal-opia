import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ResidentLayout } from "@/components/resident/ResidentLayout";

const Messages = () => {
  return (
    <ResidentLayout>
      <div className="p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Messages</h1>
            <p className="text-gray-600">Communicate with management and neighbors</p>
          </header>

          <div className="space-y-6">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center space-x-4">
                <MessageSquare className="w-8 h-8 text-amber-500" />
                <CardTitle className="text-primary">Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full btn-gradient">Start New Conversation</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default Messages;