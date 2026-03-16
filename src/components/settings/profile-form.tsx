'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Upload } from 'lucide-react';

interface ProfileFormProps {
  profile: {
    display_name: string;
    email: string;
    avatar_url: string | null;
  };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);

  const handleSave = async () => {
    if (!displayName.trim() || displayName.length > 50) {
      alert('Display name must be 1-50 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      // This would be a server action or API call
      // For now, just show success
      alert('Profile updated');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white mb-6">Profile</h2>

      <div className="space-y-6">
        {/* Avatar */}
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <p className="text-xs text-white/60 mt-2">JPG or PNG. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
            Display Name
          </label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-[var(--color-surface-input)] border-[var(--color-border)] text-white"
            placeholder="Your display name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
            Email Address
          </label>
          <div className="relative">
            <Input
              value={profile.email}
              disabled
              className="bg-[var(--color-surface-input)] border-[var(--color-border)] text-white/40 pr-10"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          </div>
        </div>

        {/* Save Button */}
        <div>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white font-semibold"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
