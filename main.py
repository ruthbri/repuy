from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import ObjectId

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
def join_room(player_id: str, room_id: str):
    player = players_collection.find_one({"_id": player_id})
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    games_collection.update_one({"room": room_id}, {"$addToSet": {"players": player_id}})
    return {"message": "Player joined room", "room_id": room_id, "player_id": player_id}

@app.post("/start-game")
def start_game(room_id: str):
    room = rooms_collection.find_one({"_id": room_id})
    if not room:
        return {"error": "Room not found"}, 404
    if room["status"] != "waiting":
        return {"error": "Room is not in a valid state to start a game"}, 400

    new_game = {
        "_id": str(ObjectId()),  # ID único de la partida
        "players": room["players"],
        "tiles": [],
        "room_id": room_id
    }
    games_collection.insert_one(new_game)
    # Actualizar el estado de la sala
    rooms_collection.update_one({"_id": room_id}, {"$set": {"status": "active"}})
    return {"message": "Game started", "game_id": new_game["_id"]}

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

