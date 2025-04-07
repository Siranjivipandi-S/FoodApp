import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def main():
    try:
        input_data = json.loads(sys.stdin.read())

        if "cart" not in input_data or not isinstance(input_data["cart"], list):
            raise ValueError("Invalid input: 'cart' is missing or not a list.")

        if "products" not in input_data or not isinstance(input_data["products"], list):
            raise ValueError("Invalid input: 'products' is missing or not a list.")

        # Extract cart descriptions
        cart_descriptions = " ".join([
            p["mealName"] for p in input_data["cart"] if isinstance(p, dict) and "mealName" in p
        ]).strip()

        # Log to stderr for debugging, not stdout
        print(f"Cart Descriptions: {cart_descriptions}", file=sys.stderr)

        if not cart_descriptions:
            print(json.dumps([]))  # Return empty list if no cart data
            return

        products = input_data["products"]

        # Extract product descriptions
        descriptions = [
            p["strMeal"] for p in products if isinstance(p, dict) and "strMeal" in p
        ]

        if not descriptions:
            print(json.dumps([]))  # No valid data to process, return empty list
            return

        # Compute TF-IDF matrix
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(descriptions)

        # Transform cart descriptions
        cart_vector = vectorizer.transform([cart_descriptions])

        # Compute cosine similarity
        similarities = cosine_similarity(cart_vector, tfidf_matrix)[0]

        # Sort and get top recommendations
        recommended = sorted(
            [
                {**p, "score": float(similarities[i])}  # Ensure score is serializable
                for i, p in enumerate(products)
            ],
            key=lambda x: x["score"],
            reverse=True
        )[:6]  # Return top 3 recommendations

        # Output only JSON
        print(json.dumps(recommended))
    except Exception as e:
        # Log errors to stderr, not stdout
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)  # Exit with non-zero code for failure

if __name__ == "__main__":
    main()
