import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createResident } from "@/utils/api";

interface ResidentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ResidentForm = ({ isOpen, onClose, onSuccess }: ResidentFormProps) => {
  const [newResident, setNewResident] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    unitNumber: "",
    moveInDate: ""
  });
  const { toast } = useToast();

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
      
      onClose();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resident",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/80 backdrop-blur-md border-primary/10">
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
                className="bg-background/50 border-primary/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={newResident.lastName}
                onChange={(e) => setNewResident({...newResident, lastName: e.target.value})}
                required
                className="bg-background/50 border-primary/10"
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
              className="bg-background/50 border-primary/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={newResident.phoneNumber}
              onChange={(e) => setNewResident({...newResident, phoneNumber: e.target.value})}
              required
              className="bg-background/50 border-primary/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unitNumber">Unit Number</Label>
            <Input
              id="unitNumber"
              value={newResident.unitNumber}
              onChange={(e) => setNewResident({...newResident, unitNumber: e.target.value})}
              required
              className="bg-background/50 border-primary/10"
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
              className="bg-background/50 border-primary/10"
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} 
              className="border-primary/10 hover:bg-primary/10">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary/90 hover:bg-primary">Add Resident</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResidentForm;