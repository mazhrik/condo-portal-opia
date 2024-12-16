import { 
  Users, Building, Bell, BarChart, Calendar, CreditCard, Settings, FileText, 
  MessageSquare, Shield, Car, Wrench, ClipboardList, UserCog, Receipt, Briefcase,
  AlertTriangle, Key, Package, Thermometer, Droplets, Plug, Camera, HeartPulse
} from "lucide-react";
import DashboardCard from "./DashboardCard";

const DashboardGrid = () => {
  const cards = [
    {
      icon: Users,
      title: "Resident Management",
      stats: { value: 150, label: "Total Residents" },
      actions: { primary: "Manage Residents", secondary: "View Directory" }
    },
    {
      icon: CreditCard,
      title: "Financial Management",
      stats: { value: "$45,000", label: "Monthly Collections" },
      actions: { primary: "View Finances", secondary: "Payment Records" }
    },
    {
      icon: Wrench,
      title: "Maintenance",
      stats: { value: 12, label: "Pending Requests" },
      actions: { primary: "View Requests", secondary: "Schedule Maintenance" }
    },
    {
      icon: Building,
      title: "Property Overview",
      stats: { value: "200", label: "Total Units" },
      actions: { primary: "Unit Status", secondary: "Building Reports" }
    },
    {
      icon: UserCog,
      title: "Staff Management",
      stats: { value: 25, label: "Active Staff" },
      actions: { primary: "Manage Staff", secondary: "Schedules" }
    },
    {
      icon: Receipt,
      title: "Utilities & Bills",
      stats: { value: "$28,500", label: "Monthly Utilities" },
      actions: { primary: "View Bills", secondary: "Usage Reports" }
    },
    {
      icon: Calendar,
      title: "Amenity Bookings",
      stats: { value: 8, label: "Today's Bookings" },
      actions: { primary: "Manage Bookings", secondary: "Facility Status" }
    },
    {
      icon: AlertTriangle,
      title: "Emergency Management",
      stats: { value: 2, label: "Active Alerts" },
      actions: { primary: "View Alerts", secondary: "Emergency Contacts" }
    },
    {
      icon: Briefcase,
      title: "Vendor Management",
      stats: { value: 15, label: "Active Contracts" },
      actions: { primary: "Manage Vendors", secondary: "Contracts" }
    },
    {
      icon: Car,
      title: "Parking Management",
      stats: { value: "180/200", label: "Occupied Spots" },
      actions: { primary: "Manage Parking", secondary: "Vehicle Registry" }
    },
    {
      icon: Key,
      title: "Access Control",
      stats: { value: 450, label: "Active Keys/Fobs" },
      actions: { primary: "Access Logs", secondary: "Issue Keys" }
    },
    {
      icon: Package,
      title: "Package Management",
      stats: { value: 23, label: "Pending Deliveries" },
      actions: { primary: "Package Log", secondary: "Notifications" }
    },
    {
      icon: Shield,
      title: "Security",
      stats: { value: 4, label: "Active Guards" },
      actions: { primary: "Security Logs", secondary: "Incident Reports" }
    },
    {
      icon: Thermometer,
      title: "Climate Control",
      stats: { value: "72°F", label: "Avg Temperature" },
      actions: { primary: "HVAC Status", secondary: "Energy Settings" }
    },
    {
      icon: Droplets,
      title: "Water Management",
      stats: { value: "12,000", label: "Gallons Today" },
      actions: { primary: "Usage Metrics", secondary: "Quality Reports" }
    },
    {
      icon: Plug,
      title: "Energy Management",
      stats: { value: "45,000", label: "kWh This Month" },
      actions: { primary: "Energy Usage", secondary: "Conservation" }
    },
    {
      icon: Camera,
      title: "Surveillance",
      stats: { value: 32, label: "Active Cameras" },
      actions: { primary: "View Cameras", secondary: "Footage Archive" }
    },
    {
      icon: HeartPulse,
      title: "Insurance & Safety",
      stats: { value: 100, label: "Safety Score" },
      actions: { primary: "View Policies", secondary: "Safety Reports" }
    },
    {
      icon: Bell,
      title: "Announcements",
      stats: { value: 5, label: "Active Notices" },
      actions: { primary: "Post Updates", secondary: "Message History" }
    },
    {
      icon: FileText,
      title: "Documents",
      actions: { primary: "View Documents", secondary: "File Manager" }
    },
    {
      icon: BarChart,
      title: "Analytics",
      actions: { primary: "View Reports", secondary: "Export Data" }
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      stats: { value: 15, label: "Unread Messages" },
      actions: { primary: "Messages", secondary: "Broadcast" }
    },
    {
      icon: Settings,
      title: "Settings",
      actions: { primary: "System Settings", secondary: "User Permissions" }
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