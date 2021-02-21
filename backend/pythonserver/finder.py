import os 


print(f"Current working dir : {os.getcwd()}")
dir = os.listdir('../../')
print(f"is there nodeserver in this dir : {'nodeserver' in dir}")
print(f"listing all the dir inside this dir : {dir}")
