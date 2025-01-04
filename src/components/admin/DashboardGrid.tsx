import { 
  Users, Bell, Wrench, Calendar, CreditCard, Car, FileText, 
  MessageSquare, Settings
} from "lucide-react";
import DashboardCard from "./DashboardCard";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResidents, getMaintenanceRequests, getAmenityBookings, getPayments, getParkingSpots } from "@/utils/api";

const DashboardGrid = () => {
  const navigate = useNavigate();

  // Fetch data for stats
  const { data: residents } = useQuery({
    queryKey: ['residents'],
    queryFn: getResidents
  });

  const { data: maintenanceRequests } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: getMaintenanceRequests
  });

  const { data: amenityBookings } = useQuery({
    queryKey: ['amenity-bookings'],
    queryFn: getAmenityBookings
  });

  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments
  });

  const { data: parkingSpots } = useQuery({
    queryKey: ['parking-spots'],
    queryFn: getParkingSpots
  });

  const cards = [
    {
      icon: Users,
      title: "Resident Management",
      stats: { value: residents?.length || 0, label: "Total Residents" },
      actions: { 
        primary: { label: "Manage Residents", route: "/admin/residents" },
        secondary: { label: "View Directory", route: "/admin/residents/directory" }
      }
    },
    {
      icon: Bell,
      title: "Announcements",
      stats: { value: 5, label: "Active Notices" },
      actions: { 
        primary: { label: "Post Updates", route: "/admin/announcements" },
        secondary: { label: "Message History", route: "/admin/communication" }
      }
    },
    {
      icon: Wrench,
      title: "Maintenance",
      stats: { value: maintenanceRequests?.length || 0, label: "Pending Requests" },
      actions: { 
        primary: { label: "View Requests", route: "/admin/maintenance" },
        secondary: { label: "Schedule Maintenance", route: "/admin/maintenance/schedule" }
      }
    },
    {
      icon: Calendar,
      title: "Amenity Bookings",
      stats: { value: amenityBookings?.length || 0, label: "Today's Bookings" },
      actions: { 
        primary: { label: "Manage Bookings", route: "/admin/amenities" },
        secondary: { label: "Facility Status", route: "/admin/amenities/status" }
      }
    },
    {
      icon: CreditCard,
      title: "Financial Management",
      stats: { 
        value: `$${payments?.reduce((acc, payment) => acc + payment.amount, 0) || 0}`, 
        label: "Monthly Collections" 
      },
      actions: { 
        primary: { label: "View Finances", route: "/admin/finances" },
        secondary: { label: "Payment Records", route: "/admin/finances/records" }
      }
    },
    {
      icon: Car,
      title: "Parking Management",
      stats: { 
        value: `${parkingSpots?.filter(spot => spot.is_occupied).length || 0}/${parkingSpots?.length || 0}`, 
        label: "Occupied Spots" 
      },
      actions: { 
        primary: { label: "Manage Parking", route: "/admin/parking" },
        secondary: { label: "Vehicle Registry", route: "/admin/parking/registry" }
      }
    },
    {
      icon: FileText,
      title: "Documents",
      actions: { 
        primary: { label: "View Documents", route: "/admin/documents" },
        secondary: { label: "File Manager", route: "/admin/documents" }
      }
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      stats: { value: 15, label: "Unread Messages" },
      actions: { 
        primary: { label: "Messages", route: "/admin/communication" },
        secondary: { label: "Broadcast", route: "/admin/announcements" }
      }
    },
    {
      icon: Settings,
      title: "Settings",
      actions: { 
        primary: { label: "System Settings", route: "/admin/settings" },
        secondary: { label: "User Permissions", route: "/admin/settings" }
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <DashboardCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DashboardGrid;