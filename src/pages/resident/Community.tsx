import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const Community = () => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Community</h1>
        <p className="text-gray-600">Connect with your neighbors</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle>Community Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Directory</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;