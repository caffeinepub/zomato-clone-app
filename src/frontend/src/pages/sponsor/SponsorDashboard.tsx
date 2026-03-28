import { Eye, MousePointer, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { SAMPLE_USERS } from "../../data/sampleData";

export function SponsorDashboard() {
  const { currentUser, campaigns, addCampaign, login } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    targetCategory: "",
    budget: "",
    startDate: "",
    endDate: "",
  });

  const myCampaigns = campaigns.filter((c) => c.sponsorId === currentUser?.id);
  const totalImpressions = myCampaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = myCampaigns.reduce((s, c) => s + c.clicks, 0);
  const totalSpend = myCampaigns.reduce((s, c) => s + c.budget, 0);

  const handleSubmit = () => {
    if (!form.title) return;
    addCampaign({
      sponsorId: currentUser!.id,
      title: form.title,
      targetCategory: form.targetCategory,
      budget: Number(form.budget) || 0,
      isActive: true,
      startDate: form.startDate,
      endDate: form.endDate,
    });
    setForm({
      title: "",
      targetCategory: "",
      budget: "",
      startDate: "",
      endDate: "",
    });
    setShowForm(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white/80 text-xs">Sponsor Panel</p>
            <h2 className="text-white font-bold text-lg">
              {currentUser?.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              login(SAMPLE_USERS.find((u) => u.role === "customer")!)
            }
            className="text-white/80 text-xs bg-white/20 px-3 py-1.5 rounded-full"
          >
            Switch Role
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: "Impressions",
              value: totalImpressions.toLocaleString(),
              icon: Eye,
            },
            {
              label: "Clicks",
              value: totalClicks.toLocaleString(),
              icon: MousePointer,
            },
            {
              label: "Total Spend",
              value: `₹${totalSpend.toLocaleString()}`,
              icon: TrendingUp,
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white/15 rounded-2xl p-3 text-center"
              >
                <Icon size={16} className="text-white/70 mx-auto mb-1" />
                <p className="text-white font-bold">{s.value}</p>
                <p className="text-white/70 text-[10px]">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="w-full mb-4 border-2 border-dashed border-purple-300 text-purple-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-50"
        >
          <Plus size={18} /> Create Campaign
        </button>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
            <p className="font-semibold text-gray-900 mb-3">New Campaign</p>
            <input
              placeholder="Campaign Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mb-2 text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
            />
            <input
              placeholder="Target Category"
              value={form.targetCategory}
              onChange={(e) =>
                setForm({ ...form, targetCategory: e.target.value })
              }
              className="w-full mb-2 text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
            />
            <input
              type="number"
              placeholder="Budget (₹)"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full mb-2 text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
            />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
              />
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl text-sm"
            >
              Launch Campaign
            </button>
          </div>
        )}

        <h3 className="font-bold text-gray-900 mb-3">My Campaigns</h3>
        <div className="space-y-3">
          {myCampaigns.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50"
            >
              <div className="flex justify-between mb-2">
                <p className="font-semibold text-gray-900">{c.title}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {c.isActive ? "Active" : "Ended"}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Target: {c.targetCategory} • Budget: ₹
                {c.budget.toLocaleString()}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-500">Impressions</p>
                  <p className="font-bold text-purple-700">
                    {c.impressions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-500">Clicks</p>
                  <p className="font-bold text-blue-700">
                    {c.clicks.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
