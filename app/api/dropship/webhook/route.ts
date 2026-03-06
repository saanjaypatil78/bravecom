import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface WebhookPayload {
  event: string;
  order_id?: string;
  tracking_number?: string;
  carrier?: string;
  status?: string;
  data?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-webhook-signature');
    const body: WebhookPayload = await request.json();

    console.log('Received dropship webhook:', body);

    if (!body.event) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    }

    switch (body.event) {
      case 'order.confirmed':
        if (body.order_id && body.data?.supplier_order_id) {
          await supabase
            .from('dropship_orders')
            .update({
              supplier_order_id: body.data.supplier_order_id,
              status: 'CONFIRMED',
              confirmed_at: new Date().toISOString(),
              api_response: body.data
            })
            .eq('id', body.order_id);

          await supabase
            .from('dropship_notifications')
            .insert({
              type: 'order_confirmed',
              title: 'Order Confirmed by Supplier',
              message: `Order ${body.order_id} confirmed. Supplier ID: ${body.data.supplier_order_id}`,
              order_id: body.order_id
            });
        }
        break;

      case 'order.shipped':
        if (body.order_id && body.tracking_number) {
          const trackingUrl = body.carrier === 'aliexpress' 
            ? `https://global.cainiao.com/global/detail.json?mailNo=${body.tracking_number}`
            : body.data?.tracking_url;

          await supabase
            .from('dropship_orders')
            .update({
              tracking_number: body.tracking_number,
              tracking_carrier: body.carrier,
              tracking_url: trackingUrl,
              status: 'SHIPPED',
              shipped_at: new Date().toISOString(),
              tracking_events: supabase.raw(`jsonb_insert(coalesce(tracking_events, '[]'), '{0}', ?)`,
                JSON.stringify({
                  status: 'SHIPPED',
                  timestamp: new Date().toISOString(),
                  tracking: body.tracking_number,
                  carrier: body.carrier
                })
              )
            })
            .eq('id', body.order_id);

          const { data: order } = await supabase
            .from('dropship_orders')
            .select('local_order_id')
            .eq('id', body.order_id)
            .single();

          if (order?.local_order_id) {
            await supabase
              .from('vendor_orders')
              .update({
                tracking_number: body.tracking_number,
                status: 'SHIPPED',
                updated_at: new Date().toISOString()
              })
              .eq('id', order.local_order_id);
          }

          await supabase
            .from('dropship_notifications')
            .insert({
              type: 'tracking_updated',
              title: 'Order Shipped',
              message: `Order ${body.order_id} shipped. Tracking: ${body.tracking_number}`,
              order_id: body.order_id
            });
        }
        break;

      case 'order.in_transit':
        if (body.order_id) {
          await supabase
            .from('dropship_orders')
            .update({
              status: 'IN_TRANSIT',
              tracking_events: supabase.raw(`jsonb_insert(coalesce(tracking_events, '[]'), '{0}', ?)`,
                JSON.stringify({
                  status: 'IN_TRANSIT',
                  timestamp: new Date().toISOString(),
                  location: body.data?.location,
                  description: body.data?.description
                })
              )
            })
            .eq('id', body.order_id);
        }
        break;

      case 'order.delivered':
        if (body.order_id) {
          await supabase
            .from('dropship_orders')
            .update({
              status: 'DELIVERED',
              delivered_at: new Date().toISOString()
            })
            .eq('id', body.order_id);

          const { data: order } = await supabase
            .from('dropship_orders')
            .select('local_order_id')
            .eq('id', body.order_id)
            .single();

          if (order?.local_order_id) {
            await supabase
              .from('vendor_orders')
              .update({
                status: 'DELIVERED',
                delivered_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', order.local_order_id);
          }

          await supabase
            .from('dropship_notifications')
            .insert({
              type: 'order_delivered',
              title: 'Order Delivered',
              message: `Order ${body.order_id} has been delivered`,
              order_id: body.order_id
            });
        }
        break;

      case 'order.cancelled':
        if (body.order_id) {
          await supabase
            .from('dropship_orders')
            .update({
              status: 'CANCELLED',
              cancelled_at: new Date().toISOString(),
              cancellation_reason: body.data?.reason
            })
            .eq('id', body.order_id);

          const { data: order } = await supabase
            .from('dropship_orders')
            .select('local_order_id')
            .eq('id', body.order_id)
            .single();

          if (order?.local_order_id) {
            await supabase
              .from('vendor_orders')
              .update({
                status: 'CANCELLED',
                updated_at: new Date().toISOString()
              })
              .eq('id', order.local_order_id);
          }

          await supabase
            .from('dropship_notifications')
            .insert({
              type: 'order_cancelled',
              title: 'Order Cancelled',
              message: `Order ${body.order_id} was cancelled. Reason: ${body.data?.reason || 'Unknown'}`,
              order_id: body.order_id
            });
        }
        break;

      case 'inventory.updated':
        if (body.data?.products) {
          for (const product of body.data.products) {
            await supabase
              .from('dropship_products')
              .update({
                source_stock: product.stock,
                local_stock: product.stock,
                last_sync_at: new Date().toISOString(),
                sync_status: 'COMPLETED',
                status: product.stock > 0 ? 'LISTED' : 'OUT_OF_STOCK'
              })
              .eq('source_product_id', product.product_id);
          }
        }
        break;

      case 'inventory.out_of_stock':
        if (body.data?.product_id) {
          await supabase
            .from('dropship_products')
            .update({
              source_stock: 0,
              local_stock: 0,
              status: 'OUT_OF_STOCK'
            })
            .eq('source_product_id', body.data.product_id);

          await supabase
            .from('dropship_notifications')
            .insert({
              type: 'stock_low',
              title: 'Product Out of Stock',
              message: `Product ${body.data.product_id} is out of stock at supplier`,
              product_id: body.data.product_id
            });
        }
        break;

      default:
        console.log('Unhandled webhook event:', body.event);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Dropship webhook endpoint',
    supported_events: [
      'order.confirmed',
      'order.shipped',
      'order.in_transit',
      'order.delivered',
      'order.cancelled',
      'inventory.updated',
      'inventory.out_of_stock'
    ]
  });
}
