import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/src/renderer/components/ui/Button';
import { PlusIcon, XIcon } from 'lucide-react';
import Billing from './components/Billing';
import { nanoid } from 'nanoid';

export default function BillingHomescreen() {
  const [billingTabs, setBillingTabs] = useState([
    { id: nanoid(), isActive: true },
  ]);

  /**
   * Adds a new billing tab to the list.
   * This function will set `isActive` to false on all existing tabs
   * and create a new tab with `isActive` set to true.
   */
  const addNewBillingTab = () => {
    setBillingTabs((prev) => [
      ...prev.map((tab) => ({ ...tab, isActive: false })),
      { id: nanoid(), isActive: true },
    ]);
  };

  /**
   * Switches the active tab to the tab with the given id.
   * This function will toggle the `isActive` property on all tabs.
   * @param id The id of the tab to switch to
   */
  const switchTab = (id: string) => {
    setBillingTabs((prev) =>
      prev.map((tab) => ({
        ...tab,
        isActive: tab.id === id,
      })),
    );
  };

  /**
   * Deletes a billing tab.
   * If the tab being deleted is the active tab, this function will
   * make the last tab active.
   * @param id The id of the tab to delete
   */
  const deleteTab = (id: string) => {
    setBillingTabs((prev) => {
      const filteredTabs = prev.filter((tab) => tab.id !== id);
      // If we're deleting the active tab, make the last tab active
      if (
        prev.find((tab) => tab.id === id)?.isActive &&
        filteredTabs.length > 0
      ) {
        filteredTabs[filteredTabs.length - 1].isActive = true;
      }
      return filteredTabs;
    });
  };

  return (
    <div className="flex flex-col h-full my-3">
      <div className="flex items-center gap-2 p-2 border-b">
        {billingTabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1"
          >
            <Button
              variant={tab.isActive ? 'default' : 'outline'}
              onClick={() => switchTab(tab.id)}
              className="px-4 py-2"
            >
              Bill #{tab.id.slice(0, 4)}
            </Button>
            {billingTabs.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTab(tab.id)}
                className="px-1 py-1 text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        ))}
        <Button variant="ghost" onClick={addNewBillingTab} className="px-2">
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1">
        {billingTabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <section className={!tab.isActive ? 'hidden' : ''}>
              <Billing />
            </section>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
