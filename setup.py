import os
import subprocess
import sys

def run_command(command):
    shell = os.name == "nt"  # Windows requires shell=True
    subprocess.run(command, shell=shell, check=True)

def create_superuser():
    command = [
        sys.executable, "game_server/manage.py", "shell", "-c",
        (
            "from django.contrib.auth import get_user_model; "
            "User = get_user_model(); "
            "username='admin'; email='admin@example.com'; password='yourpassword'; "
            "print('Superuser already exists') if User.objects.filter(username=username).exists() "
            "else User.objects.create_superuser(username=username, email=email, password=password)"
        )
    ]
    run_command(command)

def run_react_native():
    react_native_path = os.path.join(os.getcwd(), 'react-native-app')
    
    if os.name == "nt":
        # For Windows - Use `start` to open a new command prompt
        subprocess.Popen(f'start cmd.exe /k "cd {react_native_path} && npm install && npx expo start"', shell=True)
    else:
        # For MacOS and Linux - Use `open` or `gnome-terminal`
        terminal_cmd = f'cd {react_native_path} && npm install && npx expo start'
        if sys.platform == 'darwin':
            subprocess.Popen(['open', '-a', 'Terminal', terminal_cmd])
        else:
            subprocess.Popen(['gnome-terminal', '--', 'bash', '-c', terminal_cmd])

def main():
    print("Setting up Django project...")

    run_command([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

    run_command([sys.executable, "game_server/manage.py", "migrate"])

    create_superuser()

    run_command([sys.executable, "game_server/import_questions.py"])

    try:
        print("\nStarting Django server...")
        backend_process = subprocess.Popen(
            [sys.executable, "game_server/manage.py", "runserver"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("\nStarting React Native app...")
        run_react_native()

        backend_process.communicate()

    except KeyboardInterrupt:
        print("\nServer stopped by user.")

if __name__ == "__main__":
    main()
