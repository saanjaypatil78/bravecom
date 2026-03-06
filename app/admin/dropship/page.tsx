'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Truck, 
  RefreshCw, 
  Plus, 
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Link2,
  Clock,
  DollarSign
} from 'lucide-react';

interface DropshipStats {
  totalProducts: number;
  totalOrders: number;
  activeSources: number;
  lowStockProducts: number;
}

interface DropshipSource {
  id: string;
  name: string;
  source_type: string;
  api_endpoint: string;
  is_active: boolean;
  status: string;
  last_sync_at: string;
  last_sync_status: string;
  created_at: string;
}

interface DropshipProduct {
  id: string;
  source_id: string;
  name: string;
  source_product_id: string;
  source_price: number;
  cost_price: number;
  selling_price: number;
  source_stock: number;
  local_stock: number;
  status: string;
  category: string;
  main_image: string;
  created_at: string;
}

interface DropshipOrder {
  id: string;
  local_order_id: string;
  dropship_product_id: string;
  supplier_order_id: string;
  tracking_number: string;
  quantity: number;
  total_cost: number;
  status: string;
  customer_name: string;
  created_at: string;
}

interface SyncLog {
  id: string;
  source_id: string;
  sync_type: string;
  status: string;
  products_total: number;
  products_updated: number;
  products_out_of_stock: number;
  started_at: string;
  completed_at: string;
  error_message: string;
}

type TabType = 'dashboard' | 'sources' | 'products' | 'orders' | 'price-rules' | 'settings';

export default function DropshipAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<DropshipStats | null>(null);
  const [sources, setSources] = useState<DropshipSource[]>([]);
  const [products, setProducts] = useState<DropshipProduct[]>([]);
  const [orders, setOrders] = useState<DropshipOrder[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddSource, setShowAddSource] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const fetchData = useCallback(async (type: string, params?: Record<string, string>) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ type });
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }
      
      const response = await fetch(`/api/dropship?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (!text) {
        console.warn('Empty response received');
        return;
      }
      const data = JSON.parse(text);
      
      if (data.stats) setStats(data.stats);
      if (data.sources) setSources(data.sources);
      if (data.products) setProducts(data.products);
      if (data.orders) setOrders(data.orders);
      if (data.logs) setSyncLogs(data.logs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeTab === 'dashboard' ? 'stats' : activeTab, 
      activeTab !== 'dashboard' && selectedSource ? { sourceId: selectedSource } : undefined
    );
  }, [activeTab, selectedSource, fetchData]);

  const handleAddSource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const response = await fetch('/api/dropship?action=add-source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        sourceType: formData.get('sourceType'),
        apiEndpoint: formData.get('apiEndpoint'),
        config: {}
      })
    });
    
    if (!response.ok) {
      console.error('Failed to add source');
      return;
    }
    
    setShowAddSource(false);
    fetchData('sources');
  };

  const handleSync = async (sourceId?: string) => {
    setLoading(true);
    try {
      const url = sourceId 
        ? `/api/dropship?action=sync-inventory&sourceId=${sourceId}`
        : `/api/dropship?action=sync-inventory`;
      
      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }
      fetchData('dashboard');
      fetchData('sync-logs');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'LISTED':
      case 'COMPLETED':
      case 'DELIVERED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
      case 'PROCESSING':
        return 'text-yellow-600 bg-yellow-100';
      case 'OUT_OF_STOCK':
      case 'FAILED':
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!filterStatus || p.status === filterStatus)
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'sources', label: 'Sources', icon: Link2 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: Truck },
    { id: 'price-rules', label: 'Pricing', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Dropship Hub</h1>
            <p className="text-sm text-gray-500">Multi-source Management</p>
          </div>
          
          <nav className="p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <button
                  onClick={() => handleSync()}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Sync All Sources
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Products</p>
                      <p className="text-3xl font-bold text-gray-800">{stats?.totalProducts || 0}</p>
                    </div>
                    <Package className="w-10 h-10 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Orders</p>
                      <p className="text-3xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
                    </div>
                    <Truck className="w-10 h-10 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Sources</p>
                      <p className="text-3xl font-bold text-gray-800">{stats?.activeSources || 0}</p>
                    </div>
                    <Link2 className="w-10 h-10 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Low Stock</p>
                      <p className="text-3xl font-bold text-red-600">{stats?.lowStockProducts || 0}</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Recent Sync History</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {syncLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {log.status === 'COMPLETED' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {log.sync_type} sync
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(log.started_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {log.products_updated}/{log.products_total} products
                        </p>
                        <p className={`text-xs ${log.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'}`}>
                          {log.status}
                        </p>
                      </div>
                    </div>
                  ))}
                  {syncLogs.length === 0 && (
                    <p className="p-4 text-center text-gray-500">No sync history yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Dropship Sources</h2>
                <button
                  onClick={() => setShowAddSource(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Source
                </button>
              </div>

              {showAddSource && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Add New Source</h3>
                  <form onSubmit={handleAddSource} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
                        <input
                          name="name"
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., AliExpress USA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
                        <select
                          name="sourceType"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="aliexpress">AliExpress</option>
                          <option value="custom">Custom API</option>
                          <option value="csv">CSV Import</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
                      <input
                        name="apiEndpoint"
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://api.example.com/v1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add Source
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddSource(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map(source => (
                  <div key={source.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{source.name}</h3>
                        <p className="text-sm text-gray-500">{source.source_type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                        {source.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 truncate">{source.api_endpoint}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">
                          Last sync: {source.last_sync_at ? new Date(source.last_sync_at).toLocaleString() : 'Never'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSync(source.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Sync Now"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                          title="Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {sources.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    No dropship sources configured
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Imported Products</h2>
                <div className="flex gap-2">
                  <select
                    value={selectedSource || ''}
                    onChange={(e) => setSelectedSource(e.target.value || null)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Sources</option>
                    {sources.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Status</option>
                    <option value="LISTED">Listed</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.main_image ? (
                          <img src={product.main_image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{product.name}</h4>
                        <p className="text-sm text-gray-500">ID: {product.source_product_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">₹{product.selling_price}</p>
                        <p className="text-sm text-gray-500">Cost: ₹{product.cost_price}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${product.local_stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.local_stock} in stock
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <p className="p-8 text-center text-gray-500">No products found</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Dropship Orders</h2>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Qty</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cost</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tracking</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.filter(o => !filterStatus || o.status === filterStatus).map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {order.supplier_order_id || order.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{order.customer_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{order.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">${order.total_cost}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {order.tracking_number ? (
                            <a href={order.tracking_number} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {order.tracking_number.slice(0, 12)}...
                            </a>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <p className="p-8 text-center text-gray-500">No orders yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'price-rules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Pricing Rules</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-gray-500 text-center py-8">
                  Configure automatic pricing rules for dropship products.
                  Rules are applied in priority order (highest first).
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
