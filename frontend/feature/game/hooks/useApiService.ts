import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { services } from "../services/services";
import { useState } from "react";

const fetcher = async (key: string, ...args: any[]) => {
  const [endpoint, ...params] = key.split(":");
  switch (endpoint) {
    case "/create-room":
      return services.createRoom();
    case "/join-room":
      return services.joinRoom(params[0], params[1]);
    case "/start-game":
      return services.startGame(params[0]);
    case "/players":
      return services.getPlayers();
    case "/get-room":
      return services.getRoom(params[0]);
    case "/assign-turn":
      return services.assignTurn(params[0]);
    case "/get-game":
      return services.getGame(params[0]);
    case "/tiles":
      return services.getTiles();
    case "/place-tile":
      return services.placeTile(params[0], params[1], +params[2], +params[3]);
    default:
      throw new Error(`No se encontró un endpoint para ${endpoint}`);
  }
};

// Hook para crear una sala

export function useCreateRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const createRoom = async () => {
    setLoading(true);
    setError(null);

    try {
      const { room_id } = await services.createRoom();
      setRoomId(room_id);
      return { room_id };
    } catch (err: any) {
      setError(err.message || "Error al crear la sala");
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { createRoom, roomId, loading, error };
}

// Hook para unirse a una sala
export function useJoinRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinRoom = async (playerId: string, roomId: string) => {
    setLoading(true);
    setError(null);

    try {
      
      const response = await services.joinRoom(playerId, roomId);
      return { response };
    } catch (err: any) {
      setError(err.message || "Error al unirse a la sala");
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { joinRoom, loading, error };
}

// Hook para iniciar un juego
export function useStartGame() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const startGame = async (roomId: string) => {
    setLoading(true);
    setError(null);
    setGameId(null);

    try {
      const response = await services.startGame(roomId);
      setGameId(response.game_id);
      return { game_id: response.game_id };
    } catch (err: any) {
      setError(err.message || "Error al iniciar el juego");
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { startGame, gameId, loading, error };
}

// Hook para obtener jugadores
export function useGetPlayers(
  config?: SWRConfiguration
): SWRResponse<{ players: any[] }> {
  const shouldFetch = true; // Siempre se debe obtener la lista de jugadores
  return useSWR(shouldFetch ? "/players" : null, fetcher, config);
}

// Hook para obtener una sala específica
export function useGetRoom(
  roomId?: string,
  config?: SWRConfiguration
): SWRResponse<any> {
  const shouldFetch = !!roomId; // Solo realiza fetch si roomId es válido
  return useSWR(
    shouldFetch ? `/get-room/${roomId}` : null,
    async () => {
      return await services.getRoom(roomId!);
    },
    config
  );
}

// Hook para asignar turno
export function useAssignTurn(
  roomId?: string,
  config?: SWRConfiguration
): SWRResponse<{ player_turn: string }> {
  const shouldFetch = !!roomId; // Solo realiza fetch si roomId es válido
  return useSWR(
    shouldFetch ? `/assign-turn/${roomId}` : null,
    async () => {
      return await services.assignTurn(roomId!);
    },
    config
  );
}

// Hook para obtener un juego específico
export function useGetGame(
  gameId?: string,
  config?: SWRConfiguration
): SWRResponse<any> {
  const shouldFetch = !!gameId; // Solo realiza fetch si gameId es válido
  return useSWR(
    shouldFetch ? `/get-game/${gameId}` : null,
    async () => {
      return await services.getGame(gameId!);
    },
    config
  );
}

// Hook para obtener jugadores del juego
export const usePlayersGame = (roomId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    roomId ? `/players/${roomId}` : null, // Si no hay roomId, no se realiza la solicitud
    () => services.getPlayers() // Llama al servicio para obtener los jugadores
  );

  return {
    players: data?.players || [], // Devuelve la lista de jugadores
    loading: isLoading,
    error,
    refetch: mutate, // Permite refetch manual si es necesario
  };
};

// Hook para obtener detalles de una sala
export function useRoom(
  roomId: string,
  config?: SWRConfiguration
): SWRResponse<any> {
  return useSWR(`/get-room:${roomId}`, fetcher, config);
}

// Hook para obtener tiles
export function useTiles() {
  const [tiles, setTiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await services.getTiles();
      setTiles(response.tiles);
    } catch (err: any) {
      setError(err.message || "Error al obtener las fichas");
    } finally {
      setLoading(false);
    }
  };

  return { tiles, fetchTiles, loading, error };
}
// Hook para obtener las fichas
export function useGetTiles(
  config?: SWRConfiguration
): SWRResponse<{ tiles: any[] }> {
  const shouldFetch = true; // Siempre se deben obtener las fichas
  return useSWR(shouldFetch ? "/tiles" : null, fetcher, config);
}

// Hook para colocar una ficha
export function usePlaceTile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeTile = async (
    roomId: string,
    tileId: string,
    x: number,
    y: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      await services.placeTile(roomId, tileId, x, y);
    } catch (err: any) {
      setError(err.message || "Error al colocar la ficha");
    } finally {
      setLoading(false);
    }
  };

  return { placeTile, loading, error };
}

export interface Player {
  _id: string;
  name: string;
}

export const useCreatePlayer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  const createPlayer = async (name: string) => {
    setLoading(true);
    setError(null);

    try {
      const response =  await services.createPlayer(name);
      setPlayer(response); // Guardamos el jugador creado
      return response;
    } catch (err:any) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createPlayer,
    loading,
    error,
    player,
  };
};
