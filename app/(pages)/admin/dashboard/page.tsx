import DashboardStatCard from "@/app/components/ui/dashboardCard";
import { BookUser, GalleryHorizontalEnd, User, Users } from "lucide-react";

const AdminDashboard = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DashboardStatCard
                    label="Total Account"
                    value="7,090"
                    icon={<BookUser />}
                    iconBg="bg-red-500/50"
                    iconColor="text-red-500"
                />

                <DashboardStatCard
                    label="Savings Account"
                    value="1200"
                    icon={<User />}
                    iconBg="bg-green-500/30"
                    iconColor="text-green-600"
                />
            <DashboardStatCard
                    label="Current Account"
                    value="900"
                    icon={<Users />}
                    iconBg="bg-yellow-500/30"
                    iconColor="text-yellow-600"
                />
                          <DashboardStatCard
                    label="Corporate Account"
                    value="900"
                    icon={<GalleryHorizontalEnd />}
                    iconBg="bg-blue-500/30"
                    iconColor="text-blue-600"
                />
            </div>
        </div>
    );
}

export default AdminDashboard;