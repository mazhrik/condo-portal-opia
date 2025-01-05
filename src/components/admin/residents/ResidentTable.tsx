import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Resident {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  unit_number: string;
  phone_number: string;
  move_in_date: string;
}

interface ResidentTableProps {
  residents: Resident[];
  isLoading: boolean;
  filteredResidents?: Resident[];
}

const ResidentTable = ({ residents, isLoading, filteredResidents }: ResidentTableProps) => {
  return (
    <div className="rounded-lg border border-primary/10">
      <Table>
        <TableHeader>
          <TableRow className="border-primary/10">
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
          ) : (filteredResidents || residents)?.map((resident) => (
            <TableRow key={resident.id} className="border-primary/10">
              <TableCell>
                {resident.user.first_name} {resident.user.last_name}
              </TableCell>
              <TableCell>{resident.unit_number}</TableCell>
              <TableCell>{resident.phone_number}</TableCell>
              <TableCell>{new Date(resident.move_in_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" 
                    className="border-primary/10 hover:bg-primary/10">Edit</Button>
                  <Button variant="outline" size="sm"
                    className="border-primary/10 hover:bg-primary/10">View</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResidentTable;