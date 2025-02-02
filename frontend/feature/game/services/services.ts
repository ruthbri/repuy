import axios from "axios";

// Configurar Axios
const api = axios.create({
  baseURL: "http://localhost:8000", // Cambia esto por la URL de tu servidor
});
interface Player {
  _id: string;
  name: string;
}


export const services = {
  async createRoom(): Promise<{ room_id: string }> {
    const response = await api.get("/create-room");
    return response.data;
  },

  async joinRoom(playerId: string, roomId: string): Promise<any> {
    const response =await api.post("/join-room", { player_id: playerId, room_id: roomId });
    return response.data;
  },
  async createPlayer(name: string): Promise<Player> {
    const response = await api.post(`/create-player`, { name });
 
    return response.data.player;
  },
  async startGame(roomId: string): Promise<{ game_id: string }> {
    const response = await api.post("/start-game", { room_id: roomId });
    console.log("game data",response);
    return response.data;
  },

  async getPlayers(): Promise<{ players: any[] }> {
    const response = await api.get("/players");
    return response.data;
  },

  async getPlayersGame(roomId: string): Promise<{ players: any[] }> {
    const response = await api.get(`/players/${roomId}`);
    return response.data;
  },

  async getRoom(roomId: string): Promise<any> {
    const response = await api.get(`/get-room/${roomId}`);
    return response.data;
  },

  async assignTurn(roomId: string): Promise<{ player_turn: string }> {
    const response = await api.get(`/assign-turn/${roomId}`);
    return response.data;
  },

  async getGame(gameId: string): Promise<any> {
    const response = await api.get(`/get-game/${gameId}`);
    return response.data;
  },

  async getTiles(): Promise<{ tiles: any[] }> {
    const response = await api.get("/tiles");
    return response.data;
  },

  async placeTile(
    roomId: string,
    tileId: string,
    x: number,
    y: number
  ): Promise<void> {
    await api.post("/place-tile", { room_id: roomId, tile_id: tileId, x, y });
  },
};
