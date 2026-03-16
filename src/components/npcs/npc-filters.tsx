'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NPC_ROLES, NPC_ROLE_LABELS } from '@/lib/validations/npc';

interface NpcFiltersProps {
  onSearch: (q: string) => void;
  onFilterChange: (filters: { roles: string[]; status: string }) => void;
}

export function NpcFilters({ onSearch, onFilterChange }: NpcFiltersProps) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleRole = useCallback(
    (role: string) => {
      const next = selectedRoles.includes(role)
        ? selectedRoles.filter((r) => r !== role)
        : [...selectedRoles, role];
      setSelectedRoles(next);
      onFilterChange({ roles: next, status: selectedStatus });
    },
    [selectedRoles, selectedStatus, onFilterChange],
  );

  const changeStatus = useCallback(
    (status: string) => {
      setSelectedStatus(status);
      onFilterChange({ roles: selectedRoles, status });
    },
    [selectedRoles, onFilterChange],
  );

  const removeRole = useCallback(
    (role: string) => {
      const next = selectedRoles.filter((r) => r !== role);
      setSelectedRoles(next);
      onFilterChange({ roles: next, status: selectedStatus });
    },
    [selectedRoles, selectedStatus, onFilterChange],
  );

  const clearStatus = useCallback(() => {
    setSelectedStatus('all');
    onFilterChange({ roles: selectedRoles, status: 'all' });
  }, [selectedRoles, onFilterChange]);

  const hasActiveFilters =
    selectedRoles.length > 0 || selectedStatus !== 'all';

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--color-text-muted)" />
          <Input
            placeholder="Search the rogue's gallery..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 bg-(--color-surface-input) border-(--color-border-default) text-(--color-text-primary) placeholder:text-(--color-text-muted)"
          />
        </div>
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDropdown(!showDropdown)}
            className={cn(
              'border-(--color-border-default)',
              hasActiveFilters &&
                'border-(--color-accent-purple) text-(--color-accent-purple)',
            )}
          >
            <Filter className="size-4" />
          </Button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-card bg-(--color-surface-elevated) border border-(--color-border-default) shadow-card p-4 z-50 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) mb-2">
                  Role
                </p>
                <div className="space-y-1">
                  {NPC_ROLES.map((role) => (
                    <label
                      key={role}
                      className="flex items-center gap-2 cursor-pointer text-sm text-(--color-text-secondary) hover:text-(--color-text-primary)"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="rounded accent-(--color-accent-purple)"
                      />
                      {NPC_ROLE_LABELS[role]}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted) mb-2">
                  Status
                </p>
                <div className="space-y-1">
                  {['all', 'active', 'deceased', 'hidden'].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer text-sm text-(--color-text-secondary) hover:text-(--color-text-primary)"
                    >
                      <input
                        type="radio"
                        name="npc-status-filter"
                        checked={selectedStatus === status}
                        onChange={() => changeStatus(status)}
                        className="accent-(--color-accent-purple)"
                      />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedRoles.map((role) => (
            <span
              key={role}
              className="bg-(--color-surface-elevated) border border-(--color-border-default) text-(--color-text-secondary) text-xs px-2 py-1 rounded-full flex items-center gap-1"
            >
              {NPC_ROLE_LABELS[role as keyof typeof NPC_ROLE_LABELS] ?? role}
              <button onClick={() => removeRole(role)} className="hover:text-(--color-text-primary)">
                <X className="size-3" />
              </button>
            </span>
          ))}
          {selectedStatus !== 'all' && (
            <span className="bg-(--color-surface-elevated) border border-(--color-border-default) text-(--color-text-secondary) text-xs px-2 py-1 rounded-full flex items-center gap-1">
              {selectedStatus.charAt(0).toUpperCase() +
                selectedStatus.slice(1)}
              <button onClick={clearStatus} className="hover:text-(--color-text-primary)">
                <X className="size-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
