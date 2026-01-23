
import { useState } from "react";
import Header from "@/components/admin/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPackages, updatePackageStatus } from "@/utils/api";
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
import { Search, Box, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PackageLog = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: apiPackages, isLoading } = useQuery({
        queryKey: ['packages'],
        queryFn: getPackages
    });

    const packages = apiPackages?.map((pkg: any) => ({
        id: pkg.id,
        recipient: pkg.recipient_name,
        unit: pkg.unit_number,
        courier: pkg.courier,
        tracking: pkg.tracking_number,
        arrivalDate: pkg.arrival_date,
        status: pkg.status
    })) || [];

    const filteredPackages = packages.filter((pkg: any) =>
        pkg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.tracking?.includes(searchTerm)
    );

    const mutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => updatePackageStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            toast({
                title: "Status Updated",
                description: "Package marked as picked up.",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to update package status.",
                variant: "destructive"
            });
        }
    });

    const handleMarkPickedUp = (id: number) => {
        mutation.mutate({ id, status: 'picked_up' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
            <div className="fixed inset-0 -z-10">
                <img
                    src="https://images.unsplash.com/photo-1580674285054-bed31e145f59"
                    alt="Packages"
                    className="w-full h-full object-cover opacity-[0.03]"
                />
            </div>
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
            <div className="relative max-w-7xl mx-auto space-y-8">
                <Header />
                <div className="grid gap-6">
                    <div className="p-6 rounded-lg glass">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-light flex items-center gap-2">
                                <Box className="h-6 w-6" />
                                Package Log
                            </h2>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search packages..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-[300px]"
                                    />
                                </div>
                                <Button>Log New Package</Button>
                            </div>
                        </div>
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Courier</TableHead>
                                        <TableHead>Tracking #</TableHead>
                                        <TableHead>Arrival Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Loading...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredPackages.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24">
                                                No packages found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPackages.map((pkg: any) => (
                                            <TableRow key={pkg.id}>
                                                <TableCell>{pkg.recipient}</TableCell>
                                                <TableCell>{pkg.unit}</TableCell>
                                                <TableCell>{pkg.courier}</TableCell>
                                                <TableCell>{pkg.tracking}</TableCell>
                                                <TableCell>{new Date(pkg.arrivalDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${pkg.status === 'received' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {pkg.status === 'received' ? 'Ready for Pickup' : 'Picked Up'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {pkg.status === 'received' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleMarkPickedUp(pkg.id)}
                                                            className="flex items-center gap-1"
                                                            disabled={mutation.isPending}
                                                        >
                                                            <Check className="h-3 w-3" /> Mark Picked Up
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageLog;
