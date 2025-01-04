import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/admin/Header";
import { useQuery } from "@tanstack/react-query";
import { getResidents, createResident } from "@/utils/api";
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
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Residents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newResident, setNewResident] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    unitNumber: "",
    moveInDate: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: residents, isLoading, refetch } = useQuery({
    queryKey: ['residents'],
    queryFn: getResidents
  });

  const filteredResidents = residents?.filter(resident =>
    resident.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.unit_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createResident({
        user: {
          first_name: newResident.firstName,
          last_name: newResident.lastName,
          email: newResident.email,
        },
        phone_number: newResident.phoneNumber,
        unit_number: newResident.unitNumber,
        move_in_date: newResident.moveInDate
      });
      
      toast({
        title: "Success",
        description: "Resident added successfully",
      });
      
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resident",
        variant: "destructive",
      });
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
              <h2 className="text-2xl font-light">Resident Management</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search residents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Resident</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Resident</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new resident below.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddResident} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={newResident.firstName}
                            onChange={(e) => setNewResident({...newResident, firstName: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={newResident.lastName}
                            onChange={(e) => setNewResident({...newResident, lastName: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newResident.email}
                          onChange={(e) => setNewResident({...newResident, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={newResident.phoneNumber}
                          onChange={(e) => setNewResident({...newResident, phoneNumber: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unitNumber">Unit Number</Label>
                        <Input
                          id="unitNumber"
                          value={newResident.unitNumber}
                          onChange={(e) => setNewResident({...newResident, unitNumber: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moveInDate">Move-in Date</Label>
                        <Input
                          id="moveInDate"
                          type="date"
                          value={newResident.moveInDate}
                          onChange={(e) => setNewResident({...newResident, moveInDate: e.target.value})}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Resident</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={() => navigate('/admin/residents/directory')}>
                  View Directory
                </Button>
              </div>
            </div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Phone</TableHead>
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
                      <TableCell>{resident.phone_number}</TableCell>
                      <TableCell>{new Date(resident.move_in_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">View</Button>
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

export default Residents;