import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { getDocuments } from "@/utils/api";
import { ResidentLayout } from "@/components/resident/ResidentLayout";

const Documents = () => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  });

  return (
    <ResidentLayout>
      <div className="p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Documents</h1>
            <p className="text-gray-600">Access important documents and forms</p>
          </header>

          <div className="space-y-6">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center space-x-4">
                <FileText className="w-8 h-8 text-amber-500" />
                <CardTitle className="text-primary">Available Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isLoading ? (
                  <p className="text-gray-600">Loading documents...</p>
                ) : documents?.length === 0 ? (
                  <p className="text-gray-600">No documents available.</p>
                ) : (
                  documents?.map((doc: any) => (
                    <Button
                      key={doc.id}
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-foreground hover:bg-white/20"
                      onClick={() => window.open(doc.file, '_blank')}
                    >
                      {doc.title}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResidentLayout>
  );
};

export default Documents;