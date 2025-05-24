import sqlite3
import json
from pathlib import Path

class DatabaseService:
    def __init__(self):
        self.db_path = Path(__file__).parent.parent.parent / "database" / "recipes.db"
        self.db_path.parent.mkdir(exist_ok=True)
        self._create_tables()

    def _create_tables(self):
        with sqlite3.connect(str(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS recipes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    ingredients TEXT NOT NULL,
                    duration TEXT NOT NULL,
                    difficulty TEXT NOT NULL,
                    description TEXT,
                    servings TEXT NOT NULL,
                    preparation_method TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()

    def save_recipe(self, recipe):
        with sqlite3.connect(str(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO recipes (
                    name, ingredients, duration, difficulty,
                    description, servings, preparation_method
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                recipe['name'],
                json.dumps(recipe['ingredients']),
                recipe['duration'],
                recipe['difficulty'],
                recipe['description'],
                recipe['servings'],
                json.dumps(recipe['preparation_method']) 
            ))
            conn.commit()
            return cursor.lastrowid
        
    def list_recipes(self):
        with sqlite3.connect(str(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM recipes')
            rows = cursor.fetchall()
            recipes = []
            for row in rows:
                recipe = {
                    'id': row[0],
                    'name': row[1],
                    'ingredients': json.loads(row[2]),
                    'duration': row[3],
                    'difficulty': row[4],
                    'description': row[5],
                    'servings': row[6],
                    'preparation_method': json.loads(row[7]),
                    'created_at': row[8]
                }
                recipes.append(recipe)
            return recipes