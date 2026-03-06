import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface DropshipSource {
  id: string;
  name: string;
  source_type: string;
  api_endpoint: string;
  is_active: boolean;
  status: string;
  config: Record<string, any>;
}

export interface DropshipProduct {
  id: string;
  source_id: string;
  source_product_id: string;
  name: string;
  description: string;
  source_price: number;
  cost_price: number;
  selling_price: number;
  source_stock: number;
  local_stock: number;
  images: string[];
  main_image: string;
  status: string;
  category: string;
}

export interface DropshipOrder {
  id: string;
  source_id: string;
  local_order_id: string;
  dropship_product_id: string;
  supplier_order_id: string;
  tracking_number: string;
  quantity: number;
  total_cost: number;
  status: string;
  customer_name: string;
  customer_address: Record<string, any>;
}

export class DropshipService {
  private sourceCache: Map<string, DropshipSource> = new Map();

  async getSource(sourceId: string): Promise<DropshipSource | null> {
    if (this.sourceCache.has(sourceId)) {
      return this.sourceCache.get(sourceId)!;
    }

    const { data, error } = await supabase
      .from('dropship_sources')
      .select('*')
      .eq('id', sourceId)
      .single();

    if (error || !data) return null;

    this.sourceCache.set(sourceId, data);
    return data;
  }

  async getActiveSources(): Promise<DropshipSource[]> {
    const { data, error } = await supabase
      .from('dropship_sources')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'ACTIVE');

    if (error) throw error;
    return data || [];
  }

  async addSource(source: Partial<DropshipSource>): Promise<DropshipSource> {
    const { data, error } = await supabase
      .from('dropship_sources')
      .insert({
        name: source.name,
        source_type: source.source_type,
        api_endpoint: source.api_endpoint,
        config: source.config || {},
        is_active: true,
        status: 'ACTIVE'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSource(sourceId: string, updates: Partial<DropshipSource>): Promise<void> {
    const { error } = await supabase
      .from('dropship_sources')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sourceId);

    if (error) throw error;
    this.sourceCache.delete(sourceId);
  }

  async importProduct(
    sourceId: string,
    sourceProductData: {
      source_product_id: string;
      name: string;
      description?: string;
      price: number;
      stock: number;
      images: string[];
      category?: string;
      brand?: string;
    }
  ): Promise<DropshipProduct> {
    const source = await this.getSource(sourceId);
    if (!source) throw new Error('Source not found');

    const costPrice = sourceProductData.price;
    const { data: priceRule } = await supabase.rpc('calculate_dropship_price', {
      p_cost_price: costPrice,
      p_source_id: sourceId,
      p_category: sourceProductData.category,
      p_brand: sourceProductData.brand
    });

    const sellingPrice = priceRule || costPrice * 1.2;

    const { data, error } = await supabase
      .from('dropship_products')
      .upsert({
        source_id: sourceId,
        source_product_id: sourceProductData.source_product_id,
        name: sourceProductData.name,
        description: sourceProductData.description,
        source_price: sourceProductData.price,
        cost_price: costPrice,
        selling_price: sellingPrice,
        source_stock: sourceProductData.stock,
        local_stock: sourceProductData.stock,
        images: sourceProductData.images,
        main_image: sourceProductData.images[0] || null,
        category: sourceProductData.category,
        brand: sourceProductData.brand,
        status: 'IMPORTED',
        last_sync_at: new Date().toISOString(),
        sync_status: 'COMPLETED'
      }, {
        onConflict: 'source_id,source_product_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async bulkImportProducts(
    sourceId: string,
    products: Array<{
      source_product_id: string;
      name: string;
      description?: string;
      price: number;
      stock: number;
      images: string[];
      category?: string;
      brand?: string;
    }>
  ): Promise<{ imported: number; updated: number; failed: number }> {
    let imported = 0;
    let updated = 0;
    let failed = 0;

    for (const product of products) {
      try {
        await this.importProduct(sourceId, product);
        imported++;
      } catch (error) {
        console.error(`Failed to import ${product.source_product_id}:`, error);
        failed++;
      }
    }

    return { imported, updated, failed };
  }

  async syncInventory(sourceId: string): Promise<{
    success: boolean;
    productsUpdated: number;
    outOfStock: number;
    errors: string[];
  }> {
    const source = await this.getSource(sourceId);
    if (!source) throw new Error('Source not found');

    const syncLogId = crypto.randomUUID();
    
    await supabase.from('dropship_inventory_sync_log').insert({
      id: syncLogId,
      source_id: sourceId,
      sync_type: 'scheduled',
      status: 'IN_PROGRESS',
      started_at: new Date().toISOString()
    });

    const errors: string[] = [];
    let productsUpdated = 0;
    let outOfStock = 0;

    try {
      const { data: products, error: fetchError } = await supabase
        .from('dropship_products')
        .select('id, source_product_id, source_price')
        .eq('source_id', sourceId);

      if (fetchError) throw fetchError;

      if (!source.api_endpoint) {
        throw new Error('Source API endpoint not configured');
      }

      const response = await fetch(source.api_endpoint + '/products/inventory', {
        headers: {
          'Authorization': `Bearer ${source.config?.api_key || ''}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const inventoryData = await response.json();

      for (const product of products || []) {
        const sourceInventory = inventoryData.find(
          (i: any) => i.product_id === product.source_product_id
        );

        if (sourceInventory) {
          const newStock = sourceInventory.stock || 0;
          const newPrice = sourceInventory.price || product.source_price;
          
          const { error: updateError } = await supabase
            .from('dropship_products')
            .update({
              source_stock: newStock,
              local_stock: newStock,
              source_price: newPrice,
              last_sync_at: new Date().toISOString(),
              sync_status: 'COMPLETED',
              status: newStock > 0 ? 'LISTED' : 'OUT_OF_STOCK'
            })
            .eq('id', product.id);

          if (updateError) {
            errors.push(`Failed to update ${product.source_product_id}`);
          } else {
            productsUpdated++;
            if (newStock === 0) outOfStock++;
          }
        }
      }

      await supabase
        .from('dropship_inventory_sync_log')
        .update({
          status: 'COMPLETED',
          completed_at: new Date().toISOString(),
          products_total: products?.length || 0,
          products_updated: productsUpdated,
          products_out_of_stock: outOfStock
        })
        .eq('id', syncLogId);

      return {
        success: true,
        productsUpdated,
        outOfStock,
        errors
      };
    } catch (error: any) {
      await supabase
        .from('dropship_inventory_sync_log')
        .update({
          status: 'FAILED',
          completed_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('id', syncLogId);

      return {
        success: false,
        productsUpdated: 0,
        outOfStock: 0,
        errors: [error.message]
      };
    }
  }

  async forwardOrder(
    localOrderId: string,
    dropshipProductId: string,
    customerInfo: {
      name: string;
      phone: string;
      address: Record<string, any>;
    }
  ): Promise<DropshipOrder> {
    const { data: product, error: productError } = await supabase
      .from('dropship_products')
      .select('*, source:dropship_sources(*)')
      .eq('id', dropshipProductId)
      .single();

    if (productError || !product) throw new Error('Product not found');
    if (product.status !== 'LISTED') throw new Error('Product not available for dropshipping');

    const { data: order, error: orderError } = await supabase
      .from('vendor_orders')
      .select('*, product:vendor_products(*)')
      .eq('id', localOrderId)
      .single();

    if (orderError || !order) throw new Error('Order not found');

    const { data: dropshipOrder, error: dropshipError } = await supabase
      .from('dropship_orders')
      .insert({
        source_id: product.source_id,
        local_order_id: localOrderId,
        dropship_product_id: dropshipProductId,
        quantity: order.quantity,
        unit_cost: product.cost_price,
        total_cost: product.cost_price * order.quantity,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        status: 'PENDING',
        ordered_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dropshipError) throw dropshipError;

    await supabase
      .from('vendor_orders')
      .update({ status: 'DROPSHIP_PENDING' })
      .eq('id', localOrderId);

    return dropshipOrder;
  }

  async confirmSupplierOrder(dropshipOrderId: string, supplierOrderId: string): Promise<void> {
    const { error } = await supabase
      .from('dropship_orders')
      .update({
        supplier_order_id: supplierOrderId,
        status: 'CONFIRMED',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', dropshipOrderId);

    if (error) throw error;
  }

  async updateTracking(
    dropshipOrderId: string,
    trackingData: {
      tracking_number: string;
      carrier?: string;
      url?: string;
      status: string;
    }
  ): Promise<void> {
    const { error } = await supabase
      .from('dropship_orders')
      .update({
        tracking_number: trackingData.tracking_number,
        tracking_carrier: trackingData.carrier,
        tracking_url: trackingData.url,
        status: trackingData.status,
        tracking_events: supabase.raw(`jsonb_set(coalesce(tracking_events, '[]'), '{${Date.now()}}', ?)`,
          JSON.stringify({
            status: trackingData.status,
            timestamp: new Date().toISOString(),
            tracking: trackingData.tracking_number
          })
        )
      })
      .eq('id', dropshipOrderId);

    if (error) throw error;

    await supabase.from('dropship_notifications').insert({
      type: 'tracking_updated',
      title: 'Tracking Updated',
      message: `Order ${dropshipOrderId} tracking: ${trackingData.tracking_number}`,
      order_id: dropshipOrderId
    });
  }

  async getDropshipProducts(filters?: {
    sourceId?: string;
    vendorId?: string;
    status?: string;
    category?: string;
  }): Promise<DropshipProduct[]> {
    let query = supabase
      .from('dropship_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.sourceId) {
      query = query.eq('source_id', filters.sourceId);
    }
    if (filters?.vendorId) {
      query = query.eq('vendor_id', filters.vendorId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getDropshipOrders(filters?: {
    sourceId?: string;
    status?: string;
  }): Promise<DropshipOrder[]> {
    let query = supabase
      .from('dropship_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.sourceId) {
      query = query.eq('source_id', filters.sourceId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}

export const dropshipService = new DropshipService();
