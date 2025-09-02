import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer

nltk.download('stopwords')

stop_words = set(stopwords.words('portuguese'))
stemmer = SnowballStemmer('portuguese')

def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'\W+', ' ', text)
    tokens = text.split()
    tokens = [stemmer.stem(word) for word in tokens if word not in stop_words]
    return ' '.join(tokens)
