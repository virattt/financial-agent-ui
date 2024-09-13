import subprocess
import sys
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class ChangeHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        if event.src_path.endswith('.py'):
            print("Detected change. Restarting...")
            subprocess.call([sys.executable, "-m", "gen_ui_backend.server"])


if __name__ == "__main__":
    observer = Observer()
    observer.schedule(ChangeHandler(), path='.', recursive=True)
    observer.start()

    try:
        subprocess.call([sys.executable, "-m", "gen_ui_backend.server"])
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
