
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Box, Loader2 } from "lucide-react";
import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { useQuery } from "@tanstack/react-query";
import { getPackages } from "@/utils/api";

const MyPackages = () => {
    const { data: apiPackages, isLoading } = useQuery({
        queryKey: ['packages'],
        queryFn: getPackages
    });

    const packages = apiPackages?.map((pkg: any) => ({
        id: pkg.id,
        courier: pkg.courier,
        tracking: pkg.tracking_number,
        arrivalDate: pkg.arrival_date,
        status: pkg.status
    })) || [];

    return (
        <ResidentLayout>
            <div className="p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                        <Box className="h-8 w-8" />
                        My Packages
                    </h1>
                </header>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Courier</TableHead>
                                <TableHead>Tracking #</TableHead>
                                <TableHead>Arrival Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Loading...
                                    </TableCell>
                                </TableRow>
                            ) : packages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No packages found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                packages.map((pkg: any) => (
                                    <TableRow key={pkg.id}>
                                        <TableCell className="font-medium">{pkg.courier}</TableCell>
                                        <TableCell>{pkg.tracking}</TableCell>
                                        <TableCell>{new Date(pkg.arrivalDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${pkg.status === 'received' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {pkg.status === 'received' ? 'Ready to Pickup' : 'Picked Up'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </ResidentLayout>
    );
};

export default MyPackages;
