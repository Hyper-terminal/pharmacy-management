
import { Input } from "@/src/renderer/components/ui/Input";
import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Save, XCircle } from 'lucide-react'; // Importing Lucide icons

export default function Setting() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    pharmacyName: "Metro Pharmacy",
    licenseNumber: "DL-12345-67890",
    email: "contact@metropharmacy.com",
    mobile: "+1 (555) 123-4567",
    address: "123 Healthcare Street, Medical District\nNew York, NY 10001",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate a save operation
    setTimeout(() => {
      setIsEditing(false);
      setIsLoading(false);
      alert("Changes saved successfully!");
    }, 1000);
  };

  return (
    <motion.div
      className="flex-col max-w-full flex-1 h-full p-8 space-y-8 md:flex"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Pharmacy Settings</h2>
          <motion.button
            className="flex items-center"
            onClick={() => setIsEditing(!isEditing)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isEditing ? (
              <>
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="h-5 w-5 mr-2 text-blue-500" />
                Edit
              </>
            )}
          </motion.button>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div className="grid gap-6">
            {Object.entries(formData).map(([key, value]) => (
              <motion.div
                className="grid gap-2"
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-sm font-medium leading-none text-muted-foreground">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                {isEditing ? (
                  key === "address" ? (
                    <textarea
                      id={key}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={3}
                      value={value}
                      onChange={handleChange}
                      placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    />
                  ) : (
                    <Input
                      id={key}
                      placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      value={value}
                      onChange={handleChange}
                    />
                  )
                ) : (
                  <p className="text-base">{value}</p>
                )}
              </motion.div>
            ))}
          </div>

          {isEditing && (
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isLoading ? (
                  <>
                    <Save className="h-5 w-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2 text-green-500" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
