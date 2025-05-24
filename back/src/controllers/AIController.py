from flask import Flask, request, jsonify
from src.services.AIService import AIService

app = Flask(__name__)
ai_service = AIService()

@app.route('/api/recipes/', methods=['GET'])
def list_recipes():
    try:
        recipes = ai_service.list_recipes()
        return jsonify(recipes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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