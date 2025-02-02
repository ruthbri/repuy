from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel

class Player(BaseModel):
    name: str

class JoinRoomRequest(BaseModel):
    player_id: str
    room_id: str
class StartGameRequest(BaseModel):
    room_id: str    

app = FastAPI()

client = MongoClient("mongodb://mongodb:27017")  # "mongodb" es el nombre del servicio en docker-compose
db = client["game_tepuy"]
players_collection = db["players"]
games_collection = db["games"]
rooms_collection = db["rooms"]

def serialize_id(data):
    if isinstance(data, list):
        return [{**item, "_id": str(item["_id"])} for item in data]
    elif isinstance(data, dict):
        data["_id"] = str(data["_id"])
        return data
    return data

@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI Game API"}

@app.get("/create-room")
def create_room():
    new_room = {
        "_id": str(ObjectId()),
        "players": [],
        "status": "waiting"
    }
    rooms_collection.insert_one(new_room)
    return {"message": "Room created", "room_id": new_room["_id"]}

@app.get("/get-room/{room_id}")
def get_room(room_id: str):
    room = rooms_collection.find_one({"_id": room_id})
    if not room:
        return {"error": "Room not found"}, 404
    return room

@app.post("/join-room")
def join_room(request: JoinRoomRequest):
    # Validar el formato del player_id y room_id (asegurarse de que son ObjectId válidos)
    try:
        player_id = request.player_id
        room_id = request.room_id
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid player_id or room_id format")
    
    # Buscar el jugador en la base de datos
    player = players_collection.find_one({"_id": player_id})
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")

    # Buscar la sala en la base de datos
    room = rooms_collection.find_one({"_id": room_id})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # Agregar el jugador a la sala
    rooms_collection.update_one(
        {"_id": room_id}, 
        {"$addToSet": {"players": player_id}}
    )

    return {"message": "Player joined room", "room_id": str(room_id), "player_id": str(player_id)}


@app.post("/create-player")
def create_player(player: Player):
    # Crear un nuevo jugador
    new_player = {
        "_id": str(ObjectId()),
        "name": player.name,  # Registrar la fecha de creación
        "current_game_code": ""

    }
    print(new_player)
    players_collection.insert_one(new_player)
    return {"message": "Player created", "player": serialize_id(new_player)}

@app.post("/start-game")
def start_game(request: StartGameRequest):
    print("Request recibido:", request)
    room_id = request.room_id
    print(room_id)
    # Verificar si la sala existe
    room = rooms_collection.find_one({"_id": room_id})
    print(room)
    if not room:
        raise HTTPException(status_code=404, detail=f"Room with ID {room_id} not found.")

    # Verificar el estado de la sala
    if room.get("status") != "waiting":
        raise HTTPException(status_code=400, detail="Room is not in a valid state to start a game.")

    # Crear una nueva partida
    new_game = {
        "_id": str(ObjectId()),  # ID único de la partida
        "players": room.get("players", []),
        "tiles": [],  # Aquí puedes inicializar las fichas si es necesario
        "room": room_id,
    }
    print(new_game)
    games_collection.insert_one(new_game)
    print("Game inserted")
    # Actualizar el estado de la sala
    rooms_collection.update_one(
        {"_id": room_id},
        {"$set": {"status": "in_progress"}}
    )
    print("Room updated")
    return {
        "message": "Game started successfully",
        "game_id": new_game["_id"],
        "room_id": room_id,
        "players": new_game["players"]
    }

@app.get("/get-game/{game_id}")
def get_game(game_id: str):
    game = games_collection.find_one({"_id": game_id})
    if not game:
        return {"error": "Game not found"}, 404
    return game


@app.get("/assign-turn/{room_id}")
def assign_turn(room_id: str):
    game = games_collection.find_one({"room": room_id})
    if not game:
        raise HTTPException(status_code=404, detail="Room not found")
    players = game.get("players", [])
    if not players:
        raise HTTPException(status_code=400, detail="No players in room")
    return {"message": "Turn assigned", "player_turn": players[0]}

@app.get("/get-tile/{room_id}")
def get_tile(room_id: str):
    tile = db.tiles.find_one()
    if not tile:
        raise HTTPException(status_code=404, detail="No tiles available")
    return serialize_id(tile)

@app.post("/place-tile")
def place_tile(room_id: str, tile_id: str, x: int, y: int):
    games_collection.update_one(
        {"room": room_id},
        {"$push": {"tiles": {"_id": tile_id, "position": {"x": x, "y": y}}}}
    )
    return {"message": "Tile placed", "tile_id": tile_id, "position": {"x": x, "y": y}}

@app.post("/place-token")
def place_token(player_id: str, tile_id: str, x: int, y: int):
    return {"message": "Token placed", "player_id": player_id, "tile_id": tile_id, "position": {"x": x, "y": y}}

@app.get("/score/{room_id}")
def get_score(room_id: str):
    return {"message": "Score retrieved", "scores": []}

@app.get("/players")
def get_players():
    players = list(players_collection.find())
    return {"players": serialize_id(players)}

@app.get("/player-game/{player_id}")
def get_player_game(player_id: str):
    player = players_collection.find_one({"_id": player_id})
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")

    game = games_collection.find_one({"players": player_id})
    if not game:
        raise HTTPException(status_code=404, detail="No game found for this player")

    return {"player_id": player_id, "game": serialize_id(game)}

@app.get("/tiles")
def get_all_tiles():
    tiles = list(db.tiles.find())
    return {"tiles": serialize_id(tiles)}

@app.get("/tiles/{tile_id}")
def get_tile_by_id(tile_id: str):
    tile = db.tiles.find_one({"_id": tile_id})
    if not tile:
        raise HTTPException(status_code=404, detail="Tile not found")
    return {"tile": serialize_id(tile)}

