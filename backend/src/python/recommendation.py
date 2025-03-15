import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def main():
    try:
        # Load JSON input from Node.js
        input_data = json.loads(sys.stdin.read())

        # Debugging: Print the input data structure
        # print("Input Data:", input_data)  # Uncomment for debugging

        # Check if 'cart' is a list and print its structure
        if "cartData" not in input_data or not isinstance(input_data["cartData"], list):
            raise ValueError("Invalid input: 'cart' is missing or not a list.")

        # Extract cart items and product descriptions
        cart_descriptions = " ".join([p["mealName"] for p in input_data["cartData"] if isinstance(p, dict) and "mealName" in p])
        products = input_data.get("products", [])
        
        # Prepare descriptions for vectorization
        descriptions = [p["strMeal"] for p in products if isinstance(p, dict) and "strMeal" in p]

        # Compute TF-IDF matrix
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(descriptions)
        cart_vector = vectorizer.transform([cart_descriptions])

        # Compute cosine similarity
        similarities = cosine_similarity(cart_vector, tfidf_matrix)[0]

        # Sort and get top recommendations
        recommended = sorted(
            [
                {**p, "score": similarities[i]}  # Merge all product fields and add similarity score
                for i, p in enumerate(products)
            ],
            key=lambda x: x["score"],
            reverse=True
        )[:3]  # Get top 3 recommendations

        # Return full product details to Node.js
        print(json.dumps(recommended))  # Output valid JSON

    except Exception as e:
        # Print error message to stderr
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)  # Exit with error code

if __name__ == "__main__":
    main()