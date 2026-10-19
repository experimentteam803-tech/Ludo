import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface RoomState {
  roomId: string;
  hostId: string;
  players: { uid: string; name: string; color: string; isReady: boolean }[];
  status: 'waiting' | 'in_game' | 'completed';
}

export class MultiplayerService {
  public static async createRoom(roomId: string, host: { uid: string; name: string }) {
    const roomRef = doc(db, 'game_rooms', roomId);
    await setDoc(roomRef, {
      roomId,
      hostId: host.uid,
      players: [{ uid: host.uid, name: host.name, color: 'red', isReady: true }],
      status: 'waiting',
      createdAt: Date.now()
    });
  }

  public static subscribeRoom(roomId: string, onUpdate: (data: RoomState) => void) {
    return onSnapshot(doc(db, 'game_rooms', roomId), (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as RoomState);
      }
    });
  }
}
