import roomsData from './rooms.json';

export interface Room {
  id: string;
  name: string;
  office: string | null;
  floor: number | null;
  capacity: number | null;
  icon: string;
  type: 'physical' | 'virtual';
  image?: string;
  floorplan?: string;
}

export const rooms: Room[] = roomsData.rooms as Room[];

export const ROOM_NAMES = rooms.map((room) => room.name);

export const physicalRooms = rooms.filter((room) => room.type === 'physical');
export const virtualRooms = rooms.filter((room) => room.type === 'virtual');

export function getRoomByName(name: string): Room | undefined {
  return rooms.find((room) => room.name.toLowerCase() === name.toLowerCase());
}

export function getRoomById(id: string): Room | undefined {
  return rooms.find((room) => room.id === id);
}

export function getRoomIcon(roomName: string): string {
  const room = getRoomByName(roomName);
  return room?.icon ?? 'MapPin';
}
