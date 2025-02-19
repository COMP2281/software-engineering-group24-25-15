import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# 1. Specify the model path
model_path = "ibm-granite/granite-3.0-2b-instruct"

# 2. Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_path)

# 3. Load the model with device_map="auto"
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    device_map="auto"  # automatically offloads layers to GPU/CPU as needed
)
model.eval()

# 4. Construct your chat prompt
chat = [
    {
        "role": "user",
        "content": (
            "Start explaining what quantum computing is. "
            "During explanation come to one of the key concept adn ask immaginary student question about this concept that will test understanding."
           
        )
    }
]

# 5. Apply Granite's chat template if available; otherwise treat as plain text
chat_template = tokenizer.apply_chat_template(
    chat, tokenize=False, add_generation_prompt=True
)

# 6. Tokenize the prompt (no '.to("auto")' here)
input_tokens = tokenizer(chat_template, return_tensors="pt")

# 7. Move tokens to the same device as the model's first layer
#    PyTorch doesn't understand '.to("auto")', so we use model.device
input_tokens = {k: v.to(model.device) for k, v in input_tokens.items()}

# 8. Generate output
output_tokens = model.generate(**input_tokens, max_new_tokens=100)

# 9. Decode output
output_text = tokenizer.batch_decode(output_tokens)

# 10. Print the response
print(output_text)
