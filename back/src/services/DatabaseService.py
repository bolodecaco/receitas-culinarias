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
                    name_en TEXT NOT NULL,
                    ingredients TEXT NOT NULL,
                    duration TEXT NOT NULL,
                    difficulty TEXT NOT NULL,
                    description TEXT,
                    servings TEXT NOT NULL,
                    preparation_method TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    image TEXT DEFAULT NULL,
                    category TEXT DEFAULT ''
                )
            ''')
            try:
                cursor.execute('ALTER TABLE recipes ADD COLUMN name_en TEXT DEFAULT ""')
            except sqlite3.OperationalError:
                pass
            try:
                cursor.execute('ALTER TABLE recipes ADD COLUMN category TEXT DEFAULT ""')
            except sqlite3.OperationalError:
                pass
            conn.commit()

    def save_recipe(self, recipe):
        with sqlite3.connect(str(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO recipes (
                    name, name_en, ingredients, duration, difficulty,
                    description, servings, preparation_method, category, image
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                recipe['name'],
                recipe['name_en'],
                json.dumps(recipe['ingredients']),
                recipe['duration'],
                recipe['difficulty'],
                recipe['description'],
                recipe['servings'],
                json.dumps(recipe['preparation_method']),
                recipe.get('category', ''),
                recipe.get('image', None)
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
                    'name_en': row[2],
                    'ingredients': json.loads(row[3]),
                    'duration': row[4],
                    'difficulty': row[5],
                    'description': row[6],
                    'servings': row[7],
                    'preparation_method': json.loads(row[8]),
                    'created_at': row[9],
                    'image': row[10] if row[10] else None,
                    'category': row[11] if len(row) > 11 else ''
                }
                recipes.append(recipe)
            return recipes
        
    def get_recipe(self, recipe_id):
        with sqlite3.connect(str(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM recipes WHERE id = ?', (recipe_id,))
            row = cursor.fetchone()
            if row:
                return {
                    'id': row[0],
                    'name': row[1],
                    'name_en': row[2],
                    'ingredients': json.loads(row[3]),
                    'duration': row[4],
                    'difficulty': row[5],
                    'description': row[6],
                    'servings': row[7],
                    'preparation_method': json.loads(row[8]),
                    'created_at': row[9],
                    'image': row[10] if row[10] else None,
                    'category': row[11] if len(row) > 11 else ''
                }
            return None
        
    def add_image(self, recipe_id, image_url):
        with sqlite3.connect(str(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM recipes WHERE id = ?', (recipe_id,))
            row = cursor.fetchone()
            if not row:
                return None
            cursor.execute('UPDATE recipes SET image = ? WHERE id = ?', (image_url, recipe_id))
            conn.commit()
            return self.get_recipe(recipe_id)