import type { MapData, MapMarkerData, MarkerFormData } from '@/types/maps';
import { ACCEPTED_IMAGE_TYPES, MAX_MAP_FILE_SIZE } from '@/lib/validations/maps';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataClient = any;

export async function getMaps(
  dataClient: DataClient,
  campaignId: string,
): Promise<MapData[]> {
  const { data, error } = await dataClient
    .from('campaign_maps')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to fetch maps: ${error.message}`);
  return (data || []).map((m: MapData) => ({ ...m, markers: [] }));
}

export async function getMapWithMarkers(
  dataClient: DataClient,
  mapId: string,
  isDM: boolean,
): Promise<MapData> {
  const { data: map, error: mapError } = await dataClient
    .from('campaign_maps')
    .select('*')
    .eq('id', mapId)
    .single();

  if (mapError) throw new Error('Map not found');

  let markersQuery = dataClient
    .from('map_markers')
    .select('*')
    .eq('map_id', mapId)
    .order('created_at', { ascending: true });

  if (!isDM) {
    markersQuery = markersQuery.eq('is_visible_to_players', true);
  }

  const { data: markers, error: markersError } = await markersQuery;
  if (markersError) throw new Error(`Failed to fetch markers: ${markersError.message}`);

  return { ...map, markers: markers || [] };
}

export async function createMap(
  dataClient: DataClient,
  campaignId: string,
  name: string,
  imageFile: File,
): Promise<MapData> {
  // Validate file type
  if (!ACCEPTED_IMAGE_TYPES.includes(imageFile.type)) {
    throw new Error('Only JPG, PNG, and WebP images are supported.');
  }

  // Validate file size
  if (imageFile.size > MAX_MAP_FILE_SIZE) {
    const sizeMB = (imageFile.size / (1024 * 1024)).toFixed(1);
    throw new Error(`Image must be under 5MB. Selected file is ${sizeMB} MB.`);
  }

  // Generate unique file path
  const ext = imageFile.type.split('/')[1] === 'jpeg' ? 'jpg' : (imageFile.type.split('/')[1] ?? 'png');
  const filePath = `maps/${campaignId}/${crypto.randomUUID()}.${ext}`;

  // Upload to dataClient Storage
  const { error: uploadError } = await dataClient.storage
    .from('maps')
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  // Get public URL
  const { data: urlData } = dataClient.storage.from('maps').getPublicUrl(filePath);
  const imageUrl = urlData.publicUrl;

  // Determine sort order
  const { count } = await dataClient
    .from('campaign_maps')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId);

  const sortOrder = (count ?? 0) + 1;

  // Insert map record
  const { data: map, error: insertError } = await dataClient
    .from('campaign_maps')
    .insert({
      campaign_id: campaignId,
      name,
      image_url: imageUrl,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (insertError) throw new Error(`Failed to create map: ${insertError.message}`);
  return { ...map, markers: [] };
}

export async function updateMap(
  dataClient: DataClient,
  mapId: string,
  data: { name?: string; sort_order?: number },
): Promise<MapData> {
  const { data: map, error } = await dataClient
    .from('campaign_maps')
    .update(data)
    .eq('id', mapId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update map: ${error.message}`);
  return { ...map, markers: [] };
}

export async function deleteMap(
  dataClient: DataClient,
  mapId: string,
): Promise<void> {
  // Get map to extract storage path
  const { data: map, error: fetchError } = await dataClient
    .from('campaign_maps')
    .select('image_url')
    .eq('id', mapId)
    .single();

  if (fetchError) throw new Error(`Map not found: ${fetchError.message}`);

  // Extract file path from URL
  const url = new URL(map.image_url);
  const pathParts = url.pathname.split('/storage/v1/object/public/maps/');
  const storagePath = pathParts[1];

  if (storagePath) {
    const { error: storageError } = await dataClient.storage
      .from('maps')
      .remove([storagePath]);

    if (storageError) {
      console.warn('Failed to delete map image from storage:', storageError.message);
    }
  }

  // Delete markers first, then map
  await dataClient.from('map_markers').delete().eq('map_id', mapId);
  const { error: deleteError } = await dataClient
    .from('campaign_maps')
    .delete()
    .eq('id', mapId);

  if (deleteError) throw new Error(`Failed to delete map: ${deleteError.message}`);
}

export async function createMarker(
  dataClient: DataClient,
  data: MarkerFormData & { map_id: string },
): Promise<MapMarkerData> {
  const { data: marker, error } = await dataClient
    .from('map_markers')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(`Failed to create marker: ${error.message}`);
  return marker;
}

export async function updateMarker(
  dataClient: DataClient,
  markerId: string,
  data: Partial<MarkerFormData>,
): Promise<MapMarkerData> {
  const { data: marker, error } = await dataClient
    .from('map_markers')
    .update(data)
    .eq('id', markerId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update marker: ${error.message}`);
  return marker;
}

export async function deleteMarker(
  dataClient: DataClient,
  markerId: string,
): Promise<void> {
  const { error } = await dataClient
    .from('map_markers')
    .delete()
    .eq('id', markerId);

  if (error) throw new Error(`Failed to delete marker: ${error.message}`);
}

export async function toggleMarkerVisibility(
  dataClient: DataClient,
  markerId: string,
  visible: boolean,
): Promise<void> {
  const { error } = await dataClient
    .from('map_markers')
    .update({ is_visible_to_players: visible })
    .eq('id', markerId);

  if (error) throw new Error(`Failed to toggle marker visibility: ${error.message}`);
}
