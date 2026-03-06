#!/usr/bin/env node

/**
 * Dropship Inventory Sync Scheduler
 * Runs periodic inventory sync with dropshipping suppliers
 * 
 * Usage:
 *   node scripts/dropship-sync.js              # Sync all active sources
 *   node scripts/dropship-sync.js <sourceId>  # Sync specific source
 *   node scripts/dropship-sync.js --watch     # Watch mode (run every hour)
 * 
 * Cron setup (optional):
 *   0 * * * * /path/to/node /path/to/scripts/dropship-sync.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SYNC_INTERVAL_HOURS = 1;
const BATCH_SIZE = 100;

async function getActiveSources() {
  const { data, error } = await supabase
    .from('dropship_sources')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'ACTIVE');

  if (error) throw error;
  return data || [];
}

async function getSourceProducts(sourceId, offset = 0, limit = BATCH_SIZE) {
  const { data, error } = await supabase
    .from('dropship_products')
    .select('id, source_product_id, source_price, name')
    .eq('source_id', sourceId)
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

async function fetchInventoryFromAPI(source) {
  if (!source.api_endpoint) {
    console.log(`  Source ${source.name} has no API endpoint configured`);
    return [];
  }

  try {
    const response = await fetch(`${source.api_endpoint}/products/inventory`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${source.config?.api_key || ''}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`  Failed to fetch from ${source.name}:`, error.message);
    return null;
  }
}

async function updateProductInventory(productId, inventory) {
  const { error } = await supabase
    .from('dropship_products')
    .update({
      source_stock: inventory.stock,
      local_stock: inventory.stock,
      source_price: inventory.price,
      last_sync_at: new Date().toISOString(),
      sync_status: 'COMPLETED',
      status: inventory.stock > 0 ? 'LISTED' : 'OUT_OF_STOCK'
    })
    .eq('id', productId);

  return !error;
}

async function createSyncLog(sourceId, stats) {
  const { error } = await supabase
    .from('dropship_inventory_sync_log')
    .insert({
      source_id: sourceId,
      sync_type: 'scheduled',
      status: stats.errors.length > 0 ? 'FAILED' : 'COMPLETED',
      products_total: stats.total,
      products_updated: stats.updated,
      products_failed: stats.errors.length,
      products_out_of_stock: stats.outOfStock,
      started_at: stats.startedAt,
      completed_at: new Date().toISOString(),
      duration_seconds: Math.floor((Date.now() - stats.startedAt.getTime()) / 1000),
      error_message: stats.errors.length > 0 ? stats.errors.slice(0, 5).join('; ') : null
    });

  if (error) console.error('Failed to create sync log:', error);
}

async function syncSource(source) {
  console.log(`\n📦 Syncing source: ${source.name} (${source.source_type})`);
  console.log(`   API: ${source.api_endpoint || 'Not configured'}`);

  const startedAt = new Date();
  const stats = {
    total: 0,
    updated: 0,
    outOfStock: 0,
    errors: [],
    startedAt
  };

  try {
    await supabase
      .from('dropship_sources')
      .update({
        last_sync_at: startedAt.toISOString(),
        last_sync_status: 'IN_PROGRESS'
      })
      .eq('id', source.id);

    const inventory = await fetchInventoryFromAPI(source);
    
    if (!inventory) {
      await supabase
        .from('dropship_sources')
        .update({
          last_sync_status: 'ERROR',
          status: 'ERROR'
        })
        .eq('id', source.id);
      
      stats.errors.push('Failed to fetch inventory from API');
      await createSyncLog(source.id, stats);
      return stats;
    }

    const inventoryMap = new Map(
      inventory.map(item => [item.product_id, item])
    );

    let offset = 0;
    let products;

    do {
      products = await getSourceProducts(source.id, offset, BATCH_SIZE);
      stats.total += products.length;

      for (const product of products) {
        const inv = inventoryMap.get(product.source_product_id);

        if (inv) {
          const success = await updateProductInventory(product.id, inv);
          
          if (success) {
            stats.updated++;
            if (inv.stock === 0) stats.outOfStock++;
          } else {
            stats.errors.push(`Failed to update ${product.source_product_id}`);
          }
        }
      }

      offset += BATCH_SIZE;
    } while (products.length === BATCH_SIZE);

    await supabase
      .from('dropship_sources')
      .update({
        last_sync_at: new Date().toISOString(),
        last_sync_status: 'COMPLETED',
        status: 'ACTIVE'
      })
      .eq('id', source.id);

    console.log(`   ✅ Synced ${stats.updated}/${stats.total} products`);
    if (stats.outOfStock > 0) {
      console.log(`   ⚠️ ${stats.outOfStock} products out of stock`);
    }

  } catch (error) {
    console.error(`   ❌ Sync failed:`, error.message);
    stats.errors.push(error.message);
    
    await supabase
      .from('dropship_sources')
      .update({
        last_sync_status: 'ERROR',
        status: 'ERROR'
      })
      .eq('id', source.id);
  }

  await createSyncLog(source.id, stats);
  return stats;
}

async function runSync(sourceId = null) {
  console.log('🚀 Starting Dropship Inventory Sync');
  console.log('⏰ Started at:', new Date().toISOString());

  try {
    const sources = sourceId 
      ? [await supabase.from('dropship_sources').select('*').eq('id', sourceId).single()]
      : await getActiveSources();

    const sourcesData = sources.data || [sources];
    const results = [];

    for (const source of sourcesData) {
      if (source) {
        const stats = await syncSource(source);
        results.push({ source: source.name, stats });
      }
    }

    const totalUpdated = results.reduce((sum, r) => sum + r.stats.updated, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.stats.errors.length, 0);

    console.log('\n📊 Sync Summary:');
    console.log(`   Total sources: ${results.length}`);
    console.log(`   Total products updated: ${totalUpdated}`);
    console.log(`   Total errors: ${totalErrors}`);

    if (totalErrors > 0) {
      console.log('\n⚠️ Errors:');
      results.forEach(r => {
        r.stats.errors.forEach(e => console.log(`   - ${r.source}: ${e}`));
      });
    }

    console.log('\n✅ Sync completed at:', new Date().toISOString());
    
    return { success: true, results };
  } catch (error) {
    console.error('❌ Sync failed:', error);
    return { success: false, error: error.message };
  }
}

async function watch() {
  console.log('👀 Starting watch mode (sync every hour)');
  
  await runSync();
  
  setInterval(async () => {
    console.log('\n🔄 Scheduled sync triggered');
    await runSync();
  }, SYNC_INTERVAL_HOURS * 60 * 60 * 1000);
}

const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watch();
} else if (args[0]) {
  runSync(args[0]);
} else {
  runSync();
}
