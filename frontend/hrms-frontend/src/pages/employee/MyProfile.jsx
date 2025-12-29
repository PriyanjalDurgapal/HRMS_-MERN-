import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMyProfile, updateProfileField } from "../../services/profileApi";
import { getFileUrl } from "../../util/file";

const tabs = ["Profile Information", "Leave Summary", "Edit Profile"];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchMyProfile();
        const data = response.data;
        setProfile(data);
        setFormData({
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await updateProfileField(formData);
      alert("Profile updated successfully");
      // Refresh profile data
      const response = await fetchMyProfile();
      setProfile(response.data);
      setActiveTab(tabs[0]);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        No profile data available
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start sm:gap-8">
          <div className="relative">
            <img
              src={getFileUrl(profile.profilePic) || "/default-avatar.png"}
              alt={`${profile.name}'s profile`}
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl transition-transform hover:scale-105"
            />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <p className="mt-1 text-lg font-medium text-gray-600">{profile.designation}</p>
            <p className="mt-1 text-gray-500">{profile.department}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 overflow-hidden rounded-xl bg-white shadow">
        <nav className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 whitespace-nowrap px-6 py-4 text-center text-sm font-medium transition-colors sm:flex-none sm:px-8 ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "Profile Information" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[
                  { label: "Employee ID", value: profile.employeeId },
                  { label: "Role", value: profile.role },
                  { label: "Email", value: profile.email },
                  { label: "Phone", value: profile.phone },
                  { label: "Date of Joining", value: profile.dateOfJoining },
                  { label: "Employment Type", value: profile.employmentType },
                  { label: "Salary", value: profile.salary },
                  { label: "Bank Account", value: profile.bankAccount },
                  { label: "IFSC Code", value: profile.ifscCode },
                  { label: "PAN", value: profile.pan },
                  { label: "Aadhaar", value: profile.aadhaar },
                  { label: "Reporting Manager", value: profile.reportingManager },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                    <dd className="text-base font-medium text-gray-900">{item.value || "—"}</dd>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "Leave Summary" && (
              <motion.div
                key="leave"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
              >
                {Object.entries(profile.leaveBalance || {}).map(([type, total]) => {
                  const used = profile.usedLeave?.[type] || 0;
                  const remaining = total - used;

                  return (
                    <div
                      key={type}
                      className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <h3 className="mb-3 text-lg font-semibold capitalize text-gray-800">
                        {type} Leave
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium text-gray-600">Total:</span>{" "}
                          {total}
                        </p>
                        <p>
                          <span className="font-medium text-gray-600">Used:</span>{" "}
                          {used}
                        </p>
                        <p>
                          <span className="font-medium text-gray-600">Remaining:</span>{" "}
                          <span
                            className={
                              remaining > 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            {remaining}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === "Edit Profile" && (
              <motion.form
                key="edit"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;