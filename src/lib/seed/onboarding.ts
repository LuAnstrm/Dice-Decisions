// Onboarding is disabled in no-AppSchema mode.

export async function cloneTowerOfFateForDM(
  client: unknown,
  newUserId: string,
): Promise<{ campaignId: string | null; error: string | null }> {
  void client;
  void newUserId;
  return {
    campaignId: null,
    error: 'AppSchema onboarding is disabled.',
  };
}

export async function createDemoCharacterForPlayer(
  client: unknown,
  newUserId: string,
): Promise<{ characterId: string | null; error: string | null }> {
  void client;
  void newUserId;
  return {
    characterId: null,
    error: 'AppSchema onboarding is disabled.',
  };
}
