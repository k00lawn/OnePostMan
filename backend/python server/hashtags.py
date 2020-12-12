# from gensim.models import Word2Vec , ldamodel
import gensim
from gensim import corpora
from cleaner import clean

# FLAGS = None

# stop_free = " ".join([i for i in doc.lower().split() if i not in useless])
# punc_free = ''.join(ch for ch in stop_free if ch not in punc)
# normalized = " ".join(lemma.lemmatize(word) for word in punc_free.split())

# def language(text):
    
#     blob = TextBlob(text)
#     text_lang = blob.detect_language()
#     langs = {}
#     langs['en'] = 'english'
#     langs['es'] = 'spanish'
#     langs['fr'] = 'french'
    
#     if text_lang in langs.keys():
#         return langs[text_lang]
#     else:
#         raise TypeError
    
# def clean(doc, lang):
    
#     useless = set(stopwords.words(lang))
#     punc = set(string.punctuation) 
#     lemma = WordNetLemmatizer()
    
#     clean_text = []
    
#     for i in doc:
#         if i not in useless and i not in punc:
#             clean_text.append(lemma.lemmatize(i))
    
#     # return ' '.join(clean_text)
#     return clean_text


def lda_model(text):
    dictionary = corpora.Dictionary(text)
    doc_term_matrix = [dictionary.doc2bow(doc) for doc in text]
    Lda = gensim.models.ldamodel.LdaModel
    ldamodel = Lda(doc_term_matrix, num_topics=100, id2word = dictionary, passes=50)
    topic = ldamodel.print_topics(num_topics=5, num_words=5)

    print(f"""
          dictionary : {dictionary}
          doc_matrix : {doc_term_matrix}
          ldamodel : {ldamodel}
          topic : {topic}
          """)
    hashtags = []
    for t in topic: 
        for h in t[1].split('+'):
            hashtags.append('#'+h[h.find('"')+1:h.rfind('"')])

    return set(hashtags)

def word_2_vec(text):
    pass

def main(caption):

    # lang = language(caption)
    # text = nltk.word_tokenize(caption)
    text = clean(caption)
    
    print(lda_model(text))


if __name__ == "__main__":
    main('omg i love japan so much , its so beautiful and full of waifus')