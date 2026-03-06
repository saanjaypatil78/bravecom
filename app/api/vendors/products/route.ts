// Vendor Products API Route
// BRAVECOM Sunray Ecosystem - Vendor Product Management

import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { Session } from 'next-auth';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

// GET - List vendor's products
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) as unknown as Session & { user?: { id?: string } };

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
        }

        // Get vendor by user ID
        const { data: vendor } = await supabaseAdmin
            .from('vendors')
            .select('id, status')
            .eq('user_id', session.user.id)
            .single();

        if (!vendor) {
            return NextResponse.json({ success: false, error: 'No vendor account found' }, { status: 404 });
        }

        if (vendor.status !== 'APPROVED') {
            return NextResponse.json({ success: false, error: 'Vendor account not approved' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        let query = supabaseAdmin
            .from('vendor_products')
            .select('*')
            .eq('vendor_id', vendor.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status) {
            query = query.eq('status', status);
        }
        if (category) {
            query = query.eq('category', category);
        }

        const { data: products, error } = await query;

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // Get total count
        const { count } = await supabaseAdmin
            .from('vendor_products')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendor.id);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                total: count || 0,
                limit,
                offset
            }
        });

    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new product
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) as unknown as Session & { user?: { id?: string } };

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
        }

        // Get vendor
        const { data: vendor } = await supabaseAdmin
            .from('vendors')
            .select('id, status, commission_rate')
            .eq('user_id', session.user.id)
            .single();

        if (!vendor) {
            return NextResponse.json({ success: false, error: 'No vendor account found' }, { status: 404 });
        }

        if (vendor.status !== 'APPROVED') {
            return NextResponse.json({ success: false, error: 'Vendor account not approved' }, { status: 403 });
        }

        const body = await request.json();
        const {
            name,
            description,
            category,
            tags,
            mrp,
            sellingPrice,
            inventory,
            images,
            roiPercentage
        } = body;

        // Validation
        if (!name || !mrp || !sellingPrice) {
            return NextResponse.json(
                { success: false, error: 'Name, MRP and selling price are required' },
                { status: 400 }
            );
        }

        // Calculate commission (platform takes vendor's commission_rate as platform fee)
        const commission = vendor.commission_rate || 25;

        const productData = {
            vendor_id: vendor.id,
            name,
            description: description || '',
            category: category || 'GENERAL',
            tags: tags || [],
            mrp: parseFloat(mrp),
            selling_price: parseFloat(sellingPrice),
            commission,
            inventory: parseInt(inventory) || 0,
            status: 'ACTIVE',
            images: images || [],
            roi_percentage: roiPercentage ? parseFloat(roiPercentage) : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data: product, error } = await supabaseAdmin
            .from('vendor_products')
            .insert(productData)
            .select()
            .single();

        if (error) {
            console.error('Product creation error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // Log audit
        await supabaseAdmin
            .from('vendor_audit_logs')
            .insert({
                vendor_id: vendor.id,
                action: 'PRODUCT_CREATED',
                details: { productId: product.id, productName: name },
                performed_by: session.user.id,
                created_at: new Date().toISOString()
            });

        return NextResponse.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}