import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/admin/Header";
import { useQuery } from "@tanstack/react-query";
import { getResidents } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ResidentForm from "@/components/admin/residents/ResidentForm";
import ResidentTable from "@/components/admin/residents/ResidentTable";

const Residents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { data: residents, isLoading, refetch } = useQuery({
    queryKey: ['residents'],
    queryFn: getResidents
  });

  const filteredResidents = residents?.filter(resident =>
    resident.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.unit_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h2 className="text-2xl font-light">Resident Management</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search residents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px] bg-background/50 border-primary/10"
                  />
                </div>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary/90 hover:bg-primary"
                >
                  Add Resident
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin/residents/directory')}
                  className="border-primary/10 hover:bg-primary/10"
                >
                  View Directory
                </Button>
              </div>
            </div>
            <ResidentTable 
              residents={residents || []}
              isLoading={isLoading}
              filteredResidents={filteredResidents}
            />
          </div>
        </div>
      </div>
      <ResidentForm 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Residents;