import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { dropshipService } from '@/lib/dropship/service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const sourceId = searchParams.get('sourceId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    if (type === 'sources') {
      const { data, error } = await supabase
        .from('dropship_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ sources: data || [] });
    }

    if (type === 'products') {
      const products = await dropshipService.getDropshipProducts({
        sourceId: sourceId || undefined,
        status: status || undefined,
        category: category || undefined
      });
      return NextResponse.json({ products });
    }

    if (type === 'orders') {
      const orders = await dropshipService.getDropshipOrders({
        sourceId: sourceId || undefined,
        status: status || undefined
      });
      return NextResponse.json({ orders });
    }

    if (type === 'sync-logs') {
      let query = supabase
        .from('dropship_inventory_sync_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (sourceId) {
        query = query.eq('source_id', sourceId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json({ logs: data || [] });
    }

    if (type === 'price-rules') {
      const { data, error } = await supabase
        .from('dropship_price_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ rules: data || [] });
    }

    if (type === 'stats') {
      const [productsCount, ordersCount, sourcesCount] = await Promise.all([
        supabase.from('dropship_products').select('id', { count: 'exact', head: true }),
        supabase.from('dropship_orders').select('id', { count: 'exact', head: true }),
        supabase.from('dropship_sources').select('id', { count: 'exact', head: true })
      ]);

      const { data: lowStock } = await supabase
        .from('dropship_products')
        .select('id')
        .lte('local_stock', 5)
        .eq('status', 'LISTED');

      return NextResponse.json({
        stats: {
          totalProducts: productsCount.count || 0,
          totalOrders: ordersCount.count || 0,
          activeSources: sourcesCount.count || 0,
          lowStockProducts: lowStock?.length || 0
        }
      });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Dropship GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'add-source') {
      const body = await request.json();
      const source = await dropshipService.addSource({
        name: body.name,
        source_type: body.sourceType,
        api_endpoint: body.apiEndpoint,
        config: body.config || {}
      });
      return NextResponse.json({ source, message: 'Source added successfully' });
    }

    if (action === 'update-source') {
      const body = await request.json();
      await dropshipService.updateSource(body.id, {
        name: body.name,
        source_type: body.sourceType,
        api_endpoint: body.apiEndpoint,
        config: body.config,
        is_active: body.isActive
      });
      return NextResponse.json({ message: 'Source updated successfully' });
    }

    if (action === 'import-products') {
      const body = await request.json();
      const result = await dropshipService.bulkImportProducts(
        body.sourceId,
        body.products
      );
      return NextResponse.json(result);
    }

    if (action === 'sync-inventory') {
      const body = await request.json();
      const result = await dropshipService.syncInventory(body.sourceId);
      return NextResponse.json(result);
    }

    if (action === 'forward-order') {
      const body = await request.json();
      const order = await dropshipService.forwardOrder(
        body.localOrderId,
        body.dropshipProductId,
        body.customerInfo
      );
      return NextResponse.json({ order, message: 'Order forwarded successfully' });
    }

    if (action === 'confirm-order') {
      const body = await request.json();
      await dropshipService.confirmSupplierOrder(body.dropshipOrderId, body.supplierOrderId);
      return NextResponse.json({ message: 'Order confirmed successfully' });
    }

    if (action === 'update-tracking') {
      const body = await request.json();
      await dropshipService.updateTracking(body.dropshipOrderId, body.trackingData);
      return NextResponse.json({ message: 'Tracking updated successfully' });
    }

    if (action === 'add-price-rule') {
      const { data, error } = await supabase
        .from('dropship_price_rules')
        .insert({
          name: (await request.json()).name,
          description: (await request.json()).description,
          source_id: (await request.json()).sourceId,
          category: (await request.json()).category,
          brand: (await request.json()).brand,
          pricing_type: (await request.json()).pricingType,
          margin_percentage: (await request.json()).marginPercentage,
          fixed_markup: (await request.json()).fixedMarkup,
          min_price: (await request.json()).minPrice,
          max_price: (await request.json()).maxPrice,
          round_to: (await request.json()).roundTo || 1,
          is_active: true,
          priority: (await request.json()).priority || 0
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ rule: data, message: 'Price rule added' });
    }

    if (action === 'calculate-price') {
      const body = await request.json();
      const { data, error } = await supabase.rpc('calculate_dropship_price', {
        p_cost_price: body.costPrice,
        p_source_id: body.sourceId,
        p_category: body.category,
        p_brand: body.brand
      });

      if (error) throw error;
      return NextResponse.json({ price: data });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Dropship POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'update-product') {
      const { data, error } = await supabase
        .from('dropship_products')
        .update({
          selling_price: body.sellingPrice,
          local_stock: body.localStock,
          status: body.status,
          category: body.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', body.productId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ product: data });
    }

    if (action === 'update-order-status') {
      const { data, error } = await supabase
        .from('dropship_orders')
        .update({
          status: body.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', body.orderId)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ order: data });
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

    if (type === 'source' && id) {
      const { error } = await supabase
        .from('dropship_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ message: 'Source deleted' });
    }

    if (type === 'product' && id) {
      const { error } = await supabase
        .from('dropship_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ message: 'Product deleted' });
    }

    if (type === 'price-rule' && id) {
      const { error } = await supabase
        .from('dropship_price_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ message: 'Price rule deleted' });
    }

    return NextResponse.json({ error: 'Invalid type or missing id' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
