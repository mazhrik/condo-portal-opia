import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocuments, uploadDocument } from "@/utils/api";
import { FileText, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Documents = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      uploadMutation.mutate(formData);
    }
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
              <h2 className="text-2xl font-light">Documents</h2>
              <Button className="flex items-center gap-2" onClick={() => document.getElementById('fileInput')?.click()}>
                <Upload className="w-4 h-4" />
                Upload Document
                <Input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                />
              </Button>
            </div>
            <div className="grid md:grid-cols-1 gap-6">
              <div className="p-4 rounded-lg bg-card/80 border border-primary/10">
                <h3 className="text-lg font-medium mb-4">Document Library</h3>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading documents...</p>
                ) : documents?.length === 0 ? (
                  <p className="text-muted-foreground">No documents uploaded yet</p>
                ) : (
                  <div className="space-y-4">
                    {documents?.map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span>{doc.title}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => window.open(doc.file, '_blank')}>
                            View
                          </Button>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;