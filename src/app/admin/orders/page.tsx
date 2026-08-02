"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from "lucide-react";
import { formatPrice } from "@/lib/price";

interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  referenceId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  totalAmount: number;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("PAID");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setOrders(
          orders.map((o) => (o.id === id ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders(orders.filter((o) => o.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "ALL") return true;
    return o.status === statusFilter;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "FAILED":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-white/10 text-white/60 border border-white/5";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif tracking-wide mb-1 text-white">Orders</h1>
          <p className="text-sm text-white/40">Manage customers' online Wayl payments and order delivery logs.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex bg-white/[0.02] border border-white/5 rounded-lg p-1 self-start sm:self-auto">
          {["PAID", "PENDING", "FAILED", "ALL"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === filter
                  ? "bg-[#d49f37] text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-[#d49f37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center">
          <ShoppingBag size={40} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/60 mb-2">No orders found</p>
          <p className="text-xs text-white/30">Orders placed through Wayl checkout will show up here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div
                key={order.id}
                className="bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors rounded-2xl overflow-hidden"
              >
                {/* Header Summary */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-0.5">Customer</span>
                      <span className="font-semibold text-white text-sm">{order.customerName}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-0.5">Phone & City</span>
                      <span className="text-white/80 text-sm block">{order.phone}</span>
                      <span className="text-white/50 text-xs">{order.city}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-0.5">Total & Date</span>
                      <span className="font-bold text-[#d49f37] text-sm block">
                        {formatPrice(order.totalAmount, "en")}
                      </span>
                      <span className="text-white/40 text-[10px]">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(order.id);
                      }}
                      className="p-2 text-white/40 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-black/20 p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Customer Info */}
                      <div className="space-y-4 lg:col-span-2">
                        <h3 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Delivery Information</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                            <MapPin className="text-[#d49f37] shrink-0 mt-0.5" size={16} />
                            <div>
                              <span className="text-[10px] text-white/30 block mb-1">Full Shipping Address</span>
                              <span className="text-sm text-white/80 leading-relaxed block">{order.address}</span>
                              <span className="text-xs text-white/40 block mt-1">{order.city}, Iraq</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 p-3.5 rounded-xl">
                              <Phone className="text-[#d49f37] shrink-0" size={16} />
                              <div>
                                <span className="text-[10px] text-white/30 block">Phone</span>
                                <span className="text-sm text-white/80">{order.phone}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 p-3.5 rounded-xl">
                              <AlertCircle className="text-[#d49f37] shrink-0" size={16} />
                              <div>
                                <span className="text-[10px] text-white/30 block">Reference ID (Wayl)</span>
                                <span className="text-xs font-mono text-white/60">{order.referenceId}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Update Status</h3>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <button
                              onClick={() => handleUpdateStatus(order.id, "PAID")}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-all"
                            >
                              <CheckCircle2 size={14} />
                              <span>Mark PAID</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id, "FAILED")}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                            >
                              <XCircle size={14} />
                              <span>Mark FAILED</span>
                            </button>
                          </div>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "PENDING")}
                            className="w-full py-2 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-white/80 transition-all"
                          >
                            Reset to PENDING
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="flex items-center justify-center gap-2 mt-6 w-full py-2.5 rounded-lg text-xs bg-red-900/10 border border-red-900/30 text-red-400 hover:bg-red-900/25 transition-all"
                        >
                          <Trash2 size={14} />
                          <span>Delete Order History</span>
                        </button>
                      </div>
                    </div>

                    {/* Items Section */}
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Order Items</h3>
                      <div className="border border-white/5 rounded-xl overflow-hidden bg-black/30">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider bg-white/[0.01]">
                              <th className="p-4">Item Name</th>
                              <th className="p-4 text-right">Unit Price</th>
                              <th className="p-4 text-center">Qty</th>
                              <th className="p-4 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.id} className="border-b border-white/5 last:border-0 text-white/80 hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 font-medium">{item.productName}</td>
                                <td className="p-4 text-right">{formatPrice(item.price, "en")}</td>
                                <td className="p-4 text-center font-mono">{item.quantity}</td>
                                <td className="p-4 text-right font-bold text-white">
                                  {formatPrice(item.price * item.quantity, "en")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
