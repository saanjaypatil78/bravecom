import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const supabase = await createSupabaseServerClient();

        const { data, error } = await supabase
            .from('user_franchise_status')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            return NextResponse.json({ error: 'Franchise status not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch franchise status' },
            { status: 500 }
        );
    }
}
