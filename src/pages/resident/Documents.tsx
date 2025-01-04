import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Documents = () => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Documents</h1>
        <p className="text-gray-600">Access important documents and forms</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <FileText className="w-8 h-8 text-primary" />
            <CardTitle>Available Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full">Building Rules</Button>
            <Button variant="outline" className="w-full">Lease Agreement</Button>
            <Button variant="outline" className="w-full">Community Guidelines</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;