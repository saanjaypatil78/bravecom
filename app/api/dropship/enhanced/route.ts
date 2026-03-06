import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { csvImportService } from '@/lib/dropship/csv-import';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (type === 'returns') {
      let query = supabase
        .from('dropship_returns')
        .select('*, dropship_orders(*), vendor_orders(*)')
        .order('created_at', { ascending: false });

      const status = searchParams.get('status');
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json({ returns: data || [] });
    }

    if (type === 'reviews') {
      let query = supabase
        .from('dropship_product_reviews')
        .select('*, dropship_products(name, main_image)')
        .eq('is_displayed', true)
        .order('rating', { ascending: false });

      const productId = searchParams.get('productId');
      if (productId) {
        query = query.eq('dropship_product_id', productId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json({ reviews: data || [] });
    }

    if (type === 'csv-imports') {
      const sourceId = searchParams.get('sourceId');
      const history = await csvImportService.getImportHistory(sourceId || undefined);
      return NextResponse.json({ imports: history });
    }

    if (type === 'shipping-rates') {
      let query = supabase
        .from('dropship_shipping_rates')
        .select('*')
        .eq('is_active', true);

      const sourceId = searchParams.get('sourceId');
      if (sourceId) {
        query = query.eq('source_id', sourceId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json({ rates: data || [] });
    }

    if (type === 'routing-rules') {
      const { data, error } = await supabase
        .from('dropship_order_routing_rules')
        .select('*, target_source:dropship_sources(name), target_vendor:vendors(business_name)')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ rules: data || [] });
    }

    if (type === 'calculate-shipping') {
      const sourceId = searchParams.get('sourceId');
      const country = searchParams.get('country');
      const weight = parseFloat(searchParams.get('weight') || '0.5');
      const orderValue = parseFloat(searchParams.get('orderValue') || '0');

      if (!sourceId || !country) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }

      const { data, error } = await supabase.rpc('calculate_dropship_shipping', {
        p_source_id: sourceId,
        p_destination_country: country,
        p_weight: weight,
        p_order_value: orderValue
      });

      if (error) throw error;
      return NextResponse.json({ shipping: data });
    }

    if (type === 'variants') {
      const productId = searchParams.get('productId');
      if (!productId) {
        return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('dropship_product_variants')
        .select('*')
        .eq('dropship_product_id', productId)
        .eq('is_active', true);

      if (error) throw error;
      return NextResponse.json({ variants: data || [] });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Enhanced dropship GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();

    if (action === 'csv-import') {
      const result = await csvImportService.processCSV(
        body.csvContent,
        body.sourceId,
        {
          mapping: body.mapping,
          updateExisting: body.updateExisting,
          autoPublish: body.autoPublish
        }
      );
      return NextResponse.json(result);
    }

    if (action === 'create-return') {
      const { data, error } = await supabase
        .from('dropship_returns')
        .insert({
          dropship_order_id: body.orderId,
          local_order_id: body.localOrderId,
          return_type: body.returnType,
          reason: body.reason,
          description: body.description,
          requested_quantity: body.quantity || 1,
          status: 'pending',
          customer_notes: body.notes
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ return: data, message: 'Return request created' });
    }

    if (action === 'process-return') {
      const { data, error } = await supabase.rpc('process_dropship_return', {
        p_return_id: body.returnId,
        p_action: body.action,
        p_notes: body.notes
      });

      if (error) throw error;
      return NextResponse.json({ result: data });
    }

    if (action === 'add-shipping-rate') {
      const { data, error } = await supabase
        .from('dropship_shipping_rates')
        .insert({
          source_id: body.sourceId,
          carrier_name: body.carrierName,
          service_name: body.serviceName,
          service_code: body.serviceCode,
          origin_country: body.originCountry,
          destination_countries: body.destinationCountries || [],
          base_rate: body.baseRate || 0,
          per_kg_rate: body.perKgRate || 0,
          free_shipping_threshold: body.freeShippingThreshold,
          handling_fee: body.handlingFee || 0,
          min_delivery_days: body.minDeliveryDays,
          max_delivery_days: body.maxDeliveryDays,
          is_tracked: body.isTracked ?? true,
          is_epacket: body.isEpacket ?? false,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ rate: data, message: 'Shipping rate added' });
    }

    if (action === 'add-routing-rule') {
      const { data, error } = await supabase
        .from('dropship_order_routing_rules')
        .insert({
          name: body.name,
          description: body.description,
          priority: body.priority || 0,
          conditions: body.conditions || {},
          action_type: body.actionType,
          target_source_id: body.targetSourceId,
          target_vendor_id: body.targetVendorId,
          fallback_action: body.fallbackAction,
          fallback_source_id: body.fallbackSourceId,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ rule: data, message: 'Routing rule added' });
    }

    if (action === 'sync-reviews') {
      const productId = body.productId;
      if (!productId) {
        return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
      }

      const { data: product } = await supabase
        .from('dropship_products')
        .select('*, source:dropship_sources(*)')
        .eq('id', productId)
        .single();

      if (!product?.source?.api_endpoint) {
        return NextResponse.json({ error: 'Source API not configured' }, { status: 400 });
      }

      // Simulated review sync (in real implementation, call actual supplier API)
      const mockReviews = [
        {
          rating: 4.5,
          title: 'Great product!',
          content: 'Very satisfied with the quality.',
          reviewer_name: 'John D.',
          review_date: new Date().toISOString().split('T')[0],
          is_verified_purchase: true
        }
      ];

      let synced = 0;
      for (const review of mockReviews) {
        const { error: insertError } = await supabase
          .from('dropship_product_reviews')
          .upsert({
            dropship_product_id: productId,
            source_review_id: `sync_${Date.now()}`,
            ...review,
            last_sync_at: new Date().toISOString(),
            is_synced: true,
            is_displayed: true
          }, {
            onConflict: 'dropship_product_id,source_review_id'
          });

        if (!insertError) synced++;
      }

      return NextResponse.json({ synced, message: 'Reviews synced' });
    }

    if (action === 'add-variant') {
      const { data, error } = await supabase
        .from('dropship_product_variants')
        .insert({
          dropship_product_id: body.productId,
          source_variant_id: body.variantId,
          sku: body.sku,
          attributes: body.attributes,
          cost_price: body.costPrice,
          selling_price: body.sellingPrice || body.costPrice * 1.2,
          stock: body.stock || 0,
          images: body.images || [],
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ variant: data, message: 'Variant added' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Enhanced dropship POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'update-return') {
      const { data, error } = await supabase
        .from('dropship_returns')
        .update({
          admin_notes: body.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', body.returnId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ return: data });
    }

    if (action === 'update-review-display') {
      const { data, error } = await supabase
        .from('dropship_product_reviews')
        .update({
          is_displayed: body.isDisplayed,
          display_order: body.order,
          updated_at: new Date().toISOString()
        })
        .eq('id', body.reviewId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ review: data });
    }

    if (action === 'toggle-routing-rule') {
      const { data, error } = await supabase
        .from('dropship_order_routing_rules')
        .update({
          is_active: body.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', body.ruleId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ rule: data });
    }

    if (action === 'toggle-shipping-rate') {
      const { data, error } = await supabase
        .from('dropship_shipping_rates')
        .update({
          is_active: body.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', body.rateId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ rate: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    if (type === 'routing-rule') {
      const { error } = await supabase
        .from('dropship_order_routing_rules')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }

    if (type === 'shipping-rate') {
      const { error } = await supabase
        .from('dropship_shipping_rates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }

    if (type === 'variant') {
      const { error } = await supabase
        .from('dropship_product_variants')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
