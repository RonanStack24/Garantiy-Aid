"""Serve the exported Expo web preview on localhost with SPA route fallback."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

preview_root = Path(__file__).resolve().parents[1] / "dist"

class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(preview_root), **kwargs)

    def do_GET(self):
        request_path = urlsplit(self.path).path
        if not Path(self.translate_path(request_path)).exists() and not Path(request_path).suffix:
            self.path = "/index.html"
        super().do_GET()

if __name__ == "__main__":
    print("GarantiyAid preview: http://127.0.0.1:8765", flush=True)
    ThreadingHTTPServer(("127.0.0.1", 8765), PreviewHandler).serve_forever()
