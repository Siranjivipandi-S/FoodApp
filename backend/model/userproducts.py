import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def main():
    try:
        input_data = json.loads(sys.stdin.read())

        if "carts" not in input_data or not isinstance(input_data["carts"], list):
            raise ValueError("Invalid input: 'cart' is missing or not a list.")

        if "products" not in input_data or not isinstance(input_data["products"], list):
            raise ValueError("Invalid input: 'products' is missing or not a list.")

        cart_descriptions = " ".join([
            p["mealName"] for p in input_data["cart"] if isinstance(p, dict) and "mealName" in p
        ]).strip()

        products = input_data["products"]

        descriptions = [
            p["strMeal"] for p in products if isinstance(p, dict) and "strMeal" in p
        ]

        if not descriptions or not cart_descriptions:
            print(json.dumps([]))  # No valid data to process, return empty list
            return

        # Compute TF-IDF matrix
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(descriptions)

        # Ensure cart vector is valid
        if not cart_descriptions.strip():
            print(json.dumps([]))  # No valid cart data
            return

        cart_vector = vectorizer.transform([cart_descriptions])

        # Compute cosine similarity
        similarities = cosine_similarity(cart_vector, tfidf_matrix)[0]

        # Sort and get top recommendations
        recommended = sorted(
            [
                {**p, "score": similarities[i]}  # Merge product data with similarity score
                for i, p in enumerate(products)
            ],
            key=lambda x: x["score"],
            reverse=True
        )[:3]  # Top 6 recommendations


    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)  

if __name__ == "__main__":
    main()
