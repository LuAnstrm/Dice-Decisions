import { createLocalClient } from '@/lib/local-db';

export function createClient() {
  return createLocalClient();
}
