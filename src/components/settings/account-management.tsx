'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function AccountManagement() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleDeleteRequest = () => {
    if (deleteInput.toUpperCase() === 'DELETE') {
      alert('Account deletion requested. This feature is coming soon.');
      setShowDeleteConfirm(false);
      setDeleteInput('');
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-6">Account</h2>

      <div className="space-y-6">
        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          Sign Out
        </Button>

        {/* Danger Zone */}
        <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
          <p className="text-white/60 text-sm mb-4">
            Deleting your account is permanent and cannot be undone. All your campaigns,
            characters, and data will be lost.
          </p>

          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="border-red-500 border text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              Request Deletion
            </Button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Type DELETE to confirm"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value.toUpperCase())}
                className="w-full bg-[#16161f] border border-white/10 text-white rounded-lg px-3 py-2 placeholder:text-white/40"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleDeleteRequest}
                  disabled={deleteInput !== 'DELETE'}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  Confirm Deletion
                </Button>
                <Button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteInput('');
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
