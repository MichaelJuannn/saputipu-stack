from transformers import BertTokenizer, TFBertModel
import keras
import sys
data = sys.argv[1:]
text = ' '.join(data)
tokenizer = BertTokenizer.from_pretrained('./python/assets/')
loaded_model = keras.models.load_model('./python/model/scam_class.h5', custom_objects={"TFBertModel": TFBertModel})
test_pre = tokenizer(text=text,add_special_tokens=True,max_length=50,padding='max_length',
                        truncation=True,return_tensors='tf',return_token_type_ids=False,verbose=True,return_attention_mask=True)
input_obj = {'input_ids': test_pre['input_ids'], 'attention_mask': test_pre['attention_mask']}
prediction = loaded_model.predict(input_obj)
print(f'[{prediction[0][0]},{prediction[0][1]},{prediction[0][2]}]')