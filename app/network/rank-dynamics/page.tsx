import RankDynamicsDashboard from '@/app/components/network/RankDynamicsDashboard';
import { prisma } from '@/lib/prisma';

interface PageProps {
    params: Promise<{ userId?: string }>;
    searchParams: Promise<{ userId?: string }>;
}

export default async function RankDynamicsPage({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const userId = resolvedParams?.userId || resolvedSearchParams?.userId;

    // If no userId provided, get first user for demo
    if (!userId) {
        const firstUser = await prisma.user.findFirst({
            select: { id: true },
        });
        
        if (!firstUser) {
            return (
                <div className="min-h-screen bg-[#0A0A0B] text-white p-12 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">No Users Found</h1>
                        <p className="text-gray-400">Please register a user first to view rank dynamics.</p>
                    </div>
                </div>
            );
        }

        return <RankDynamicsDashboard userId={firstUser.id} />;
    }

    return <RankDynamicsDashboard userId={userId} />;
}
