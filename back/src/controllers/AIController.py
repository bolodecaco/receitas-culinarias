from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from src.services.AIService import AIService

app = Flask(__name__)
cors = CORS(app)
ai_service = AIService()


@app.route('/api/recipes/', methods=['GET'])
def list_recipes():
    try:
        category = request.args.get('category')
        recipes = ai_service.list_recipes()
        if category and category != 'all':
            category_map = {
                "breakfast": ["breakfast", "café da manhã", "cafe da manha"],
                "lunch": ["lunch", "almoço", "almoco"],
                "dinner": ["dinner", "jantar"],
                "desserts": ["desserts", "sobremesas", "sobremesa"],
                "vegetarian": ["vegetarian", "vegetariana", "vegetariano", "vegetarianas"]
            }
            valid = category_map.get(category.lower(), [category.lower()])
            recipes = [r for r in recipes if r.get('category', '').lower() in valid]
        return jsonify(recipes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/recipes/<int:recipe_id>/', methods=['GET'])
def get_recipe(recipe_id):
    try:
        recipe = ai_service.get_recipe(recipe_id)
        if recipe:
            return jsonify(recipe), 200
        else:
            return jsonify({"error": "Recipe not found"}), 404
    except Exception as e:
            return jsonify({"error": str(e)}), 500


@app.route('/api/recipes/image/<int:recipe_id>/', methods=['POST'])
def add_image(recipe_id):
    image = request.json.get('image')
    if not image:
        return jsonify({"error": "Image URL is required"}), 400
    try:
        ai_service.add_image(recipe_id, image)
        return jsonify({"message": "Image added successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/recipes/ai/', methods=['POST'])
def generate_recipe():
    prompt = request.json.get('prompt')
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    try:
        recipe = ai_service.generate_recipe(prompt)
        return jsonify(recipe), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
