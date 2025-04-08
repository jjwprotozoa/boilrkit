import os
from datetime import datetime

# Define the project path
project_path = r"C:\Users\DevBox\Boilrkit\boilrkit"

# Get timestamp
timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Compose commit message
commit_message = f"🔥 Updated CLI: Desktop Commander GUI + fallback fix + full README integration ({timestamp})"

# List of Git commands
commands = [
    f"cd /d {project_path}",
    "git add .",
    f"git commit -m \"{commit_message}\"",
    "git push origin main"
]

# Print the commands or execute them directly
print("\nGenerated Git Commands:\n")
for cmd in commands:
    print(cmd)

# Optional: Run the commands automatically
run_commands = input("\nRun commands now? (y/N): ").strip().lower()
if run_commands == 'y':
    for cmd in commands:
        print(f"\n→ Running: {cmd}")
        os.system(cmd)
