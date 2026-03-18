import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, X, Home, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Sample addresses
const initialAddresses = [
  {
    id: 'addr-1',
    label: 'Home',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 123-4567',
    addressLine1: '123 Luxury Lane',
    addressLine2: '',
    city: 'Beverly Hills',
    state: 'CA',
    postalCode: '90210',
    country: 'United States',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 987-6543',
    addressLine1: '456 Business Boulevard',
    addressLine2: 'Suite 100',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'United States',
    isDefault: false,
  },
];

export default function Addresses() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: 'Home',
    firstName: '',
    lastName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
  });

  const resetForm = () => {
    setFormData({
      label: 'Home',
      firstName: '',
      lastName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: false,
    });
  };

  const handleAdd = () => {
    const newAddress = {
      ...formData,
      id: `addr-${Date.now()}`,
    };

    if (newAddress.isDefault) {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
      );
    } else {
      setAddresses((prev) => [...prev, newAddress]);
    }

    setIsAdding(false);
    resetForm();
    toast.success('Address added successfully');
  };

  const handleEdit = (id: string) => {
    const address = addresses.find((a) => a.id === id);
    if (address) {
      setFormData(address);
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (!editingId) return;

    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === editingId) {
          return { ...formData, id: editingId };
        }
        if (formData.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );

    setEditingId(null);
    resetForm();
    toast.success('Address updated successfully');
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success('Address deleted');
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success('Default address updated');
  };

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home':
        return Home;
      case 'office':
      case 'work':
        return Briefcase;
      default:
        return MapPin;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl text-white mb-2">My Addresses</h1>
              <p className="text-white/60">Manage your shipping addresses</p>
            </div>
            {!isAdding && !editingId && (
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-gold text-black hover:bg-gold-light"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            )}
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingId) && (
            <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/5">
              <h3 className="font-display text-xl text-white mb-6">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white/60">Address Label</Label>
                  <select
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">First Name</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-white/60">Address Line 1</Label>
                  <Input
                    value={formData.addressLine1}
                    onChange={(e) =>
                      setFormData({ ...formData, addressLine1: e.target.value })
                    }
                    placeholder="Street address"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-white/60">Address Line 2 (Optional)</Label>
                  <Input
                    value={formData.addressLine2}
                    onChange={(e) =>
                      setFormData({ ...formData, addressLine2: e.target.value })
                    }
                    placeholder="Apartment, suite, etc."
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">State</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Postal Code</Label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Country</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) =>
                        setFormData({ ...formData, isDefault: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold"
                    />
                    <span className="text-white/60">Set as default address</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="bg-gold text-black hover:bg-gold-light"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? 'Update' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Address List */}
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => {
              const LabelIcon = getLabelIcon(address.label);
              return (
                <div
                  key={address.id}
                  className={`p-6 rounded-lg border ${
                    address.isDefault
                      ? 'border-gold bg-gold/5'
                      : 'border-white/5 bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          address.isDefault ? 'bg-gold/20' : 'bg-white/10'
                        }`}
                      >
                        <LabelIcon
                          className={`w-5 h-5 ${
                            address.isDefault ? 'text-gold' : 'text-white/60'
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{address.label}</h4>
                        {address.isDefault && (
                          <span className="text-gold text-xs">Default</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(address.id)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-white/60" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 hover:bg-red-500/10 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-white/60 text-sm">
                    <p>
                      {address.firstName} {address.lastName}
                    </p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    <p className="pt-2">{address.phone}</p>
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="mt-4 text-gold text-sm hover:text-gold-light transition-colors"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
