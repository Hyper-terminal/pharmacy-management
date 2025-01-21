import { Input } from '@/src/renderer/components/ui/Input';
import { useEffect, useState } from 'react';
import {
  Edit,
  Save,
  XCircle,
  Building2,
  Phone,
  Clock,
  UserCog,
  Receipt,
  Info,
} from 'lucide-react';
import { cn } from '@/src/renderer/lib/utils';
import { Button } from '@/src/renderer/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

type FormDataType = {
  [key: string]: string;
};

type FieldGroupsType = {
  [key: string]: {
    icon: React.ElementType;
    fields: Array<keyof FormDataType>;
  };
};

export default function Setting() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('Basic Information');
  const [formData, setFormData] = useState<FormDataType>({
    pharmacyName: 'Metro Pharmacy',
    licenseNumber: 'DL-12345-67890',
    gstNumber: '29ABCDE1234F1Z5',
    registrationNumber: 'REG-98765-43210',
    establishedYear: '2010',
    email: 'contact@metropharmacy.com',
    mobile: '+1 (555) 123-4567',
    landline: '+1 (555) 987-6543',
    website: 'www.metropharmacy.com',
    address: '123 Healthcare Street, Medical District\nNew York, NY 10001',
    weekdayHours: '9:00 AM - 9:00 PM',
    weekendHours: '10:00 AM - 6:00 PM',
    holidayHours: '10:00 AM - 2:00 PM',
    ownerName: 'John Smith',
    pharmacistName: 'Dr. Sarah Johnson',
    pharmacistLicense: 'PH-789-012345',
    panNumber: 'ABCDE1234F',
    bankName: 'National City Bank',
    accountNumber: '1234567890',
    ifscCode: 'NCB0001234',
    emergencyContact: '+1 (555) 000-9999',
    insurancePolicy: 'INS-567890',
    lastInspectionDate: '2024-01-15',
    nextInspectionDue: '2025-01-15',
  });

  const fieldGroups: FieldGroupsType = {
    'Basic Information': {
      icon: Building2,
      fields: [
        'pharmacyName',
        'licenseNumber',
        'gstNumber',
        'registrationNumber',
        'establishedYear',
      ],
    },
    'Contact Information': {
      icon: Phone,
      fields: ['email', 'mobile', 'landline', 'website', 'address'],
    },
    'Operating Hours': {
      icon: Clock,
      fields: ['weekdayHours', 'weekendHours', 'holidayHours'],
    },
    'Business Details': {
      icon: UserCog,
      fields: ['ownerName', 'pharmacistName', 'pharmacistLicense'],
    },
    'Tax & Financial': {
      icon: Receipt,
      fields: ['panNumber', 'bankName', 'accountNumber', 'ifscCode'],
    },
    'Additional Information': {
      icon: Info,
      fields: [
        'emergencyContact',
        'insurancePolicy',
        'lastInspectionDate',
        'nextInspectionDue',
      ],
    },
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    alert('in handle change ' + id + value);
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const formatFieldLabel = (key: string): string => {
    return String(key)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str: string) => str.toUpperCase());
  };
  const handleProfileupdate = async () => {
    try {
      const updateProfile = await window.electron.ipcRenderer.invoke(
        'update-profile',
        formData,
      );

      if (updateProfile) {
        alert('profile data updated successfully');
      } else {
        alert('profile data update failed');
      }
    } catch (error) {
      alert('profile data update failed');
    }
  };
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData =
          await window.electron.ipcRenderer.invoke('get-profile');
        console.log(profileData);
        setFormData({
          pharmacyName: profileData.pharmacyName,
          licenseNumber: profileData.LicenseNumber,
          gstNumber: profileData.GstNumber,
          registrationNumber: profileData.RegistrationNumber,
          establishedYear: String(profileData.EstablishedYear),
          email: profileData.email,
          mobile: profileData.mobile,
          landline: '', // Landline might not exist in the API response, leave it empty
          website: profileData.website,
          address: profileData.address,
          weekdayHours: profileData.timings, // Mapping timings to weekdayHours (or you can split it into weekday/weekend)
          weekendHours: '', // Leave empty if no separate weekend hours in the API
          holidayHours: '', // Leave empty if no separate holiday hours in the API
          ownerName: '', // If the API doesn't have an owner name, set it to empty
          pharmacistName: profileData.PharmacistName,
          pharmacistLicense: profileData.PharmacistLicense,
          panNumber: profileData.PanNumber,
          bankName: profileData.BankName,
          accountNumber: profileData.AccountNumber,
          ifscCode: profileData.IfscCode,
          emergencyContact: '', // No emergency contact in API, leave empty
          insurancePolicy: '', // No insurance policy in API, leave empty
          lastInspectionDate: profileData.LastInspection, // Assuming it's in 'YYYY-MM-DD' format
          nextInspectionDue: profileData.NextInspection, // Assuming it's in 'YYYY-MM-DD' format
        });
      } catch (error) {
        alert('some error occured while fetcing your profile');
      }
    };
    fetchProfileData();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-[1920px] mx-auto px-8 py-12">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
            Settings
          </h2>
          <Button
            variant={isEditing ? 'destructive' : 'default'}
            size="lg"
            onClick={() => setIsEditing(!isEditing)}
            className="px-8 transition-all duration-300 rounded-full"
          >
            {isEditing ? (
              <span className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Cancel
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit
              </span>
            )}
          </Button>
        </motion.div>

        <div className="grid grid-cols-[300px_1fr] gap-16">
          <motion.div layout className="space-y-1">
            {Object.entries(fieldGroups).map(([groupName, { icon: Icon }]) => (
              <motion.button
                key={groupName}
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab(groupName)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all',
                  activeTab === groupName
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-base font-medium">{groupName}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            layout
            className="p-12 bg-white shadow-sm dark:bg-gray-900 rounded-3xl"
          >
            <AnimatePresence mode="wait">
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                {fieldGroups[activeTab].fields.map((key, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.05 },
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {formatFieldLabel(key?.toString())}
                    </label>
                    {isEditing ? (
                      key === 'address' ? (
                        <textarea
                          id={key}
                          className="w-full min-h-[120px] rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
                          value={formData[key]}
                          onChange={handleChange}
                          placeholder={`Enter ${formatFieldLabel(key).toLowerCase()}`}
                        />
                      ) : (
                        <Input
                          id={key?.toString()}
                          type={
                            key?.toString()?.includes('Date') ? 'date' : 'text'
                          }
                          className="w-full h-12 text-base rounded-xl"
                          placeholder={`Enter ${formatFieldLabel(key?.toString()).toLowerCase()}`}
                          value={formData[key]}
                          onChange={handleChange}
                        />
                      )
                    ) : (
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {formData[key]}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        </div>

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-end mt-8"
            >
              <Button
                size="lg"
                className="px-12 py-6 text-lg text-white bg-blue-500 rounded-full hover:bg-blue-600"
                onClick={() => {
                  setIsEditing(false);
                  handleProfileupdate();
                }}
              >
                <motion.span
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </motion.span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
