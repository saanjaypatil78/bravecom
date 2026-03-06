// Vendor Registration API Route
// BRAVECOM Sunray Ecosystem - Task 6: Vendor Management System

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

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions) as unknown as Session & { user?: { id?: string } };

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            businessName,
            businessType,
            description,
            gstNumber,
            bankAccountNumber,
            bankName,
            bankBranch,
            ifscCode,
            kycVerified
        } = body;

        // Validate required fields
        if (!businessName) {
            return NextResponse.json(
                { success: false, error: 'Business name is required' },
                { status: 400 }
            );
        }

        // Check if user already has a vendor account
        const { data: existingVendor } = await supabaseAdmin
            .from('vendors')
            .select('id, status')
            .eq('user_id', session.user.id)
            .single();

        if (existingVendor) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'You already have a vendor account',
                    vendorId: existingVendor.id,
                    status: existingVendor.status
                },
                { status: 400 }
            );
        }

        // Create vendor record
        const vendorData = {
            user_id: session.user.id,
            business_name: businessName,
            business_type: businessType || 'INDIVIDUAL',
            description: description || '',
            gst_number: gstNumber || null,
            status: 'PENDING',
            tier: 'BRONZE',
            commission_rate: 25.00,
            monthly_sales: 0,
            total_sales: 0,
            bank_account_number: bankAccountNumber || null,
            bank_name: bankName || null,
            bank_branch: bankBranch || null,
            ifsc_code: ifscCode || null,
            kyc_verified: kycVerified || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data: vendor, error } = await supabaseAdmin
            .from('vendors')
            .insert(vendorData)
            .select()
            .single();

        if (error) {
            console.error('Vendor creation error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to create vendor account' },
                { status: 500 }
            );
        }

        // Log audit event
        await supabaseAdmin
            .from('vendor_audit_logs')
            .insert({
                vendor_id: vendor.id,
                action: 'VENDOR_REGISTERED',
                details: { businessName, businessType },
                performed_by: session.user.id
            });

        return NextResponse.json({
            success: true,
            data: {
                id: vendor.id,
                businessName: vendor.business_name,
                status: vendor.status,
                tier: vendor.tier,
                message: 'Vendor application submitted successfully. Pending approval.'
            }
        });

    } catch (error) {
        console.error('Vendor registration error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Get user ID from session
        const session = await getServerSession(authOptions) as unknown as Session & { user?: { id?: string } };

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Get vendor by user ID
        const { data: vendor, error } = await supabaseAdmin
            .from('vendors')
            .select(`
        id,
        business_name,
        business_type,
        description,
        gst_number,
        status,
        tier,
        commission_rate,
        monthly_sales,
        total_sales,
        approved_at,
        bank_account_number,
        bank_name,
        bank_branch,
        ifsc_code,
        kyc_verified,
        created_at,
        updated_at
      `)
            .eq('user_id', session.user.id)
            .single();

        if (error || !vendor) {
            return NextResponse.json(
                { success: false, error: 'No vendor account found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: vendor
        });

    } catch (error) {
        console.error('Get vendor error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}