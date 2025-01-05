import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/utils/api";
import { Search } from "lucide-react";

const FileManager = () => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments
  });

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
          <div className="p-6 rounded-lg glass border border-primary/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light">File Manager</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    className="pl-10 w-[300px] bg-background/50 border-primary/10"
                  />
                </div>
                <Button className="bg-primary/90 hover:bg-primary transition-colors duration-300">
                  Upload File
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-card/30 backdrop-blur-md border border-primary/10">
                <h3 className="text-lg font-medium mb-4">Recent Files</h3>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading files...</p>
                ) : documents?.length === 0 ? (
                  <p className="text-muted-foreground">No files uploaded yet</p>
                ) : (
                  <div className="space-y-4">
                    {documents?.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-primary/10">
                        <span>{doc.name}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-primary/10 hover:bg-primary/10"
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 rounded-lg bg-card/30 backdrop-blur-md border border-primary/10">
                <h3 className="text-lg font-medium mb-4">Storage Usage</h3>
                <div className="space-y-4">
                  <div className="h-2 bg-primary/20 rounded-full">
                    <div className="h-full w-1/3 bg-primary rounded-full" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    33% of storage used
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;