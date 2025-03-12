import os
import subprocess
import sys

def run_command(command):
    shell = os.name == "nt"  # Windows requires shell=True
    subprocess.run(command, shell=shell, check=True)

def create_superuser():
    # This command will run a one-liner in the Django shell to create the superuser.
    # It first checks if a user with username 'admin' exists.
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

def main():
    print("Setting up Django project...")

    # Install dependencies
    run_command([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

    # Apply migrations
    run_command([sys.executable, "game_server/manage.py", "migrate"])
    
    # Create superuser non-interactively (if needed)
    create_superuser()

    # add quesiton from GameQuestionsInitial.csv to db
    run_command([sys.executable, "game_server/import_questions.py"])

    # Run server with graceful shutdown on Ctrl+C
    try:
        run_command([sys.executable, "game_server/manage.py", "runserver"])
    except KeyboardInterrupt:
        print("\nServer stopped by user.")

if __name__ == "__main__":
    main()