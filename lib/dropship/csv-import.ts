import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CSVProduct {
  source_product_id: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  price?: string;
  stock?: string;
  sku?: string;
  images?: string;
  weight?: string;
}

interface ImportResult {
  success: boolean;
  imported: number;
  updated: number;
  failed: number;
  errors: string[];
}

export class CSVImportService {
  private defaultMapping = {
    source_product_id: 'id',
    name: 'title',
    description: 'description',
    category: 'category',
    brand: 'brand',
    price: 'price',
    stock: 'stock',
    sku: 'sku',
    images: 'images',
    weight: 'weight'
  };

  async processCSV(
    csvContent: string,
    sourceId: string,
    options: {
      mapping?: Record<string, string>;
      updateExisting?: boolean;
      autoPublish?: boolean;
    } = {}
  ): Promise<ImportResult> {
    const mapping = options.mapping || this.defaultMapping;
    const updateExisting = options.updateExisting ?? true;
    const autoPublish = options.autoPublish ?? false;

    const result: ImportResult = {
      success: true,
      imported: 0,
      updated: 0,
      failed: 0,
      errors: []
    };

    return new Promise((resolve) => {
      Papa.parse<CSVProduct>(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const totalRows = results.data.length;
          
          // Create import log
          const { data: importLog, error: logError } = await supabase
            .from('dropship_csv_imports')
            .insert({
              source_id: sourceId,
              total_rows: totalRows,
              mapping_config: mapping,
              update_existing: updateExisting,
              auto_publish: autoPublish,
              status: 'processing',
              started_at: new Date().toISOString()
            })
            .select()
            .single();

          if (logError) {
            result.success = false;
            result.errors.push('Failed to create import log: ' + logError.message);
            resolve(result);
            return;
          }

          for (let i = 0; i < results.data.length; i++) {
            const row = results.data[i];
            
            try {
              // Map CSV columns to product fields
              const productData = this.mapRowToProduct(row, mapping);
              
              if (!productData.source_product_id || !productData.name) {
                result.failed++;
                result.errors.push(`Row ${i + 1}: Missing required fields (id, name)`);
                continue;
              }

              // Check if product exists
              const { data: existing } = await supabase
                .from('dropship_products')
                .select('id')
                .eq('source_id', sourceId)
                .eq('source_product_id', productData.source_product_id)
                .single();

              if (existing) {
                if (updateExisting) {
                  await supabase
                    .from('dropship_products')
                    .update({
                      name: productData.name,
                      description: productData.description,
                      category: productData.category,
                      brand: productData.brand,
                      source_price: productData.price,
                      source_stock: productData.stock,
                      sku: productData.sku,
                      images: productData.images,
                      weight: productData.weight,
                      status: autoPublish ? 'LISTED' : 'IMPORTED',
                      last_sync_at: new Date().toISOString(),
                      sync_status: 'COMPLETED',
                      updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id);
                  
                  result.updated++;
                } else {
                  result.skipped++;
                }
              } else {
                // Calculate selling price (default 20% margin)
                const sellingPrice = productData.price 
                  ? productData.price * 1.2 
                  : 0;

                await supabase
                  .from('dropship_products')
                  .insert({
                    source_id: sourceId,
                    source_product_id: productData.source_product_id,
                    name: productData.name,
                    description: productData.description,
                    category: productData.category,
                    brand: productData.brand,
                    source_price: productData.price || 0,
                    cost_price: productData.price || 0,
                    selling_price: sellingPrice,
                    source_stock: productData.stock || 0,
                    local_stock: productData.stock || 0,
                    sku: productData.sku,
                    images: productData.images || [],
                    main_image: productData.images?.[0] || null,
                    weight: productData.weight,
                    status: autoPublish ? 'LISTED' : 'IMPORTED',
                    last_sync_at: new Date().toISOString(),
                    sync_status: 'COMPLETED'
                  });
                
                result.imported++;
              }
            } catch (error: any) {
              result.failed++;
              result.errors.push(`Row ${i + 1}: ${error.message}`);
            }
          }

          // Update import log
          await supabase
            .from('dropship_csv_imports')
            .update({
              status: result.failed === totalRows ? 'failed' : 'completed',
              imported_rows: result.imported,
              updated_rows: result.updated,
              failed_rows: result.failed,
              skipped_rows: result.skipped,
              completed_at: new Date().toISOString(),
              error_log: result.errors.slice(0, 100) // Limit errors stored
            })
            .eq('id', importLog.id);

          resolve(result);
        },
        error: (error) => {
          result.success = false;
          result.errors.push('CSV Parse Error: ' + error.message);
          resolve(result);
        }
      });
    });
  }

  private mapRowToProduct(
    row: CSVProduct,
    mapping: Record<string, string>
  ): {
    source_product_id: string;
    name: string;
    description?: string;
    category?: string;
    brand?: string;
    price?: number;
    stock?: number;
    sku?: string;
    images?: string[];
    weight?: number;
  } {
    const getValue = (field: string): any => {
      const col = mapping[field];
      return col ? row[col as keyof CSVProduct] : undefined;
    };

    const parseNumber = (val: any): number | undefined => {
      if (!val) return undefined;
      const num = parseFloat(val.toString().replace(/[^0-9.-]/g, ''));
      return isNaN(num) ? undefined : num;
    };

    const parseImages = (val: any): string[] | undefined => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        return val.split(/[,;|]/).map(s => s.trim()).filter(Boolean);
      }
      return undefined;
    };

    return {
      source_product_id: getValue('source_product_id')?.toString(),
      name: getValue('name')?.toString(),
      description: getValue('description')?.toString(),
      category: getValue('category')?.toString(),
      brand: getValue('brand')?.toString(),
      price: parseNumber(getValue('price')),
      stock: parseNumber(getValue('stock')),
      sku: getValue('sku')?.toString(),
      images: parseImages(getValue('images')),
      weight: parseNumber(getValue('weight'))
    };
  }

  async getImportHistory(sourceId?: string, limit = 20) {
    let query = supabase
      .from('dropship_csv_imports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (sourceId) {
      query = query.eq('source_id', sourceId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  getSampleCSV(): string {
    return `id,title,description,category,brand,price,stock,sku,images,weight
PROD001,Wireless Earbuds Pro,High quality wireless earbuds with noise cancellation,Electronics,Sony,49.99,100,WB-PRO-001,"https://example.com/earbud1.jpg,https://example.com/earbud2.jpg",0.2
PROD002,Smart Watch Series 5,Advanced smartwatch with health monitoring,Electronics,Apple,199.99,50,SW-005,"https://example.com/watch.jpg",0.3`;
  }

  getCSVTemplate(): string {
    return `source_product_id,name,description,category,brand,price,stock,sku,images,weight
YOUR_PRODUCT_ID,Product Name,Product description,Category,Brand,10.99,100,SKU001,"image1.jpg,image2.jpg",0.5`;
  }
}

export const csvImportService = new CSVImportService();
