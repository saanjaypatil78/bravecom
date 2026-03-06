// Vendor Product Detail API Route
// BRAVECOM Sunray Ecosystem - Individual Product Management (PUT/DELETE)

import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { Session } from 'next-auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

// GET - Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions) as unknown as Session & { user?: { id?: string } };

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
        }

        // Get vendor
        const { data: vendor } = await supabaseAdmin
            .from('vendors')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

        if (!vendor) {
            return NextResponse.json({ success: false, error: 'No vendor account found' }, { status: 404 });
        }

        // Get product
        const { data: product, error } = await supabaseAdmin
            .from('vendor_products')
            .select('*')
            .eq('id', id)
            .eq('vendor_id', vendor.id)
            .single();

        if (error || !product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product });

    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions) as unknown as Session & { user?: { id?: string } };

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
        }

        // Get vendor
        const { data: vendor } = await supabaseAdmin
            .from('vendors')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

        if (!vendor) {
            return NextResponse.json({ success: false, error: 'No vendor account found' }, { status: 404 });
        }

        // Check product exists and belongs to vendor
        const { data: existingProduct } = await supabaseAdmin
            .from('vendor_products')
            .select('id')
            .eq('id', id)
            .eq('vendor_id', vendor.id)
            .single();

        if (!existingProduct) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
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
            status,
            images,
            roiPercentage
        } = body;

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString()
        };

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = tags;
        if (mrp !== undefined) updateData.mrp = parseFloat(mrp);
        if (sellingPrice !== undefined) updateData.selling_price = parseFloat(sellingPrice);
        if (inventory !== undefined) updateData.inventory = parseInt(inventory);
        if (status !== undefined) updateData.status = status;
        if (images !== undefined) updateData.images = images;
        if (roiPercentage !== undefined) updateData.roi_percentage = roiPercentage ? parseFloat(roiPercentage) : null;

        const { data: product, error } = await supabaseAdmin
            .from('vendor_products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // Log audit
        await supabaseAdmin
            .from('vendor_audit_logs')
            .insert({
                vendor_id: vendor.id,
                action: 'PRODUCT_UPDATED',
                details: { productId: id, changes: Object.keys(body) },
                performed_by: session.user.id,
                created_at: new Date().toISOString()
            });

        return NextResponse.json({ success: true, data: product });

    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions) as unknown as Session & { user?: { id?: string } };

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
        }

        // Get vendor
        const { data: vendor } = await supabaseAdmin
            .from('vendors')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

        if (!vendor) {
            return NextResponse.json({ success: false, error: 'No vendor account found' }, { status: 404 });
        }

        // Check if product has orders
        const { data: orders } = await supabaseAdmin
            .from('vendor_orders')
            .select('id')
            .eq('product_id', id)
            .limit(1);

        if (orders && orders.length > 0) {
            // Soft delete instead of hard delete
            const { error } = await supabaseAdmin
                .from('vendor_products')
                .update({ status: 'DELETED', updated_at: new Date().toISOString() })
                .eq('id', id)
                .eq('vendor_id', vendor.id);

            if (error) {
                return NextResponse.json({ success: false, error: error.message }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                message: 'Product hidden (has existing orders)',
                softDeleted: true
            });
        }

        // Hard delete if no orders
        const { error } = await supabaseAdmin
            .from('vendor_products')
            .delete()
            .eq('id', id)
            .eq('vendor_id', vendor.id);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // Log audit
        await supabaseAdmin
            .from('vendor_audit_logs')
            .insert({
                vendor_id: vendor.id,
                action: 'PRODUCT_DELETED',
                details: { productId: id },
                performed_by: session.user.id,
                created_at: new Date().toISOString()
            });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}