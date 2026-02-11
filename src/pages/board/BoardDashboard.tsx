import { BoardLayout } from "@/components/board/BoardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BoardDashboard = () => {
    return (
        <BoardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-light tracking-tight mb-8">Board Dashboard</h1>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader><CardTitle>Financial Overview</CardTitle></CardHeader>
                        <CardContent>Coming Soon</CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Pending ARCs</CardTitle></CardHeader>
                        <CardContent>Coming Soon</CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Violations</CardTitle></CardHeader>
                        <CardContent>Coming Soon</CardContent>
                    </Card>
                </div>
            </div>
        </BoardLayout>
    );
};

export default BoardDashboard;
