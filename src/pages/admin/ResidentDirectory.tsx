import { useState } from "react";
import Header from "@/components/admin/Header";
import { useQuery } from "@tanstack/react-query";
import { getResidents } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResidentDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: residents, isLoading } = useQuery({
    queryKey: ['residents'],
    queryFn: getResidents
  });

  const filteredResidents = residents?.filter(resident =>
    resident.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.unit_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContact = (type: 'email' | 'phone', value: string) => {
    if (type === 'email') {
      window.location.href = `mailto:${value}`;
    } else {
      window.location.href = `tel:${value}`;
    }
    toast({
      title: "Contact Info",
      description: `${type === 'email' ? 'Email' : 'Phone'} contact initiated.`,
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
              <h2 className="text-2xl font-light">Resident Directory</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search directory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Move-in Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredResidents?.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell>
                        {resident.user.first_name} {resident.user.last_name}
                      </TableCell>
                      <TableCell>{resident.unit_number}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleContact('email', resident.user.email)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleContact('phone', resident.phone_number)}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(resident.move_in_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDirectory;