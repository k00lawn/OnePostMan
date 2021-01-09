from gensim.models.word2vec import Word2Vec
from cleaner import clean
from nltk.corpus import stopwords
from string import punctuation
from time import time

def main(caption):

    model = Word2Vec.load('w2v/word2vec.bin')
    text = clean(caption, lemmatize=True, stop_words = True)
    sw = set(stopwords.words('English'))        
    hashtags = []
    for i in text:

        try:
            s = time()
            hashtag = model.wv.most_similar(i)
            e = time()

            print(f"function finished in : {e-s}")

        except KeyError:
            hashtag = False


        if hashtag:        
            for tags,score in hashtag:
                if tags not in punctuation and tags not in sw and len(tags) > 2:
                    tag = f"#{tags}"
                    hashtags.append(tag)
            
    return hashtags

